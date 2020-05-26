import React from 'react'
import { Button, Message, Modal } from 'semantic-ui-react'
import { User, UserUtils } from '../../types/User'
import DB from '../../utils/db'

type ContactRemovalModalProps = { contact: User }
type ContactRemovalModalState = { open: boolean }

export default class ContactRemovalModal extends React.PureComponent<ContactRemovalModalProps, ContactRemovalModalState> {
  readonly state = { open: false }

  handleOpen = () => { this.setState({ open: true }) }
  handleClose = () => { this.setState({ open: false }) }

  handleRemove = () => {
    DB.Instance.removeContact(this.props.contact.id).then(() => {
      window.location.reload()
    })
  }

  render () {
    return (
      <Modal size='tiny'
             trigger={<Button color='red' onClick={this.handleOpen}>Remove Contact</Button>}
             open={this.state.open}
             onClose={this.handleClose}>
        <Modal.Header>Confirm Removal</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to remove {UserUtils.fullName(this.props.contact)} from your contacts?
            You will be unable to chat with them unless you re-add their ID, and your shared message history will be permanently erased.</p>
          <Message color='red'><p><strong>This action cannot be undone!</strong></p></Message>
        </Modal.Content>
        <Modal.Actions>
          <Button content='Cancel' onClick={this.handleClose} />
          <Button color='red' content='Remove' onClick={this.handleRemove} />
        </Modal.Actions>
      </Modal>
    )
  }
}