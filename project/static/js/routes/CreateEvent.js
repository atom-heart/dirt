import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Menu from '../components/CreateEvent/Menu'

class CreateEvent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Menu />
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent)
