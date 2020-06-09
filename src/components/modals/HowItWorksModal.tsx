import React from 'react'
import { Accordion, Button, Icon, List, Modal } from 'semantic-ui-react'

const HOW_IT_WORKS_CONTENT: { title: string, body: React.ReactFragment }[] = [
  {
    title: 'How to Use PeerChat',
    body: (<>
      To begin using PeerChat, set up a profile using the profile creation dialog. Take note of your PeerChat ID, as you'll
      need it for others to contact you. If you ever need to find your PeerChat ID, update your profile information, or change your
      database password, you can do so from the profile management dialog accessed by clicking on your name in the top right corner.
      <br /><br />
      Once your profile is created, you'll be able to add contacts using the plus button in the contacts sidebar. To add a contact,
      enter the contact's PeerChat ID and click "Connect." Your contact will need to do the same simultaneously. Once a connection
      is established, you'll be prompted to confirm your contact's profile information. You'll then be able to see the conversation
      view in the chat pane.
      <br />< br/>
      To chat with an existing contact, select the contact from the contact list, then click "Connect." Your contact must do the same
      simultaneously. The chat view will then appear. Note that you may have only one active conversation at a time&mdash;if you are
      chatting with one contact, you won't be able to receive messages from any others. Once you establish a connection with a contact,
      that connection will remain open until you close or reload the page or initiate a new connection with another contact (or attempt
      to add a new contact).
      <br /><br />
    </>)
  },
  {
    title: 'Peer-to-Peer Messaging',
    body: (<>
      Many traditional chat services work by sending your messages from your computer to a third-party server,
      which relays them to the intended recipient. However, in a peer-to-peer environment, your messages are sent directly from
      your computer to your recipient's device, eschewing the need for a third-party relay.
      <br /><br />
      Technically speaking, however, peer-to-peer communication (at least as PeerChat is configured) is not truly "serverless."
      This is because both clients must be able to exchange "contact information"&mdash;that is, where they're located on the
      Internet and how they can be contacted. Once this initial exchange is complete, all communication can be performed without
      a server. (In fact, once a peer-to-peer connection is established, PeerChat <em>is</em> entirely serverless&mdash;all chat
      records and profile information are stored locally and encrypted in the browser's database. This is why PeerChat only works
      if both users are connected at the same time&mdash;there's no server to "hold onto" messages for later delivery.)
      The process for establishing a connection is (roughly) as follows:
      <br />
      <List bulleted>
        <List.Item>The initiating client establishes a connection to a <em>signaling server</em> (which is specific to PeerChat)
          and requests a connection with another client, whom the initiator identifies using an anonymous token derived from
          the two users' PeerChat IDs (thus preventing the signaling server from gleaning who is attempting to communicate with whom).
          The initiator sends an <em>offer</em> describing the parameters of the session it would like to establish (in the case of PeerChat,
          a single data stream for sending and receiving text messages). The signaling server then "announces" this offer to all parties
          who have provided the same anonymous token (which clients declare upon connecting to the signaling server).</List.Item>
        <List.Item>The initiating client also queries a <em>STUN server</em> (PeerChat uses Google's) to determine how it (the client)
          can be contacted by a peer elsewhere on the Internet (a bit like asking your mobile carrier what phone number you've been
          assigned). It sends this information (known as <em>ICE candidates</em>) to the signaling server for forwarding to
          the requested client.</List.Item>
        <List.Item>The receiving client responds to the initiator's offer with an <em>answer</em> and also queries the STUN
          server, sending its own ICE candidates to the initiator by asking the signaling server to forward them to the client
          with the appropriate PeerChat ID.</List.Item>
        <List.Item>Using the parameters described in the offer and answer and "contact information" sent in the ICE candidates,
          the two clients can establish a direct connection and begin serverless, peer-to-peer communication.</List.Item>
      </List>
      You might have noticed that the above process doesn't have any means of verifying whether a client is who it says it is
      (for instance, Alice might be trying to talk to Bob and enter his ID, but Eve may have beaten Bob to the signaling server and told
      the signaling server that her ID is the same as Bob's so that she can send Alice <em>her</em> "contact information," even though
      Alice thinks the info she's receiving is for Bob). To see how PeerChat overcomes this challenge (without the signaling server
      knowing anything about its users), see the "Encryption in PeerChat" section.
    </>)
  },
  {
    title: 'Encryption in PeerChat',
    body: (<>
      Encryption (and associated cryptographic concepts) accomplish three primary privacy-focused objectives in PeerChat:
      <br />
      <List bulleted>
        <List.Item>
          <strong>Security in Transit</strong>
          <p>The peer-to-peer communication protocol used by PeerChat (WebRTC) is encrypted by default,
            meaning that all data sent between two parties is sent in a coded form only decipherable
            by the intended recipient. If a third party attempts to intercept the message while it is being sent between
            the two parties, the malicious actor will not be able to read it.</p>
        </List.Item>
        <List.Item>
          <strong>Security at Rest</strong>
          <p>When messages are sent or received in PeerChat, they're stored in the browser's database for future retrieval.
            However, these messages are <em>not</em> encrypted as they are while in transit, since the messages must be decoded
            on either end to be read (and the encryption used in transit actually renders the message unreadable to the sender&mdash;
            Google "asymmetric cryptography" for the mathematical details). Therefore, PeerChat uses a separate (symmetric) encryption
            scheme to encrypt all data stored in the browser's database. This ensures that even if a malicious actor gained access to a
            copy of the browser's local database, they would be unable to retrieve the contents of the messages the user had sent and
            received (or any metadata associated therewith).</p>
        </List.Item>
        <List.Item>
          <strong>Identity Verification</strong>
          <p>PeerChat is, to some extent, an anonymous messaging system: users are identified only by random IDs and can opt not
            to supply any identifying information when setting up their profile. However, paradoxically, PeerChat is able to guarantee
            that the person you're talking to is indeed the person to whom the ID you entered belongs. (So, for instance, if Alice asks
            Bob for his ID and he tells it to her&mdash;in person, via carrier pigeon, however&mdash;Alice can be confident that when
            she adds that ID to her contacts, she's really adding Bob and not somebody pretending to have that same ID.) PeerChat
            makes this guarantee despite retaining <em>absolutely no information on its servers</em>. To accomplish this, PeerChat
            actually generates two unique identifiers for each profile&mdash;a <em>verification key</em>, which is turned into a
            PeerChat ID; and a <em>signing key</em>, which is used to validate any information sent in the establishment of a connection.
            When you connect to a user in PeerChat, every message sent in establishing the peer-to-peer connection bears a cryptographic
            signature generated using the secret signing key. The recipient can use the verification key (i.e., the
            sender's PeerChat ID) to verify that the signature is authentic&mdash;only the secret signing key (which is encrypted in the
            sender's database as described above) can generate a signature that matches the sender's PeerChat ID.</p>
        </List.Item>
      </List>
    </>)
  },
  {
    title: 'React',
    body: (<>
      PeerChat is built atop a framework called React, a technology developed by Facebook that powers many modern web apps
      (and, more recently, native ones&mdash;for instance, those that you install on your phone from an app store). React is
      primarily concerned with a website's front-end (i.e., the user-facing interface; a cloud database, for instance, would be
      considered "back-end"). Conceptually, it represents a website as a composition of <em>components</em>, each of which
      represents some distinct part&mdash;both visual and functional&mdash;of the app. For instance, at the highest level, PeerChat
      is composed of three primary components: a top menu, a contacts list, and a chat pane. In turn, each of these is composed
      of many smaller components, each encapsulating some piece of the user interface and its functionality.
      <br /><br />
      Another interesting feature of React is that components can be thought of as "functions" of the "state" of the user interface.
      Essentially, just as we can define a mathematical function <code>f(x)</code> that produces some fixed output (say, <code>x<sup>2</sup></code>)
      for any given input, we can also think of the user interface as being a function whose input is the
      current state of the app (for instance, which contact is selected in the sidebar, or the user's profile information) and whose output
      is an appropriate piece of UI. (Technically, React conceptualizes of a component's input more granularly as being either an
      intrinsic state of a given component or properties passed down from a higher-level component. For instance, the state of the
      current chat conversation&mdash;the parties involved, the connection status, and so forth&mdash;is managed by the chat pane,
      which passes down just a list of messages to the scrollable message list component as properties&mdash;the message list
      component is unaware of, and cannot modify, the higher-level state, but instead receives input based indirectly
      on that state and produces UI as output accordingly.)
    </>)
  }
]

type HowItWorksModalState = { activeIndex: number, shown: boolean }
export default class HowItWorksModal extends React.PureComponent<{}, HowItWorksModalState> {
  readonly state = { activeIndex: -1, shown: false }

  handleClick = (event, { index }) => {
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  toggleModal = () => { this.setState(state => ({ shown: !state.shown })) }

  render () {
    const { activeIndex, shown } = this.state
    return (
      <Modal size='large' className='how-it-works-modal' open={shown} onClose={this.toggleModal}
             trigger={<Button className='how-it-works-button' size='tiny' icon='info'
                              color='orange' content='How PeerChat Works' onClick={this.toggleModal} />}>
        <Modal.Header>How PeerChat Works</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>PeerChat is a <em>peer-to-peer</em>, <em>encrypted</em> chat application built using the <em>React framework</em>.
              To learn more, check out the descriptions below. Or, if you'd like a peak behind the scenes,
              check out the <a href='https://codesandbox.io/s/peerchat-deployment-ecc3m?file=/src/components/App.tsx' className='code-link'>code base on CodeSandbox</a>.</p>
            <Accordion styled fluid>
              {HOW_IT_WORKS_CONTENT.map((item, idx) => (
                <React.Fragment key={idx}>
                  <Accordion.Title active={activeIndex === idx} index={idx} onClick={this.handleClick}>
                    <Icon name='dropdown' />
                    {item.title}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === idx}>
                    {item.body}
                  </Accordion.Content>
                </React.Fragment>
              ))}
            </Accordion>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}