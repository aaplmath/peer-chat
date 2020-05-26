import React from 'react'
import { Form, Grid } from 'semantic-ui-react'
import { User } from '../types/User'

type AdditionalInfoFormProps = {
  userInfo: Partial<User>,
  handleInput: (name: string, value: string) => void
}

type AdditionalInfoFormState = {
  userInfo: Partial<User>
}

export default class AdditionalInfoForm extends React.PureComponent<AdditionalInfoFormProps, AdditionalInfoFormState> {
  readonly state = { userInfo: this.props.userInfo }

  handleInput = (event, { name, value }) => {
    this.setState(state => ({
      userInfo: { ...state.userInfo, [name]: value }
    }))
    this.props.handleInput(name, value)
  }

  render () {
    const { firstName, lastName, avatar } = this.state.userInfo

    return (
      <Form>
        <Grid columns='equal'>
          <Grid.Column>
            <Form.Input label='First name (optional)' name='firstName' onChange={this.handleInput} value={firstName || ''} />
          </Grid.Column>
          <Grid.Column>
            <Form.Input label='Last name (optional)' name='lastName' onChange={this.handleInput} value={lastName || ''} />
          </Grid.Column>
          <Grid.Column>
            <Form.Input label='Emoji profile picture (optional)' name='avatar' onChange={this.handleInput} value={avatar || ''} />
          </Grid.Column>
        </Grid>
      </Form>
    )
  }
}