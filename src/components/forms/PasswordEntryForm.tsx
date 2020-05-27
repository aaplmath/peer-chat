import { Form, Grid } from 'semantic-ui-react'
import React from 'react'

export default class PasswordEntryForm extends React.PureComponent {
  render () {
    return (
      <Form>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <Form.Input type='password' label='Enter password' />
            </Grid.Column>
            <Grid.Column width={8}>
              <Form.Input type='password' label='Verify password' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    )
  }
}