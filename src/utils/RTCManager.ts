import { ChatMessage, SenderType } from '../types/ChatMessage'
import { User } from '../types/User'
import Crypto from './Crypto'

enum SocketMessageType {
  OFFER = 'O',
  ANSWER = 'A',
  CANDIDATE = 'C'
}

type SocketMessageT<T extends SocketMessageType, U extends RTCSessionDescriptionInit | RTCIceCandidate> = {
  type: T,
  payload: U
}

type SocketDescMessage = SocketMessageT<SocketMessageType.ANSWER | SocketMessageType.OFFER, RTCSessionDescriptionInit>
type SocketCandMessage = SocketMessageT<SocketMessageType.CANDIDATE, RTCIceCandidate>

type SocketMessage = SocketDescMessage | SocketCandMessage

export type SignedMessage = {
  signature: number[] | Uint8Array, // socket.io changes Uint8Array to number[] anyway
  message: SocketMessage
}

type ConnectionConfig = {
  isInitiator: boolean | undefined,
  isNewContact: boolean | undefined,
  selfContactInfo: User | undefined,
  timeout: number | undefined,
  connected: boolean,
  contactID: string | undefined
}

// TODO: Error handling
export default class RTCManager {
  private readonly REQ_TIMEOUT_MILLIS = 30 * 1000 // this needs to be LONG—both contacts need to request simultaneously
  private static _instance: RTCManager

  private connection: RTCPeerConnection
  private channel: RTCDataChannel
  private socket: SocketIOClient.Socket

  private pendingPromise = { resolve: undefined, reject: undefined }

  // Since these are indirectly called by other handlers, we don't need to worry about de-registering on reassignment
  public onchatmessage = (msg: ChatMessage) => {}
  public onconnectionchange = (connected: boolean) => {}

  public currentConfig: ConnectionConfig = {
    isInitiator: undefined,
    isNewContact: undefined,
    selfContactInfo: undefined,
    timeout: undefined,
    connected: false,
    contactID: undefined
  }

  public static get Instance () {
    return this._instance || (this._instance = new this())
  }

  private constructor () {}

  /**
   * Requests of the server a connection with the specified user.
   * @param self the own user's User object.
   * @param recipientID the ID of the user to whom to connect.
   * @param isNewContact whether this is a newly added contact (false if it's from the existing contacts list).
   */
  public requestConnection = (self: User, recipientID: string, isNewContact: boolean) => {
    this.currentConfig.isNewContact = isNewContact
    this.currentConfig.selfContactInfo = self
    this.currentConfig.contactID = recipientID
    this.currentConfig.connected = false
    this.initializePeerConnection()
    if (!this.socket) {
      this.socket = io()
      this.socket.on('message', (msg) => { this.onSocketMessage(msg, recipientID) })
      this.socket.on('send offer', () => { this.currentConfig.isInitiator = true })
      this.socket.on('await offer', () => { this.currentConfig.isInitiator = false })
      this.socket.on('begin connection', this.onBeginConnection)
      this.socket.on('abandon', this.onRequestFailure)
    } else {
      this.socket.connect()
    }

    console.log('sending connection request to server')
    this.socket.emit('request connection',{
      sender: self.id,
      recipient: recipientID
    })
    const promise = new Promise((res: (data?: User) => void, rej: () => void) => {
      this.pendingPromise.resolve = (data?: User) => {
        window.clearTimeout(this.currentConfig.timeout)
        res(data)
        this.pendingPromise = { resolve: undefined, reject: undefined }
      }
      this.pendingPromise.reject = () => {
        this.pendingPromise = { resolve: undefined, reject: undefined }
        if (rej) rej()
      }
    })
    this.currentConfig.timeout = window.setTimeout(this.onRequestFailure, this.REQ_TIMEOUT_MILLIS)
    return promise
  }

  /**
   * Sends a chat message over the data channel if the connection allows.
   * @param message the message to send.
   */
  public sendMessage = (message: ChatMessage) => {
    if (this.currentConfig.connected && this.channel.readyState === 'open') {
      this.channel.send(JSON.stringify(message))
    }
  }

  /**
   * Disconnects the peer connection if one is active.
   */
  public disconnect = () => {
    if (this.connection && 'close' in this.connection) {
      this.connection.close()
    }
  }

