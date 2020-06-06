import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import HowItWorksModal from './components/modals/HowItWorksModal'

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

// NOTE: This is horrendous and is only for the demo. Most definitely not for production.
ReactDOM.render(<HowItWorksModal />, document.getElementById('button-root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
