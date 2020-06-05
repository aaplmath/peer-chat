import React from 'react'
import { Emoji } from 'emoji-mart'
import { Container } from 'semantic-ui-react'

export type User = {
  id: string
  firstName: string | null
  lastName: string | null
  avatar: string | null
}

export class UserFactory {
  public static create (id: string, firstName: string | null = null, lastName: string | null = null, avatar: string | null = null) {
    return {
      id,
      firstName,
      lastName,
      avatar
    }
  }
}

export class UserUtils {
  /**
   * Returns the user's full name if either first or last name exists, or else the user's ID in parentheses.
   * @param user the user whose name to generate.
   */
  public static fullName (user: User): string {
    if (!user) return ''
    const ID_SLICE_LENGTH = 4
    if (user.firstName === null && user.lastName === null) {
      return `(${user.id.slice(0, ID_SLICE_LENGTH)}…${user.id.slice(user.id.length - ID_SLICE_LENGTH)})`
    } else if (user.firstName === null) {
      return user.lastName
    } else if (user.lastName === null) {
      return user.firstName
    }
    return `${user.firstName || ''} ${user.lastName}`
  }

  /**
   * Returns the user's full name if either first or last name exists, or else the user's ID in parentheses, all preceded by the user's avatar if one exists.
   * @param user the user whose name to generate.
   */
  public static fullNameWithLeadingAvatar (user: User): React.ReactFragment {
    return (
      <span className='contact-row'>
        {(user && user.avatar) && <> {UserUtils.emojiAvatar(user)} {' '} </>}
        <span className='contact-name'>{UserUtils.fullName(user)}</span>
      </span>
    )
  }

  public static emojiAvatar (user: User) {
    return <Emoji emoji={user.avatar} size={24} />
  }
}
