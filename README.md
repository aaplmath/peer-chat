# PeerChat

PeerChat is designed to demonstrate various features of front-end web development in the form of an encrypted, peer-to-peer chat application with a minimal signaling server. It uses React, WebRTC, Semantic UI React, PouchDB with the crypto-pouch plugin, and the emoji-picker library. Due to limitations of other browsers' IndexedDB implementations, PeerChat is only compatible with Chrome.

By default, the UI contains an explanatory popover that details the principles and technologies on which PeerChat operates; the popover can be hidden by simply removing the call to instantiate the `HowItWorksModal` root in `index.tsx`.

This project is built atop Node.js. Use `npm install` to fetch required dependencies. To run the project, you'll need to:

* Build the server with `npm run build-server`
* Build the client with `npm run build`
* Run the server with `npm run start`

Alternatively, to start just the React debug server, run `npm run start-react`.