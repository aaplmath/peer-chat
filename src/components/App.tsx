import React from 'react'
import ContactsList from './ContactsList'
import { Container, Grid } from 'semantic-ui-react'
import TopMenu from './TopMenu'
import ChatPane from './chat-pane/ChatPane'
import { User, UserFactory } from '../types/User'
import { ChatMessage, ChatMessageFactory, SenderType } from '../types/ChatMessage'
import FirstVisitModal from './modals/FirstVisitModal'
import DB from '../db'
import Crypto from '../Crypto'
import RTCManager from '../RTCManager'

type AppState = {
  selectedContact?: User,
  self: User,
  contacts: User[],
  activeMessages: ChatMessage[],
  needsInitialization: boolean
}

// const CONTACTS = [
//   UserFactory.create('abc123', 'Tom', 'Jones', null),
//   UserFactory.create('abc143', 'Jane', 'Jackson', '🐮'),
//   UserFactory.create('def134', 'Lucy', 'Carlson', null),
//   UserFactory.create('rt312f', null, null, null)
// ]
//
// const MESSAGES = {
//   'abc123': [
//     ChatMessageFactory.create(SenderType.EXT,'abc123', 'myid123', new Date('4/21/2019 09:21:22'), 'Hello, there!'),
//     ChatMessageFactory.create(SenderType.ME,'myid123', 'abc123', new Date('4/21/2019 09:21:54'), 'What\'s up?'),
//     ChatMessageFactory.create(SenderType.EXT,'abc123', 'myid123', new Date('4/21/2019 09:22:29'), 'Oh, the usual.')
//   ],
//   'abc143': [],
//   'def134': [],
//   'rt312f': []
// }

// const USER_INFO = UserFactory.create('myid123', 'Logdee', 'Nyuzer', '🐿')

export default class App extends React.PureComponent<{}, AppState> {
  readonly state = { selectedContact: undefined, self: undefined, contacts: [], activeMessages: [], needsInitialization: false }

  // Called when contact selected in sidebar
  contactSelectHandler = selectedContact => {
    if (!selectedContact) {
      this.setState({ selectedContact: undefined, activeMessages: [] })
    } else {
      DB.Instance.getChatMessages(selectedContact.id).then(activeMessages => {
        this.setState({ selectedContact, activeMessages })
      })
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
    const { self, contacts, selectedContact, activeMessages, needsInitialization } = this.state
    return (
      <>
        <FirstVisitModal open={needsInitialization} userID={self?.id} callback={this.handleInitialization} />
        {/* Wait to render top menu until we have a self to avoid pointless headache with derived state */}
        {self && <TopMenu userInfo={self} updateHandler={this.handleSelfFieldUpdate} />}
        <Container>
          <Grid>
            <Grid.Column width={4}>
              <ContactsList contacts={contacts} selectionHandler={this.contactSelectHandler} selfID={self?.id} />
            </Grid.Column>
            <Grid.Column width={12}>
              <ChatPane contact={selectedContact} messages={activeMessages} />
            </Grid.Column>
          </Grid>
        </Container>
      </>
    )
  }
}
