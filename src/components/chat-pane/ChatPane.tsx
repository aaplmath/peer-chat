import React from 'react'
import { Segment } from 'semantic-ui-react'
import { User } from '../../types/User'
import ActiveContactPane from './ActiveContactPane'
import NoContactPane from './NoContactPane'
import { ChatMessage } from '../../types/ChatMessage'

type ChatPaneProps = {
  contact?: User,
  messages?: ChatMessage[]
}

export default class ChatPane extends React.PureComponent<ChatPaneProps> {
  render () {
    return (
      <Segment placeholder={!this.props.contact}>
        {this.props.contact ? <ActiveContactPane contact={this.props.contact} messages={this.props.messages} /> : <NoContactPane />}
      </Segment>
    )
  }
}