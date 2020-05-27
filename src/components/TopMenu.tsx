import React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import ProfileModal from './modals/ProfileModal'
import { User, UserUtils } from '../types/User'

type TopMenuProps = {
  userInfo: User | undefined,
  updateHandler: (fieldName, value) => void,
  profileDeletionHandler: () => void
}

export default class TopMenu extends React.PureComponent<TopMenuProps> {
  render () {
    return (
      <Menu borderless>
        <Menu.Item header>PeerChat</Menu.Item>
        <Menu.Menu position='right'>
          <Dropdown text={UserUtils.fullNameWithLeadingAvatar(this.props.userInfo)} pointing className='link item'>
            <Dropdown.Menu>
              {this.props.userInfo &&
                <ProfileModal user={this.props.userInfo}
                              isOwnProfile={true}
                              updateHandler={this.props.updateHandler}
                              profileDeletionHandler={this.props.profileDeletionHandler} />
              }
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    )
  }
}