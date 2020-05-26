import { Dropdown, Grid, Header, Input, List, Segment } from 'semantic-ui-react'
import React from 'react'
import { User, UserUtils } from '../types/User'
import AddContactModal from './modals/AddContactModal'

// TODO: make sort handling more elegant
enum SortOrder {
  FIRST_ASC, FIRST_DESC, LAST_ASC, LAST_DESC
}

type AscDescVal = 1 | -1
const ASC = 1
const DESC = -1

type ContactsListProps = {
  contacts: User[],
  selectionHandler: (contact: User) => void,
  selfID: string
}

type ContactsListState = {
  activeID: string | undefined,
  searchInput: string,
  sortOrder: SortOrder
}

/**
 * Displays a filterable, selectable list of contacts.
 */
export default class ContactsList extends React.PureComponent<ContactsListProps, ContactsListState> {
  readonly state = { activeID: undefined, searchInput: '', sortOrder: SortOrder.LAST_DESC }

  handleClick = (event, { name }) => {
    this.setState(state => ({ activeID: name === state.activeID ? undefined : name }), () => {
      this.props.selectionHandler(this.props.contacts.find(contact => contact.id === this.state.activeID))
    })
  }

  handleInput = (event, { value }) => {
    this.setState({ searchInput: value })
  }

  handleSortChange = (event, { value }) => {
    this.setState({ sortOrder: value })
  }

  sortedContacts = () => {
    let primaryKey: keyof User
    let secondaryKey: keyof User
    let ascDescVal: AscDescVal
    switch (this.state.sortOrder) {
      case SortOrder.FIRST_DESC:
        primaryKey = 'firstName'
        secondaryKey = 'lastName'
        ascDescVal = ASC
        break
      case SortOrder.FIRST_ASC:
        primaryKey = 'firstName'
        secondaryKey = 'lastName'
        ascDescVal = DESC
        break
      case SortOrder.LAST_DESC:
        primaryKey = 'lastName'
        secondaryKey = 'firstName'
        ascDescVal = ASC
        break
      case SortOrder.LAST_ASC:
        primaryKey = 'lastName'
        secondaryKey = 'firstName'
        ascDescVal = DESC
        break
    }
    // eslint-disable-next-line
    {/* Remember that sort() is in place—we only get immutability b/c we're using filter! */}
    return this.props.contacts.filter(contact => {
      const input = this.state.searchInput
      if (input !== '') {
        const search = this.state.searchInput.trim().toLowerCase()
        // contact.fullName() is guaranteed to be non-null, so we don't need to safety-check it like we do contact.avatar
        return UserUtils.fullName(contact).trim().toLowerCase().indexOf(search) > -1
          || (contact.avatar && contact.avatar.trim().toLowerCase().indexOf(search) > -1)
      }
      return true
    }).sort((a, b) => {
      const sortKey = (key) => {
        if ((!a[key] && !b[key]) || (a[key] === b[key])) {
          return 0
        } else if (!a[key]) {
          return ascDescVal
        } else if (!b[key]) {
          return -ascDescVal
        } else {
          return a[key] > b[key] ? ascDescVal : a[key] < b[key] ? -ascDescVal : 0
        }
      }

      const sortedPrimary = sortKey(primaryKey)
      if (sortedPrimary !== 0) return sortedPrimary

      const sortedSecondary = sortKey(secondaryKey)
      if (sortedSecondary !== 0) return sortedSecondary

      return sortKey('id')
    })
  }

  render () {
    return (
      <Segment>
        {/*TODO: Add ability to sort by recent messages */}
        <Grid className='contact-list-header'>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={12}>
              <Header as='h3'>Contacts</Header>
            </Grid.Column>
            <Grid.Column width={4}>
              <AddContactModal selfID={this.props.selfID} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Input style={{ 'minWidth': 'unset', 'width': '100%' }} icon='search' placeholder='Search contacts&hellip;' value={this.state.searchInput} onChange={this.handleInput}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              Sort by {' '}
              <Dropdown inline options={[
                { key: SortOrder.LAST_DESC, value: SortOrder.LAST_DESC, text: 'Last, Descending' },
                { key: SortOrder.LAST_ASC, value: SortOrder.LAST_ASC, text: 'Last, Ascending' },
                { key: SortOrder.FIRST_DESC, value: SortOrder.FIRST_DESC, text: 'First, Descending' },
                { key: SortOrder.FIRST_ASC, value: SortOrder.FIRST_ASC, text: 'First, Ascending' }
              ]} defaultValue={SortOrder.LAST_DESC} onChange={this.handleSortChange} />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <List selection relaxed>
          {this.sortedContacts().map((contact, idx) => (
              <List.Item name={contact.id} active={this.state.activeID === contact.id} key={idx} onClick={this.handleClick}>
                <List.Content>
                  <List.Header>{UserUtils.fullNameWithLeadingAvatar(contact)}</List.Header>
                </List.Content>
              </List.Item>
            ))
          }
        </List>
      </Segment>
    )
  }
}
