import React from 'react'
import { Comment, Divider, Dropdown, Grid, Header, Message } from 'semantic-ui-react'
import { User, UserUtils } from '../../types/User'
import { ChatMessage, SenderType } from '../../types/ChatMessage'
import ContactInvitationModal from '../modals/ContactInvitationModal'
import ProfileModal from '../modals/ProfileModal'

type ActiveContactPaneProps = {
  contact: User,
  messages: ChatMessage[]
}

export default class ActiveContactPane extends React.PureComponent<ActiveContactPaneProps> {

  handleContactUpdate = (fieldName, value) => {
    // TODO: Handle it
  }

  render () {
    const { contact, messages } = this.props
    return (
      <>
        <Grid>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={8}>
              <Dropdown text={UserUtils.fullNameWithLeadingAvatar(contact)} pointing='top'>
                <Dropdown.Menu>
                  <ProfileModal user={contact} isOwnProfile={false} updateHandler={this.handleContactUpdate} />
                </Dropdown.Menu>
              </Dropdown>
            </Grid.Column>
            <Grid.Column floated='right' textAlign='right' width={8}>
              <ContactInvitationModal contact={contact} />
              {/*<Label color='green'>Connected</Label>*/}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />

        <Comment.Group>
          {messages.length === 0 ?
            <Header as='h3' color='grey'>No messages yet</Header>
            : messages.map((message, idx) => (
            <Comment key={idx}>
              <Comment.Content>
                <Comment.Author as='a'>{message.senderType === SenderType.ME ? 'Me' : UserUtils.fullNameWithLeadingAvatar(contact)}</Comment.Author>
                <Comment.Metadata>{new Date(message.timestamp).toLocaleString()}</Comment.Metadata>
                <Comment.Text>{message.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
        <Divider />

        <Message warning>You must connect before chatting.</Message>
        {/*<Form reply>*/}
        {/*  <Form.Input action='Send' />*/}
        {/*</Form>*/}
      </>
    )
  }
}