import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import { ChatMessage } from '../types/ChatMessage'
import { User } from '../types/User'
import Crypto from './Crypto'

enum DocType {
  CONTACT = 'C',
  MESSAGE = 'M',
  SELF = 'S',
  KEYPAIR = 'K'
}

type DocInfo = {
  '_id': string,
  'type': DocType,
  _rev?: string
}

type ChatMessageDoc = DocInfo & ChatMessage
type UserDoc = DocInfo & User
type KeypairDoc = DocInfo & CryptoKeyPair

type Docs = ChatMessageDoc | UserDoc | KeypairDoc

const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed

  // tslint:disable-next-line:one-variable-per-declaration
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  // eslint-disable-next-line no-mixed-operators
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909)
  // eslint-disable-next-line no-mixed-operators
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

// TODO: ERROR HANDLING!
export default class DB {
  private static _instance: DB
  private readonly db: PouchDB.Database<Docs>

  public static get Instance () {
    return this._instance || (this._instance = new this())
  }

  private constructor () {
    PouchDB.plugin(PouchDBFind)
    this.db = new PouchDB('peerchat-db', { auto_compaction: true })
    this.db.createIndex({
      index: {
        fields: ['senderID', 'recipientID', 'timestamp', 'type'],
        ddoc: 'primary',
        name: 'msg-index'
      }
    })
  }

  /**
   * Fetches all chat messages sent to or from the specified sender.
   * @param senderID the ID of the contact whose messages to fetch.
   */
  public async getChatMessages (senderID: string) {
    const messages = (await this.getMessagesForContact(senderID)).docs as ChatMessage[]
    // It would be lovely to use PouchDB's built-in sort—unfortunately, it's a total mess
    return messages.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
  }

  /**
   * Returns whether a contact with the specified ID exists in the DB.
   * @param contactID the ID of the contact to look up.
   */
  public async contactExists (contactID: string) {
    // Using error handling as control flow is awful, but this is what PouchDB makes us do…
    try {
      await this.db.get(contactID)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Fetches an array of all contacts from the database.
   */
  public async getContacts () {
    const res = await this.db.find({
      selector: {
        type: DocType.CONTACT
      }
    })
    return res.docs as User[]
  }

  /**
   * Returns the self object from the DB, or undefined if it doesn't exist.
   */
  public async getSelf (): Promise<User | undefined> {
    try {
      return await this.getRawSelf()
    } catch {
      return undefined
    }
  }

  /**
   * Returns the raw result of db.get('self'). No error checking is performed.
   */
  private async getRawSelf (): Promise<UserDoc> {
    return this.db.get('self')
  }

  public async getPrivateKey () {
    const res = await this.db.find({
      selector: {
        type: DocType.KEYPAIR
      }
    })
    return (res.docs[0] as KeypairDoc).privateKey
  }

  /**
   * Writes a chat message to the database. Primary key is an XOR of the hash of the timestamp and the sender ID.
   * @param chatMessage the message to write to the database.
   */
  public addChatMessage (chatMessage: ChatMessage) {
    const hash = cyrb53(chatMessage.timestamp.toString()) ^ cyrb53(chatMessage.senderID)
    const doc = {
      ...chatMessage,
      '_id': hash.toString(16),
      'type': DocType.MESSAGE
    }
    this.db.put(doc)
  }

  // Storing "wrapped" keypairs fails in both Firefox and Safari. So this is a Chrome-only app for the time being…
  /**
   * Writes a new keypair to the database and updates the ID of the self object. WARNING: This deletes the old keypair and self.
   * @param keypair the keypair to write.
   */
  public async writeKeypair (keypair: CryptoKeyPair) {
    try {
      const oldKeypair = await this.db.get('keypair')
      this.db.remove(oldKeypair)
    } catch {} // If there's no old keypair to remove, that (probably) just means this is the first login
    const doc = {
      ...keypair,
      _id: 'keypair',
      type: DocType.KEYPAIR
    }
    this.db.put(doc)

    let oldSelf: Partial<UserDoc> = { _rev: undefined }
    try {
      oldSelf = await this.getRawSelf()
    } catch {}
    const newID = await Crypto.getRawPublicKey(keypair)
    const newSelf: UserDoc = {
      _id: 'self',
      type: DocType.SELF,
      _rev: oldSelf._rev,
      id: newID,
      firstName: oldSelf.firstName || null,
      lastName: oldSelf.lastName || null,
      avatar: oldSelf.avatar || null
    }
    this.db.put(newSelf)
  }

  /**
   * Updates or creates the self user object. The entire self object will be replaced with the values passed.
   * @param self the new self object to persist.
   */
  public async updateSelf (self: User) {
    let oldSelf: { _rev?: string } = { _rev: undefined }
    try {
      oldSelf = await this.getRawSelf()
    } catch {}
    const doc = {
      ...self,
      _id: 'self',
      type: DocType.SELF,
      _rev: oldSelf?._rev
    }
    this.db.put(doc)
  }

  /**
   * Writes a contact to the database, or updates the contact with the ID of the given contact if it exists.
   * Updating overwrites all contact info with that which is provided.
   * Primary key is the contact ID (which is hopefully big enough that we avoid collisions).
   * @param contact the new contact info to write or update.
   */
  public async putContact (contact: User) {
    let existingContact = { _rev: undefined }
    try {
      existingContact = await this.db.get(contact.id)
    } catch {
      // We're adding a new contact; nothing to worry about
    }
    const newDoc = {
      ...contact,
      _id: contact.id,
      type: DocType.CONTACT,
      _rev: existingContact._rev
    }
    this.db.put(newDoc)
  }

  /**
   * Deletes the contact with the specified ID AND all chat messages they sent or received.
   * @param contactID the ID of the contact to delete.
   */
  public async removeContact (contactID: string) {
    const doc = await this.db.get(contactID)
    await this.db.remove(doc)
    const messageDocs = (await this.getMessagesForContact(contactID)).docs
    return this.db.bulkDocs(messageDocs.map(obj => ({ ...obj, _deleted: true })))
  }

  /**
   * Destroys the database and everything in it.
   */
  public async destroy () {
    return this.db.destroy()
  }

  private getMessagesForContact (contactID: string) {
    return this.db.find({
      selector: {
        $and: [
          { $or: [
              { senderID: contactID },
              { recipientID: contactID }
          ]},
          { timestamp: { $gt: null } }, // PouchDB language for "fetch w/o restriction"—we need it for our sort
          { type: DocType.MESSAGE }
        ]
      }
      // use_index: ['primary', 'msg-index'],
      // sort: [{ timestamp: 'asc' }] // We have to sort on everything—I swear, whoever designed PouchDB…
    })
  }
}
