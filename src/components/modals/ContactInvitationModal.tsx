import React from 'react'
import { Button, Loader, Modal } from 'semantic-ui-react'
import { User, UserUtils } from '../../types/User'

type ContactInvitationModalProps = { contact: User }
type ContactInvitationModalState = { modalOpen: boolean }

export default class ContactInvitationModal extends React.PureComponent<ContactInvitationModalProps, ContactInvitationModalState> {
  readonly state = { modalOpen: false }

  handleOpen = () => { this.setState({ modalOpen: true }) }
  handleClose = () => { this.setState({ modalOpen: false }) }

  render () {
    return (
      <Modal basic size='small'
             trigger={<Button primary onClick={this.handleOpen}>Connect</Button>}
             open={this.state.modalOpen}>
        <Modal.Content>
          <Loader content={`Connecting to ${UserUtils.fullName(this.props.contact)}…`} active />
        </Modal.Content>
      </Modal>
    )
  }
}