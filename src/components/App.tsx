import React from 'react'
import ContactsList from './ContactsList'
import { Container, Grid } from 'semantic-ui-react'
import TopMenu from './TopMenu'
import ChatPane from './chat-pane/ChatPane'
import { User } from '../types/User'
import FirstVisitModal from './modals/FirstVisitModal'
import DB from '../utils/db'
import Crypto from '../utils/Crypto'
import ProfileDeletedOverlay from './overlays/ProfileDeletedOverlay'
import PasswordOverlay from './overlays/PasswordOverlay'
import UnsupportedBrowserOverlay from './overlays/UnsupportedBrowserOverlay'
import 'semantic-ui-css/semantic.min.css'
import '../styles/defaults.css'

type AppState = {
  selectedContact?: User,
  self: User,
  contacts: User[],
  needsInitialization: boolean,
  profileDeleted: boolean,
  dbUnlocked: boolean
}

export default class App extends React.PureComponent<{}, AppState> {
  readonly state = {
    selectedContact: undefined,
    self: undefined,
    contacts: [],
    needsInitialization: false,
    profileDeleted: false,
    dbUnlocked: false
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
  handleInitialization = (firstName: string, lastName: string, avatar: string, password: string) => {
    const newSelf = { ...this.state.self, firstName: firstName || null, lastName: lastName || null, avatar: avatar || null }
    DB.Instance.updateSelf(newSelf)
      .then(() => DB.Instance.setPassword(password))
      .then(success => {
        if (success) {
          this.setState({ needsInitialization: false, self: newSelf, dbUnlocked: true })
        } else {
          console.error('Initialization failed')
        }
      })
  }

  // Called after the database is successfully unlocked.
  // NOTE: Anything encrypted that needs to be fetched from the database should be fetched HERE, not in componentDidMount()!
  handleDBUnlocked = () => {
    this.setState({ dbUnlocked: true })
    DB.Instance.getContacts().then(contacts => {
      this.setState({ contacts })
    })
    DB.Instance.getSelf().then(self => {
      this.setState({ self })
    })
  }

  // Called by TopMenu when user changes profile
  handleSelfFieldUpdate = (fieldName, value) => {
    const newSelf = { ...this.state.self, [fieldName]: value }
    this.setState({ self: newSelf })
    DB.Instance.updateSelf(newSelf)
  }

  // Called when contact selected in sidebar
  handleContactSelection = selectedContact => {
    if (!selectedContact) {
      this.setState({ selectedContact: undefined })
    } else {
      this.setState({ selectedContact })
    }
  }

  handleNewContact = (contact) => {
    this.setState(state => ({ contacts: state.contacts.concat(contact) }))
  }

  handleContactUpdate = (contact: User) => {
    this.setState(state => ({ contacts: state.contacts.map(cnt => cnt.id === contact.id ? contact : cnt) }))
    // Since we get contact update callbacks asynchronously from the database, the updated contact may or may not be the selected user; if it is, we need to update
    if (contact.id === this.state.selectedContact.id) {
      this.handleContactSelection(contact)
    }
  }

  handleContactRemoval = (contactID: string) => {
    this.setState(state => ({
      contacts: state.contacts.filter(contact => contact.id !== contactID),
      selectedContact: state.selectedContact.id === contactID ? undefined : state.selectedContact
    }))
  }

  handleProfileDeletion = () => {
    this.setState({ profileDeleted: true })
  }

  componentDidMount () {
    const selfPromise = DB.Instance.getSelf()
    const keyExistsPromise = DB.Instance.encryptionKeyExists()
    Promise.all([selfPromise, keyExistsPromise]).then(([self, dbKeyExists]) => {
      if (self === undefined) {
        this.setState({ needsInitialization: true })
        this.generateKeypair()
      } else if (!dbKeyExists) {
        // They probably got assigned an ID but reloaded the page or closed out before finishing setup
        // There's no point giving them a new ID, but we do need to run through setup again so they can encrypt the DB
        this.setState({ self, needsInitialization: true })
      }
    })

    DB.Instance.onNewContact = this.handleNewContact
    DB.Instance.onUpdatedContact = this.handleContactUpdate
    DB.Instance.onRemovedContactWithID = this.handleContactRemoval
  }

  render () {
    const { self, contacts, selectedContact, needsInitialization, profileDeleted, dbUnlocked } = this.state
    if (profileDeleted) {
      return <ProfileDeletedOverlay />
    } else if (!dbUnlocked && !needsInitialization) {
      return <PasswordOverlay onDBUnlocked={this.handleDBUnlocked} />
    }

    // TODO: fix the app so it works in other browsers
    // @ts-ignore
    if (!window.chrome || !window.chrome.runtime) return <UnsupportedBrowserOverlay />

    return (
      <>
        <FirstVisitModal open={needsInitialization} selfID={self?.id} callback={this.handleInitialization} />
        <TopMenu userInfo={self} updateHandler={this.handleSelfFieldUpdate} profileDeletionHandler={this.handleProfileDeletion} />
        <Container>
          <Grid>
            <Grid.Column width={4}>
              <ContactsList contacts={contacts} selectionHandler={this.handleContactSelection} self={self} />
            </Grid.Column>
            <Grid.Column width={12}>
              <ChatPane contact={selectedContact} self={self} />
            </Grid.Column>
          </Grid>
        </Container>
      </>
    )
  }
}