  private initializePeerConnection = () => {
    console.log('initializing peer connection')
    const configuration: RTCConfiguration = {
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
      }]
    }
    this.disconnect()
    try {
      this.connection = new RTCPeerConnection(configuration)
      this.connection.addEventListener('icecandidate', this.onIceCandidate)
      this.connection.addEventListener('datachannel', this.onDataChannel)
      this.connection.addEventListener('connectionstatechange', this.onConnectionStateChange)
    } catch (err) {
      console.error(`Failed to construct RTCPeerConnection with error: ${err.name}\n\n${err.message}`)
    }
  }

  private onDataChannel = (event: any | { channel: RTCDataChannel }) => {
    console.log(`data channel ${event.channel.label} established`)
    this.channel = event.channel
    console.log(this.channel.label + ' channel is stored')
    // Send contact info no matter what; even if the contact already exists on our end,
    // we might no longer be in the contact's list (and their connection will stall if we don't send our info)
    this.channel.addEventListener('open', this.sendInitialContactInfo)
    this.channel.addEventListener('message', this.onMessage)
  }

  private onMessage = event => {
    const data: ChatMessage | User = JSON.parse(event.data)
    if ('id' in data) {
      if (this.pendingPromise.resolve) this.pendingPromise.resolve(data)
    } else {
      data.senderType = SenderType.EXT // the sender will have considered it a "ME" message, so flip
      this.onchatmessage(data)
    }
  }

  private onConnectionStateChange = event => {
    console.log('connection state changed to ' + this.connection.connectionState)
    switch (this.connection.connectionState) {
      case 'connected':
        // The connection has become fully connected
        this.socket.disconnect()
        if (!this.currentConfig.isNewContact) {
          this.pendingPromise.resolve()
        }
        this.currentConfig.connected = true
        this.onconnectionchange(true)
        break
      case 'disconnected':
      case 'failed':
        // One or more transports has terminated unexpectedly or in an error
        this.currentConfig.connected = false
        this.onconnectionchange(false)
        this.onRequestFailure()
        break
      case 'closed':
        this.onconnectionchange(false)
        this.currentConfig.connected = false
        break
      default:
        break
    }
  }

  private onRequestFailure = () => {
    console.log('[Error] request failure - abandoning')
    if (this.pendingPromise.reject) this.pendingPromise.reject()
    this.socket.emit('abandoning')
    this.socket.disconnect()
  }

  private onIceCandidate = event => {
    console.log('ice candidate found')
    if (event.candidate) {
      console.log('valid candidate, sending…')
      this.emitSignedMessage({ type: SocketMessageType.CANDIDATE, payload: event.candidate })
    }
  }

  private onBeginConnection = () => {
    if (this.currentConfig.isInitiator) {
      console.log('beginning connection as initiator')
      const channel = this.connection.createDataChannel('chat-channel')
      this.onDataChannel({ channel })
      this.connection.createOffer()
        .then(desc => this.connection.setLocalDescription(desc))
        .then(() => { this.emitSignedMessage({ type: SocketMessageType.OFFER, payload: this.connection.localDescription }) })
    } else {
      console.log('beginning connection—awaiting…')
    }
  }

  private onSocketMessage = (unsafeMsg: any, senderID: string) => {
    if (!this.verifyMessageFormat(unsafeMsg)) return // message is corrupt
    if (!Crypto.verifyMessage(unsafeMsg, senderID)) return // message is not authentic

    const message = unsafeMsg.message
    console.log('received valid socket message of type ' + message.type)
    switch (message.type) {
      case SocketMessageType.ANSWER:
        if (!this.currentConfig.isInitiator) return
        this.connection.setRemoteDescription(message.payload)
        break
      case SocketMessageType.CANDIDATE:
        this.connection.addIceCandidate(message.payload)
        break
      case SocketMessageType.OFFER:
        if (this.currentConfig.isInitiator) return
        this.connection.setRemoteDescription(message.payload)
          .then(() => this.connection.createAnswer())
          .then(desc => this.connection.setLocalDescription(desc))
          .then(() => { this.emitSignedMessage({ type: SocketMessageType.ANSWER, payload: this.connection.localDescription }) })
        break
      default:
        break
    }
  }

  private sendInitialContactInfo = () => { // MUST be a lambda—`this` is bound incorrectly if it's not
    this.channel.send(JSON.stringify(this.currentConfig.selfContactInfo))
  }

  private async emitSignedMessage (message: SocketMessage) {
    const signature = new Uint8Array(await Crypto.signMessage(JSON.stringify(message)))
    const signedMessage: SignedMessage = {
      message,
      signature
    }
    this.socket.emit('message', signedMessage)
  }

  private verifyMessageFormat (message: any): message is SignedMessage {
    return 'signature' in message && 'message' in message && 'type' in message['message'] && 'payload' in message['message']
  }
}