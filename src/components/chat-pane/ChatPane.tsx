import React from 'react'
import { Segment } from 'semantic-ui-react'
import { User } from '../../types/User'
import ActiveContactPane from './ActiveContactPane'
import NoContactPane from './NoContactPane'

type ChatPaneProps = {
  contact?: User,
  self: User | undefined,
  contactUpdateHandler: (contact: User) => void
}

export default class ChatPane extends React.PureComponent<ChatPaneProps> {
  render () {
    const ready = this.props.contact && this.props.self
    return (
      <Segment placeholder={!ready}>
        {ready ? <ActiveContactPane contact={this.props.contact}
                                    self={this.props.self}
                                    contactUpdateHandler={this.props.contactUpdateHandler} />
          : <NoContactPane />}
      </Segment>
    )
  }
}