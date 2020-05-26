import React from 'react'
import { Button, Modal, Input, Loader, Message, Icon } from 'semantic-ui-react'
import AdditionalInfoForm from '../AdditionalInfoForm'
import { User } from '../../types/User'
import RTCManager from '../../utils/RTCManager'
import DB from '../../utils/db'

type AddContactModalProps = {
  self: User,
  callback: (contact: User) => void
}

type AddContactModalState = {
  contactID: string | undefined,
  activeStep: 1 | 2 | 3 | 'error',
  modalOpen: boolean,
  addedUser: User | undefined
}

export default class AddContactModal extends React.PureComponent<AddContactModalProps, AddContactModalState> {
  private static readonly defaultState: AddContactModalState = {
    contactID: undefined,
    activeStep: 1,
    modalOpen: false,
    addedUser: undefined
  }

  constructor (props) {
    super(props)
    this.state = AddContactModal.defaultState
  }

  handleOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleClose = () => {
    this.setState(AddContactModal.defaultState)
  }

  handleIDInput = (contactID) => {
    this.setState({ contactID, activeStep: 2 })
    RTCManager.Instance.requestConnection(this.props.self, contactID, true).then((userInfo: User) => {
      if (userInfo === undefined) {
        this.setState({ activeStep: 'error' })
      } else {
        this.setState({ activeStep: 3, addedUser: userInfo })
      }
    }, () => {
      this.setState({ activeStep: 'error' })
    })
  }

  handleCompletion = (contact: User) => {
    DB.Instance.putContact(contact).then(() => {
      this.props.callback(contact)
    })
    this.handleClose()
  }

  handleReset = () => {
    this.setState({ activeStep: 1 })
  }

  render () {
    const step = this.state.activeStep
    const closable = step === 1 || step === 'error'
    return (
      <Modal size='small'
             trigger={<Button onClick={this.handleOpen} icon='plus' size='tiny' />}
             open={this.state.modalOpen}
             onClose={closable ? this.handleClose : () => {}}
             closeIcon={closable}>
        <Modal.Header>Add Contact</Modal.Header>
        {step === 1 ? <InputIDPage initialID={this.state.contactID} handler={this.handleIDInput} />
          : step === 2 ? <ConnectingPage />
          : step === 3 ? <CustomizeInfoPage user={this.state.addedUser} submitHandler={this.handleCompletion} />
          : <ErrorPage cancelHandler={this.handleClose} retryHandler={this.handleReset} />}
      </Modal>
    )
  }
}

type InputIDPageProps = { initialID: string | undefined, handler: (contactID: string) => void }
type InputIDPageState = { input: string }
class InputIDPage extends React.PureComponent<InputIDPageProps, InputIDPageState> {
  readonly state = { input: this.props.initialID || '' }
  handleInput = (event, { value }) => {
    this.setState({ input: value })
  }

  handleClick = (event, { name }) => {
    this.props.handler(this.state.input)
  }

  render () {
    return (
      <>
        <Modal.Content>
          <Input fluid label={'Contact\'s PeerChat ID'} value={this.state.input} onChange={this.handleInput} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleClick}>Connect <Icon name='arrow right' /></Button>
        </Modal.Actions>
      </>
    )
  }
}

class ConnectingPage extends React.PureComponent {
  render () {
    return (
      <>
        <Modal.Content>
          <p>Connection requested&mdash;waiting for contact to send a request. Please wait.
            The next page will appear automatically when the connection is established.</p>
          <Loader className='workaround' content='Connecting&hellip;' active inline='centered' />
        </Modal.Content>
      </>
    )
  }
}

type CustomizeInfoPageProps = { user: User, submitHandler: (user: User) => void }
type CustomizeInfoPageState = { firstName: string, lastName: string, avatar: string }
class CustomizeInfoPage extends React.PureComponent<CustomizeInfoPageProps, CustomizeInfoPageState> {
  readonly state = { firstName: this.props.user.firstName, lastName: this.props.user.lastName, avatar: this.props.user.avatar }

  handleInput = (name: Exclude<keyof User, 'id'>, value: string) => {
    // @ts-ignore
    this.setState({ [name]: value })
  }

  handleSubmit = () => {
    const { firstName, lastName, avatar } = this.state
    this.props.submitHandler({
      id: this.props.user.id,
      firstName,
      lastName,
      avatar
    })
  }

  render () {
    return (
      <>
        <Modal.Content>
          <p>Connection successful. The following information was provided by the contact; you may customize it before saving to your contacts:</p>
          <AdditionalInfoForm userInfo={this.props.user} handleInput={this.handleInput} />
        </Modal.Content>
        <Modal.Actions>
          <Button primary content='Finish &amp; Chat' onClick={this.handleSubmit} />
        </Modal.Actions>
      </>
    )
  }
}

type ErrorPageProps = { cancelHandler: () => void, retryHandler: () => void}
class ErrorPage extends React.PureComponent<ErrorPageProps> {
  render () {
    const { cancelHandler, retryHandler } = this.props
    return (
      <>
        <Modal.Content>
          <Message error><strong>Connection failed.</strong> The connection timed out or was unsuccessful. Please try again.</Message>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={cancelHandler}>Cancel</Button>
          <Button onClick={retryHandler}>Retry</Button>
        </Modal.Actions>
      </>
    )
  }
}
