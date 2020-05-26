import React from 'react'
import { Dimmer, Header, Icon } from 'semantic-ui-react'

export default class AccountDeletedOverlay extends React.PureComponent {
  render () {
    return (
      <Dimmer active={true} page className='account-deletion-overlay'>
        <Header as='h2' icon inverted>
          <Icon name='user delete' />
          Account Deleted
          <Header.Subheader>You may now close this page. Reloading or visiting this site again will automatically generate a new PeerChat account.</Header.Subheader>
        </Header>
      </Dimmer>
    )
  }
}