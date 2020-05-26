import { ChatMessage } from './types/ChatMessage'
import { User } from './types/User'
import Crypto from './Crypto'

enum SocketMessageType {
  OFFER = 'O',
  ANSWER = 'A',
  CANDIDATE = 'C'
}
type SocketMessage = {
  type: SocketMessageType,
  payload: RTCSessionDescriptionInit | RTCIceCandidate | string
}
export type SignedMessage = {
  signature: ArrayBuffer,
  message: SocketMessage
}

// TODO: Error handling
export default class RTCManager {
  private readonly REQ_TIMEOUT_MILLIS = 30 * 1000 // this needs to be LONG—both contacts need to request simultaneously
  private static _instance: RTCManager

  private connection: RTCPeerConnection
  private channel: RTCDataChannel
  private isInitiator: boolean | undefined = undefined
  private socket: SocketIOClient.Socket
  private pendingPromise = { resolve: undefined, reject: undefined }

  public static get Instance () {
    return this._instance || (this._instance = new this())
  }

  private constructor () {}

  /**
   * Requests of the server a connection with the specified user.
   * @param selfID the own user's ID.
   * @param recipientID the ID of the user to whom to connect.
   */
  public requestConnection (selfID: string, recipientID: string) {
    this.initializePeerConnection()
    if (!this.socket) {
      this.socket = io.connect('http://localhost:8080', { secure: false })
      this.socket.on('message', (msg) => { this.onSocketMessage(msg, recipientID) })
      this.socket.on('send offer', () => { this.isInitiator = true })
      this.socket.on('await offer', () => { this.isInitiator = false })
      this.socket.on('begin connection', this.onBeginConnection)
      this.socket.on('abandon', this.onRequestFailure)
    } else {
      this.socket.connect()
    }

    console.log('sending connection request to server')
    this.socket.emit('request connection',{
      sender: selfID,
      recipient: recipientID
    })
    const promise = new Promise((res, rej) => {
      this.pendingPromise.resolve = res || (() => {})
      this.pendingPromise.reject = rej || (() => {})
    })
    window.setTimeout(this.onRequestFailure, this.REQ_TIMEOUT_MILLIS)
    return promise
  }

  private initializePeerConnection () {
    console.log('initializing peer connection')
    const configuration: RTCConfiguration = {
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
      }]
    }
    try {
      this.connection = new RTCPeerConnection(configuration)
    } catch (err) {
      console.error(`Failed to construct RTCPeerConnection with error: ${err.name}\n\n${err.message}`)
    }

    this.connection.addEventListener('icecandidate', this.onIceCandidate)
    this.connection.addEventListener('datachannel', this.onDataChannel)
    this.connection.addEventListener('connectionstatechange', this.onConnectionStateChange)
  }

  private onDataChannel = (event: any | { channel: RTCDataChannel }) => {
    console.log('data channel established')
    this.channel = event.channel
    this.channel.onmessage = this.onMessage
  }

  private onMessage = event => {
    const data: ChatMessage | User = JSON.parse(event.data)
    if ('id' in data) {
      // it's a user profile
    } else {
      // it's a chat message
    }
    // do something with msg
  }

  private onConnectionStateChange = event => {
    console.log('connection state changed to ' + this.connection.connectionState)
    switch (this.connection.connectionState) {
      case 'connected':
        // The connection has become fully connected
        this.pendingPromise.resolve()
        this.socket.disconnect()
        break
      case 'disconnected':
      case 'failed':
        // One or more transports has terminated unexpectedly or in an error
        this.onRequestFailure()
        break
      case 'closed':
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
    if (this.isInitiator) {
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

  // TODO: signature verification, safety checking, don't set offers/answers without verifying that
  //  we're expecting them (e.g., we might actually be the initiator/receiver)
  private onSocketMessage = (message: any, senderID: string) => {
    console.log('got a socket message')
    if (!this.verifyMessageFormat(message)) return // message is corrupt

    console.log('socket message was valid and of type ' + message.type)
    switch (message.type) {
      case SocketMessageType.ANSWER:
        if (!this.isInitiator) return
        // @ts-ignore
        this.connection.setRemoteDescription(message.payload)
        break
      case SocketMessageType.CANDIDATE:
        // @ts-ignore
        this.connection.addIceCandidate(message.payload)
        break
      case SocketMessageType.OFFER:
        if (this.isInitiator) return
        // @ts-ignore
        this.connection.setRemoteDescription(message.payload)
          .then(() => this.connection.createAnswer())
          .then(desc => this.connection.setLocalDescription(desc))
          .then(() => { this.emitSignedMessage({ type: SocketMessageType.ANSWER, payload: this.connection.localDescription }) })
        break
      default:
        break
    }
  }

  private emitSignedMessage (message: SocketMessage) {
    this.socket.emit('message', message)
  }

  private verifyMessageFormat = (message: any): message is SocketMessage => {
    return 'type' in message && 'payload' in message
  }
}