import React from 'react'
import { Container } from 'semantic-ui-react'

export default class NoContactPane extends React.PureComponent {
  render () {
    return (
      <Container text textAlign='center'>
        <p>Select a contact to start chatting, or click the plus icon to add a new contact.</p>
      </Container>
    )
  }
}