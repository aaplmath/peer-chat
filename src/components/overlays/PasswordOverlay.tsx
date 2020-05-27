import React from 'react'
import { Dimmer, Form, Header, Icon, Input } from 'semantic-ui-react'

export default class PasswordOverlay extends React.PureComponent {
  render () {
    return (
      <Dimmer active={true} page className='opaque-overlay'>
        <Header as='h2' icon inverted>
          <Icon name='lock' />
          Database Locked
          <Header.Subheader>Please enter your password to open PeerChat:</Header.Subheader>
        </Header>
        <Form>
          <Input type='password' fluid action={{ color: 'green', content: 'Unlock' }} />
        </Form>
      </Dimmer>
    )
  }
}