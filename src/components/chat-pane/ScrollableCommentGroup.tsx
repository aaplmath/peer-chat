import { Comment } from 'semantic-ui-react'
import React, { RefObject } from 'react'

export default class ScrollableCommentGroup extends React.PureComponent {
  private ref: RefObject<HTMLDivElement>

  constructor (props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  scrollToBottom () {
    this.ref.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' })
  }

  render () {
    return (
      <Comment.Group className='chat-list'>
        {this.props.children}
        <div ref={this.ref} />
      </Comment.Group>
    )
  }
}


// import { Comment } from 'semantic-ui-react'
// import React, { useEffect, useRef } from 'react'
//
// export default props => {
//   const divRef = useRef(null)
//   useEffect(() => {
//     divRef.current.scrollIntoView()
//   })
//
//   return (
//     <Comment.Group className='chat-list'>
//       {props.children}
//       <div ref={divRef} />
//     </Comment.Group>
//   )
// }

