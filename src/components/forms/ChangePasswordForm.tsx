import { Form, Grid, Message } from 'semantic-ui-react'
import React from 'react'
import DB from '../../utils/db'

type ChangePasswordFormState = { oldInput: string, newInput: string, confirmInput: string, success: boolean | undefined }

export default class ChangePasswordForm extends React.PureComponent<{}, ChangePasswordFormState> {
  readonly state = { oldInput: '', newInput: '', confirmInput: '', success: undefined }

  handleInput = (event, { name, value }) => {
    // @ts-ignore
    this.setState({ [name]: value })
  }

  handleSubmit = () => {
    DB.Instance.changePassword(this.state.newInput, this.state.oldInput).then(success => {
      this.setState({ success })
    })
  }

  render () {
    const { oldInput, newInput, confirmInput, success } = this.state
    // There must be an old and new password entered, the new password and confirmation must match, and the new password must not be the same as the old
    const ready = oldInput !== '' && newInput !== '' && newInput === confirmInput && oldInput !== newInput
    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid stackable>
          <Grid.Row columns='equal'>
            <Grid.Column>
              <Form.Input type='password' label='Current password' name='oldInput' autoComplete='current-password'
                          value={oldInput} onChange={this.handleInput} />
            </Grid.Column>
            <Grid.Column>
              <Form.Input type='password' label='New password' name='newInput' autoComplete='new-password'
                          value={newInput} onChange={this.handleInput} />
            </Grid.Column>
            <Grid.Column>
              <Form.Input type='password' label='Confirm new password' name='confirmInput' autoComplete='new-password'
                          value={confirmInput} onChange={this.handleInput} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Button primary content='Change Password' fluid disabled={!ready} />
            </Grid.Column>
          </Grid.Row>
          {success !== undefined &&
            <Grid.Row>
              <Grid.Column width={16}>
                <Message color={success ? 'green' : 'red'}>
                  {success ? 'Password changed successfully.'
                    : 'Failed to change password. Ensure that your current password is entered correctly.'}
                </Message>
              </Grid.Column>
            </Grid.Row>
          }
        </Grid>
      </Form>
    )
  }
}