import { Dimmer, Header, Icon } from 'semantic-ui-react'
import React from 'react'

export default class UnsupportedBrowserOverlay extends React.PureComponent {
  render () {
    return (
      <Dimmer active={true} page className='opaque-overlay'>
        <Header as='h2' icon inverted>
          <Icon name='globe' />
          Unsupported Browser
          <Header.Subheader>
            PeerChat is not compatible with your browser.
            Please visit this page using a recent version of Google Chrome for desktop to use PeerChat.
          </Header.Subheader>
        </Header>
      </Dimmer>
    )
  }
}