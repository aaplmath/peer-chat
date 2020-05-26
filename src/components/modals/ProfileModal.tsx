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

type ProfileModalProps = {
  user: User,
  isOwnProfile: boolean,
  updateHandler: (fieldName: string, value: string) => void
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
                <Header as='h4'>Reset PeerChat ID</Header>
                <Message color='red'>
                  <strong>WARNING</strong>: Resetting your PeerChat ID will prevent any of your existing contacts from contacting you
                    until you send them your new ID. Any future chat messages you send to contacts will appear to come from a different sender.
                    {' '}<strong>This action is permanent and cannot be undone.</strong> Do not reset your PeerChat ID unless you fully understand
                    the consequences of doing so.
                </Message>
                <Button color='red'>Reset PeerChat ID</Button>
              </Accordion.Content>
            </Accordion>
          }
        </Modal.Content>
      </Modal>
    )
  }
}