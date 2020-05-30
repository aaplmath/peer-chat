import React from 'react'
import { Button, Divider, Form, Grid, Header, Icon, Modal } from 'semantic-ui-react'
import AdditionalInfoForm from '../forms/AdditionalInfoForm'

type FirstVisitModalProps = {
  open: boolean,
  selfID: string | undefined,
  callback: (firstName: string | undefined, lastName: string | undefined, avatar: string | undefined, passwordEntry: string) => void
}

type FirstVisitModalState = {
  open: boolean,
  firstName: string | undefined,
  lastName: string | undefined,
  avatar: string | undefined,
  passwordEntry: string,
  passwordConfirmation: string
}

export default class FirstVisitModal extends React.PureComponent<FirstVisitModalProps, FirstVisitModalState> {
  readonly state = {
    open: this.props.open,
    firstName: undefined,
    lastName: undefined,
    avatar: undefined,
    passwordEntry: '',
    passwordConfirmation: ''
  }

  // We need this because the parent will only realize we need to display the modal after it's done some processing.
  // Therefore, we'll need to recompute state.open once we know definitively whether to open.
  // We can't just rely on props.open, though, b/c we then need to change state.open once we're done with the modal.
  // We also want to ignore props
  static getDerivedStateFromProps (props, state) {
    if (props.open !== state.open) {
      return {
        open: props.open
      }
    }
    return null
  }

  handleClose = () => {
    const { firstName, lastName, avatar, passwordEntry } = this.state
    this.props.callback(firstName, lastName, avatar, passwordEntry)
    this.setState({ open: false, passwordEntry: '', passwordConfirmation: '' })
  }

  handlePasswordInput = (event, { name, value }) => {
    // @ts-ignore
    this.setState({ [name]: value })
  }

  handleProfileInput = (name: Exclude<keyof FirstVisitModalState, 'open'>, value: string) => {
    // @ts-ignore
    this.setState({ [name]: value })
  }

  render () {
    const { passwordEntry, passwordConfirmation } = this.state
    const passwordIsValid = passwordEntry === passwordConfirmation && passwordEntry !== ''
    return (
      // Would be nice to have fullscreen, but Semantic UI CSS problems aren't worth the hassle
      // N.b.: This modal is **not** configured as a properly controlled component.
      //  This is intentional; we don't want it closing unless and until the done button is clicked.
      <Modal open={this.state.open} size='large' dimmer='blurring'>
        <Header>Welcome to PeerChat!</Header>
        <Modal.Content>
          <p>PeerChat is a peer-to-peer chat application built with privacy in mind.</p>
          <p>Below is your PeerChat ID, an anonymous identifier you'll need in order to chat with others.
            You can access it at any time from your profile.</p>
          <Divider />
          <p>Your PeerChat ID: <strong className='peerchat-id'>{this.props.selfID || 'Loading…'}</strong></p>
          <Divider />
          <Header as='h3'>Secure Your Profile</Header>
          <p>Please enter and verify a password below. This password will be used to encrypt all of your PeerChat data.
            {' '}<strong>Please note that passwords cannot be recovered if lost.</strong></p>
          <Form>
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Form.Input type='password' label='Enter password' name='passwordEntry' autoComplete='new-password'
                              value={passwordEntry} onChange={this.handlePasswordInput} />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Form.Input type='password' label='Verify password' name='passwordConfirmation' autoComplete='new-password'
                              value={passwordConfirmation} onChange={this.handlePasswordInput} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>

          {this.props.selfID && (
            <>
              <Divider />
              <p>Below, you may optionally choose to associate further information with your profile.
                This information will be shared with anyone with whom you chat.
                You may change, add, or remove it at any time from your profile.</p>
              <AdditionalInfoForm userInfo={{ id: this.props.selfID }} handleInput={this.handleProfileInput} />
            </>
          )}
        </Modal.Content>
        {this.props.selfID &&
        <Modal.Actions>
          <Button primary onClick={this.handleClose} disabled={!passwordIsValid}>
            <Icon name='checkmark' /> Done
          </Button>
        </Modal.Actions>
        }
      </Modal>
    )
  }
}