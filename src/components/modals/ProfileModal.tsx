import React from 'react'
import {
  Accordion,
  Button,
  Divider,
  Dropdown,
  Header,
  Icon,
  Message,
  Modal
} from 'semantic-ui-react'
import { User } from '../../types/User'
import AdditionalInfoForm from '../AdditionalInfoForm'
import ContactRemovalModal from './ContactRemovalModal'
import DB from '../../utils/db'

type ProfileModalProps = {
  user: User,
  isOwnProfile: boolean,
  updateHandler: (fieldName: string, value: string) => void,
  profileDeletionHandler?: () => void
}

type ProfileModalState = {
  advancedShown: boolean
}

export default class ProfileModal extends React.PureComponent<ProfileModalProps, ProfileModalState> {
  readonly state = { advancedShown: false }
  private timeoutInst: { [key: string]: number | undefined } = {} // holds timeouts for each input field so we don't overwhelm the parent (which is triggering DB writes)

  handleInput = (fieldName, value) => {
    const DELAY = 300
    if (this.timeoutInst[fieldName]) clearTimeout(this.timeoutInst[fieldName])
    this.timeoutInst[fieldName] = window.setTimeout(() => {
      this.props.updateHandler(fieldName, value)
    }, DELAY)
  }

  toggleAdvanced = () => {
    this.setState(state => ({ advancedShown: !state.advancedShown }))
  }

  deleteAccount = () => {
    DB.Instance.destroy().then(() => {
      if (this.props.profileDeletionHandler) {
        this.props.profileDeletionHandler()
      } else {
        // Something has gone horribly wrong, but we don't want to leave the user in an undefined state—bail and reload
        window.location.reload()
      }
    })
  }

  render () {
    return (
      <Modal size='small' trigger={<Dropdown.Item>{this.props.isOwnProfile ? 'My Profile' : 'View Details'}</Dropdown.Item>} closeIcon>
        <Modal.Header>{this.props.isOwnProfile ? 'My Profile' : 'Contact Details'}</Modal.Header>
        <Modal.Content>
          <Header as='h3'>PeerChat ID</Header>
          <p className='peerchat-id'>{this.props.user.id}</p>
          <Divider />
          <Header as='h3'>Additional Information</Header>
          <AdditionalInfoForm userInfo={this.props.user} handleInput={this.handleInput} />
          <Divider />
          {!this.props.isOwnProfile ? <ContactRemovalModal contact={this.props.user} /> :
            <Accordion styled fluid>
              <Accordion.Title active={this.state.advancedShown} onClick={this.toggleAdvanced}>
                <Icon name='dropdown' />Show advanced options</Accordion.Title>
              <Accordion.Content active={this.state.advancedShown}>
                <Header as='h4'>Delete PeerChat Account</Header>
                <Message color='red'>
                  <strong>WARNING</strong>: Deleting your PeerChat account will delete all of your contacts, message history, and profile information
                    and will permanently destroy your PeerChat ID.
                    {' '}<strong>This action is permanent and cannot be undone.</strong>
                </Message>
                <Button color='red' onClick={this.deleteAccount}>Delete PeerChat Account</Button>
              </Accordion.Content>
            </Accordion>
          }
        </Modal.Content>
      </Modal>
    )
  }
}