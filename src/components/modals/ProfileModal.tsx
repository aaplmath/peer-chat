import React from 'react'
import {
  Accordion,
  Button,
  Divider,
  Header,
  Icon,
  Message,
  Modal,
  Menu
} from 'semantic-ui-react'
import { User, UserUtils } from '../../types/User'
import AdditionalInfoForm from '../forms/AdditionalInfoForm'
import ContactRemovalModal from './ContactRemovalModal'
import DB from '../../utils/db'
import ChangePasswordForm from '../forms/ChangePasswordForm'

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

  deleteProfile = () => {
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
      <Modal size='small' trigger={
        <Menu.Item>{UserUtils.fullNameWithLeadingAvatar(this.props.user)}</Menu.Item>
      } closeIcon>
        <Modal.Header>{this.props.isOwnProfile ? 'My Profile' : 'Contact Details'}</Modal.Header>
        <Modal.Content>
          <Header as='h3'>PeerChat ID</Header>
          <p className='peerchat-id'>{this.props.user.id}</p>
          <Divider />
          <Header as='h3'>Additional Information</Header>
          <AdditionalInfoForm userInfo={this.props.user} handleInput={this.handleInput} />
          <Divider />
          {this.props.isOwnProfile &&
            <>
              <Header as='h3'>Change Password</Header>
              <ChangePasswordForm />
              <Divider />
            </>}

          {!this.props.isOwnProfile ? <ContactRemovalModal contact={this.props.user} /> :
            <Accordion styled fluid>
              <Accordion.Title active={this.state.advancedShown} onClick={this.toggleAdvanced}>
                <Icon name='dropdown' />Show advanced options</Accordion.Title>
              <Accordion.Content active={this.state.advancedShown}>
                <Header as='h4'>Delete PeerChat Profile</Header>
                <Message color='red'>
                  <strong>WARNING</strong>: Deleting your PeerChat profile will delete all of your contacts, message history, and profile information
                    and will permanently destroy your PeerChat ID.
                    {' '}<strong>Clicking the button below will immediately, permanently, and irreversibly delete your profile.</strong>
                </Message>
                <Button color='red' onClick={this.deleteProfile}>Delete PeerChat Profile</Button>
              </Accordion.Content>
            </Accordion>
          }
        </Modal.Content>
      </Modal>
    )
  }
}