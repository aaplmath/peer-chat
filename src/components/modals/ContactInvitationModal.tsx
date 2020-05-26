import React from 'react'
import { Button, Loader, Modal } from 'semantic-ui-react'
import { User, UserUtils } from '../../types/User'
import RTCManager from '../../utils/RTCManager'

type ContactInvitationModalProps = { contact: User, self: User }
type ContactInvitationModalState = { modalOpen: boolean }

export default class ContactInvitationModal extends React.PureComponent<ContactInvitationModalProps, ContactInvitationModalState> {
  readonly state = { modalOpen: false }

  handleOpen = () => {
    this.setState({ modalOpen: true })
    // TODO: show errors rather than just hiding
    RTCManager.Instance.requestConnection(this.props.self, this.props.contact.id, false).catch(() => {
      this.setState({ modalOpen: false })
    })
    // We don't need to handle close on success because the button gets unmounted
  }

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