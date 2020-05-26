import React from 'react'
import { Button, Divider, Header, Icon, Modal } from 'semantic-ui-react'
import AdditionalInfoForm from '../AdditionalInfoForm'

type FirstVisitModalProps = {
  open: boolean,
  selfID: string | undefined,
  callback: (firstName: string | undefined, lastName: string | undefined, avatar: string | undefined) => void
}

type FirstVisitModalState = {
  open: boolean,
  firstName: string | undefined,
  lastName: string | undefined,
  avatar: string | undefined
}

export default class FirstVisitModal extends React.PureComponent<FirstVisitModalProps, FirstVisitModalState> {
  readonly state = { open: this.props.open, firstName: undefined, lastName: undefined, avatar: undefined }

  // We need this because the parent will only realize we need to display the modal after it's done some processing.
  // Therefore, we'll need to recompute state.open once we know definitively whether to open.
  // We can't just rely on props.open, though, b/c we then need to change state.open once we're done with the modal.
  static getDerivedStateFromProps (props, state) {
    if (props.open !== state.open) {
      return {
        open: props.open
      }
    }
    return null
  }

  handleClose = () => {
    const { firstName, lastName, avatar } = this.state
    this.props.callback(firstName, lastName, avatar)
    this.setState({ open: false })
  }

  handleInput = (name: Exclude<keyof FirstVisitModalState, 'open'>, value: string) => {
    // @ts-ignore
    this.setState({ [name]: value })
  }

  render () {
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
          {this.props.selfID && (
            <>
              <Divider />
              <p>Below, you may optionally choose to associate further information with your profile.
                This information will be shared with anyone with whom you chat.
                You may change, add, or remove it at any time from your profile.</p>
              <AdditionalInfoForm userInfo={{ id: this.props.selfID }} handleInput={this.handleInput} />
            </>
          )}
        </Modal.Content>
        {this.props.selfID &&
        <Modal.Actions>
          <Button primary onClick={this.handleClose}><Icon name='checkmark' />Done</Button>
        </Modal.Actions>
        }
      </Modal>
    )
  }
}