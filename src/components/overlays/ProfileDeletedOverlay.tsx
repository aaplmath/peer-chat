import React from 'react'
import { Dimmer, Header, Icon } from 'semantic-ui-react'

export default class ProfileDeletedOverlay extends React.PureComponent {
  render () {
    return (
      <Dimmer active={true} page className='opaque-overlay'>
        <Header as='h2' icon inverted>
          <Icon name='user delete' />
          Profile Deleted
          <Header.Subheader>You may now close this page. Reloading or visiting this site again will automatically generate a new PeerChat profile.</Header.Subheader>
        </Header>
      </Dimmer>
    )
  }
}