import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../css/layout.css'

import ErrorBoundary from './components/ErrorBoundary'

import App from './components/App'
import Landing from './components/Landing'
import Event from './components/Event'
import NewEvent from './components/NewEvent'
import ModalRoot from './components/ModalRoot'
import MainNav from './components/MainNav'
import AllEvents from './components/AllEvents'

import store from './store.js'

import { Container } from 'reactstrap'

ReactDOM.render((
  <ErrorBoundary>
    <Provider store={store}>
      <Router>
        <App>
          <Route path="/" component={MainNav} />
          <Container>

            <Route path="/" exact component={Landing} />
            <Route path="/new" component={NewEvent} />
            <Route path="/event/:id" component={Event} />
            <Route path="/events" component={AllEvents} />

            <Route path="/" component={ModalRoot} />
          </Container>
        </App>
      </Router>
    </Provider>
  </ErrorBoundary>
), document.getElementById('root'))
