import React from 'react'
import { Dimmer, Form, Header, Icon, Input, Message } from 'semantic-ui-react'
import DB from '../../utils/db'

type PasswordOverlayProps = {
  onDBUnlocked: () => void
}
type PasswordOverlayState = {
  input: string,
  failure: boolean
}

export default class PasswordOverlay extends React.PureComponent<PasswordOverlayProps, PasswordOverlayState> {
  readonly state = { input: '', failure: false }

  handleSubmit = () => {
    DB.Instance.decrypt(this.state.input).then(success => {
      if (success) {
        this.props.onDBUnlocked()
      } else {
        this.setState({ failure: true })
      }
    }).catch((e: Error) => {
      this.setState({ failure: true })
      console.error(`Error unlocking DB of type ${e.name} with message ${e.message}`)
    })
  }

  handleInput = (event, { value }) => {
    this.setState({ input: value })
  }

  render () {
    return (
      <Dimmer active={true} page className='opaque-overlay'>
        <Header as='h2' icon inverted>
          <Icon name='lock' />
          Database Locked
          <Header.Subheader>Please enter your password to open PeerChat:</Header.Subheader>
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Input type='password' fluid autoFocus
                 autoComplete='current-password'
                 action={{ color: 'green', content: 'Unlock' }}
                 value={this.state.input} onChange={this.handleInput} />
        </Form>
        {this.state.failure && <Message error>Incorrect password. Please try again.</Message>}
      </Dimmer>
    )
  }
}