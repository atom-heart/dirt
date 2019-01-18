import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { resetStore } from '../actions/app-actions'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    const currTopLevelRoute = this.props.location.pathname.split('/')[1]
    const prevTopLevelRoute = prevProps.location.pathname.split('/')[1]

    if (currTopLevelRoute !== prevTopLevelRoute) {
      this.props.resetStore()
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.children}
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    resetStore
  }, dispatch)
}

export default withRouter(connect(null, mapDispatchToProps)(App))
