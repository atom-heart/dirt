import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../css/layout.css'

import ErrorBoundary from './components/ErrorBoundary'
import PageLoader from './components/PageLoader'
const Event = lazy(() => import('./components/Event'))
import ModalRoot from './components/ModalRoot'
import store from './store.js'

import { Container } from 'reactstrap'

ReactDOM.render((
  <ErrorBoundary>
    <Provider store={store}>
      <Router>
        <Container>
          <Suspense fallback={<PageLoader />}>
            <Route path="/" exact render={() => { return <div>Hello!</div> }} />
            <Route path="/event/:id" component={Event} />
          </Suspense>

          <Route path="/" component={ModalRoot} />
        </Container>
      </Router>
    </Provider>
  </ErrorBoundary>
), document.getElementById('root'))
