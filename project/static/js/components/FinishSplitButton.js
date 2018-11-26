import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { dispatchFinishSplit } from '../actions/event-actions.js'

import ProgressButton from './ProgressButton'

class FinishSplitButton extends React.Component {
  constructor(props) {
    super(props)
    this.finishSplit = this.finishSplit.bind(this)
  }

  finishSplit() {
    this.props.dispatchFinishSplit(this.props.split.id)
  }

  render() {
    let btnText

    if (this.props.split.finishRequestLoading) {
      btnText = 'Loading...'
    } else if (this.props.split.finishRequestError) {
      btnText = 'Error occured, click to try again'
    } else if (this.props.split.last_in_stage) {
      btnText = 'Finish stage'
    } else {
      btnText = 'Finish split'
    }

    return (
      <ProgressButton onClick={this.finishSplit}>
        {btnText}
      </ProgressButton>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    dispatchFinishSplit
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(FinishSplitButton)
