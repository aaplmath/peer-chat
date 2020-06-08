import React from 'react'
import { Form, Grid, Segment } from 'semantic-ui-react'
import { User } from '../../types/User'
import { Emoji, Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

type AdditionalInfoFormProps = {
  userInfo: Partial<User>,
  handleInput: (name: string, value: string) => void
}

type AdditionalInfoFormState = {
  userInfo: Partial<User>,
  showEmoji: boolean
}

export default class AdditionalInfoForm extends React.PureComponent<AdditionalInfoFormProps, AdditionalInfoFormState> {
  readonly state = { userInfo: this.props.userInfo, showEmoji: false }

  handleInput = (event, { name, value }) => {
    this.setState(state => ({
      userInfo: { ...state.userInfo, [name]: value }
    }))
    this.props.handleInput(name, value)
  }

  handleToggleEmoji = () => {
    this.setState(state => ({ showEmoji: !state.showEmoji }))
  }

  handleClearEmoji = () => {
    this.handleInput({}, { name: 'avatar', value: null })
  }

  handleEmojiSelect = (emoji) => {
    this.handleInput({}, { name: 'avatar', value: emoji.colons })
    this.setState({ showEmoji: false })
  }

  render () {
    const { firstName, lastName, avatar } = this.state.userInfo
    const { showEmoji } = this.state

    return (
      <Form>
        <Grid stackable verticalAlign='bottom'>
          <Grid.Column width={5}>
            <Form.Input label='First name (optional)' name='firstName' onChange={this.handleInput} value={firstName || ''} />
          </Grid.Column>
          <Grid.Column width={5}>
            <Form.Input label='Last name (optional)' name='lastName' onChange={this.handleInput} value={lastName || ''} />
          </Grid.Column>
          <Grid.Column width={6}>
            <Segment className='emoji-segment'>
              {avatar && <Emoji emoji={avatar} size={24} />}
              {showEmoji && <Picker showPreview={false} autoFocus
                                    style={{ position: 'absolute', zIndex: 100, bottom: '100%' }}
                                    onSelect={this.handleEmojiSelect} />}
              <Form.Button primary content='Set Avatar' onClick={this.handleToggleEmoji} className='inline-button' size='tiny' inline />
              <Form.Button secondary content='Clear' onClick={this.handleClearEmoji} disabled={!avatar} className='inline-button' size='tiny' inline />
            </Segment>
          </Grid.Column>
        </Grid>
      </Form>
    )
  }
}