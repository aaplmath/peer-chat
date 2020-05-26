export enum SenderType {
  EXT, ME
}

export type ChatMessage = {
  senderType: SenderType,
  senderID: string,
  recipientID: string,
  timestamp: number,
  content: string
}

export class ChatMessageFactory {
  static create (senderType: SenderType, senderID: string, recipientID: string, timestamp: Date, content: string): ChatMessage {
    return { senderType, senderID, recipientID, timestamp: timestamp.getTime(), content }
  }
}
