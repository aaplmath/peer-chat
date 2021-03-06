import React from 'react'
import { Comment, Divider, Form, Grid, Header, Label, Menu, Message } from 'semantic-ui-react'
import { User, UserUtils } from '../../types/User'
import { ChatMessage, SenderType } from '../../types/ChatMessage'
import ContactInvitationModal from '../modals/ContactInvitationModal'
import ProfileModal from '../modals/ProfileModal'
import RTCManager from '../../utils/RTCManager'
import DB from '../../utils/db'
import ScrollableCommentGroup from './ScrollableCommentGroup'

type ActiveContactPaneProps = {
  contact: User,
  self: User,
}

type ActiveContactPaneState = {
  input: string,
  currentID: string,
  messages: ChatMessage[]
}

export default class ActiveContactPane extends React.PureComponent<ActiveContactPaneProps, ActiveContactPaneState> {
  private static readonly GROUPING_TIME_INTERVAL_MS = 60 * 1000
  readonly state = {
    input: '',
    currentID: undefined,
    messages: []
  }

  componentDidMount () {
    RTCManager.Instance.onchatmessage = this.handleIncomingMessage
    RTCManager.Instance.onconnectionchange = this.handleConnectionChange
    this.reloadMessages()
  }

  componentDidUpdate (prevProps: Readonly<ActiveContactPaneProps>, prevState: Readonly<ActiveContactPaneState>, snapshot?: any) {
    if (this.props.contact.id !== this.state.currentID) {
      this.reloadMessages()
    }
  }

  reloadMessages = () => {
    // To avoid a race condition, pretend that we've updated, then reset currentID to undefined if the fetch fails
    // We'll trigger componentDidUpdate again either way, but this way, if another prop/state change triggers cDU while we're updating,
    // we don't senselessly make multiple fetches
    const oldID = this.state.currentID
    this.setState({ currentID: this.props.contact.id })
    DB.Instance.getChatMessages(this.props.contact.id).then(messages => {
      this.setState({ messages })
    }).catch(() => {
      this.setState({ currentID: oldID })
    })
  }

  handleContactUpdate = (fieldName, value) => {
    const contact = {...this.props.contact, [fieldName]: value}
    DB.Instance.putContact(contact)
  }


  handleConnectionChange = (connected: boolean) => {
    // TODO: Find a more elegant approach than forceUpdate()
    this.forceUpdate()
  }

  handleIncomingMessage = (message: ChatMessage) => {
    this.persistChatMessage(message, message.senderID === this.state.currentID)
  }

  handleInput = (event, { value }) => {
    this.setState({ input: value })
  }

  handleSend = () => {
    const { currentID, input } = this.state
    const selfID = this.props.self.id
    if (!currentID || !input || !selfID) return

    const message: ChatMessage = {
      senderType: SenderType.ME,
      senderID: selfID,
      recipientID: currentID,
      timestamp: new Date().getTime(),
      content: input
    }
    RTCManager.Instance.sendMessage(message)
    this.persistChatMessage(message, true)
    this.setState({ input: '' })
  }

  private persistChatMessage = (message: ChatMessage, showInFeed: boolean) => {
    // TODO: add some sort of notification to alert the user that they've received a message for a non-active contact
    if (showInFeed) {
      this.setState(({ messages }) => ({ messages: messages.concat(message) }))
    }
    DB.Instance.addChatMessage(message)
  }

  render () {
    const { contact, self } = this.props
    const { messages, input } = this.state
    const connected = RTCManager.Instance.currentConfig.connected && RTCManager.Instance.currentConfig.contactID === contact.id

    const groupedMessages = messages.reduce((acc, cur) => {
      const prev = acc[acc.length - 1]
      if (prev === undefined
        || prev[0].senderID !== cur.senderID
        || cur.timestamp > prev[prev.length - 1].timestamp + ActiveContactPane.GROUPING_TIME_INTERVAL_MS) {
        return acc.concat([[cur]])
      } else {
        let res = acc.concat()
        res[res.length - 1] = res[res.length - 1].concat(cur)
        return res
      }
    }, [])

    return (
      <>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={8}>
              <Menu compact>
                <ProfileModal user={contact}
                              isOwnProfile={false}
                              updateHandler={this.handleContactUpdate} />
              </Menu>
            </Grid.Column>
            <Grid.Column floated='right' textAlign='right' width={8}>
              {connected
                ? <Label color='green'>Connected</Label>
                : <ContactInvitationModal self={self} contact={contact} />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />

        <ScrollableCommentGroup>
          <ChatMessageList groupedMessages={groupedMessages} self={self} contact={contact} />
        </ScrollableCommentGroup>
        <Divider />

        {connected ?
          <Form reply onSubmit={this.handleSend}>
            <Form.Input action='Send' value={input} onChange={this.handleInput} />
          </Form>
          : <Message warning>You must connect before chatting.</Message>}
      </>
    )
  }
}

class ChatMessageList extends React.PureComponent<{ groupedMessages: ChatMessage[][], self: User, contact: User }> {
  render () {
    const { groupedMessages, self, contact } = this.props
    const meName = UserUtils.fullNameWithLeadingAvatar({ ...self, firstName: 'Me', lastName: null }) // a little hacky…
  
    return (
      <>
        {groupedMessages.length === 0 ?
          <Header as='h3' color='grey'>No messages yet</Header>
        : groupedMessages.map((messageGroup, idx) => (
          <Comment key={idx} className='chat-item'>
            <Comment.Content>
              <Comment.Author as='span'>{messageGroup[0].senderType === SenderType.ME ? meName : UserUtils.fullNameWithLeadingAvatar(contact)}</Comment.Author>
              <Comment.Metadata>{new Date(messageGroup[0].timestamp).toLocaleString()}</Comment.Metadata>
              {messageGroup.map((message, idx) => <Comment.Text key={idx}>{message.content}</Comment.Text>)}
            </Comment.Content>
          </Comment>
        ))}
      </>
    )
  }
}