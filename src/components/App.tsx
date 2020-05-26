import React from 'react'
import ContactsList from './ContactsList'
import { Container, Grid } from 'semantic-ui-react'
import TopMenu from './TopMenu'
import ChatPane from './chat-pane/ChatPane'
import { User } from '../types/User'
import FirstVisitModal from './modals/FirstVisitModal'
import DB from '../utils/db'
import Crypto from '../utils/Crypto'
import AccountDeletedOverlay from './AccountDeletedOverlay'
import '../styles/defaults.css'
require('semantic-ui-css/semantic.min.css')

type AppState = {
  selectedContact?: User,
  self: User,
  contacts: User[],
  needsInitialization: boolean,
  accountDeleted: boolean
}

export default class App extends React.PureComponent<{}, AppState> {
  readonly state = { selectedContact: undefined, self: undefined, contacts: [], needsInitialization: false, accountDeleted: false }

  // Called when contact selected in sidebar
  contactSelectHandler = selectedContact => {
    if (!selectedContact) {
      this.setState({ selectedContact: undefined })
    } else {
      this.setState({ selectedContact })
    }
  }

  // First visit methods
  generateKeypair = () => {
    // TODO: error handling
    Crypto.generateKeypair().then(keypair => {
      DB.Instance.writeKeypair(keypair)
      return Crypto.getRawPublicKey(keypair)
    }).then(pubStr => {
      this.setState(state => ({ self: { ...state.self, id: pubStr } }))
    })
  }

  // Called by FirstViewModal when user sets up profile
  handleInitialization = (firstName: string, lastName: string, avatar: string) => {
    const newSelf = { ...this.state.self, firstName: firstName || null, lastName: lastName || null, avatar: avatar || null }
    DB.Instance.updateSelf(newSelf).then(() => {
      this.setState({ needsInitialization: false, self: newSelf })
    })
  }

  // Called by TopMenu when user changes profile
  handleSelfFieldUpdate = (fieldName, value) => {
    const newSelf = { ...this.state.self, [fieldName]: value }
    DB.Instance.updateSelf(newSelf).then(() => {
      this.setState({ self: newSelf })
    })
  }

  handleNewContact = (contact) => {
    this.setState(state => ({ contacts: state.contacts.concat(contact) }))
  }

  handleContactUpdate = (contact: User) => {
    this.setState(state => ({ contacts: state.contacts.map(cnt => cnt.id === contact.id ? contact : cnt) }))
    // For now, the updated contact is always the selected contact, but in a better-designed version of the app, that might not be true…
    if (contact.id === this.state.selectedContact.id) {
      this.contactSelectHandler(contact)
    }
  }

  handleAccountDeletion = () => {
    this.setState({ accountDeleted: true })
  }

  componentDidMount () {
    DB.Instance.getContacts().then(contacts => {
      this.setState({ contacts: contacts })
    })
    DB.Instance.getSelf().then(self => {
      if (self === undefined) {
        this.setState({ needsInitialization: true })
        this.generateKeypair()
      } else {
        this.setState({ self })
      }
    })
  }

  render () {
    const { self, contacts, selectedContact, needsInitialization, accountDeleted } = this.state
    return !accountDeleted ? (
      <>
        <FirstVisitModal open={needsInitialization} selfID={self?.id} callback={this.handleInitialization} />
        {/* Wait to render top menu until we have a self to avoid pointless headache with derived state */}
        {self && <TopMenu userInfo={self} updateHandler={this.handleSelfFieldUpdate} profileDeletionHandler={this.handleAccountDeletion} />}
        <Container>
          <Grid>
            <Grid.Column width={4}>
              <ContactsList contacts={contacts} selectionHandler={this.contactSelectHandler} self={self} newContactHandler={this.handleNewContact} />
            </Grid.Column>
            <Grid.Column width={12}>
              <ChatPane contact={selectedContact} self={self} contactUpdateHandler={this.handleContactUpdate} />
            </Grid.Column>
          </Grid>
        </Container>
      </>
    ) : ( <AccountDeletedOverlay /> )
  }
}
