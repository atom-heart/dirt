import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { finishSplit } from '../agents/splits-agents.js'

import ProgressButton from './ProgressButton'

class FinishSplitButton extends React.Component {
  constructor(props) {
    super(props)
    this.split = this.props.splits[this.props.splitId]
    this.finishSplit = this.finishSplit.bind(this)
  }

  finishSplit() {
    if (!this.split.isLoading) {
      this.props.finishSplit(this.split.id)
    }
  }

  render() {
    let btnText

    if (this.split.isLoading) {
      btnText = 'Loading...'
    } else if (this.split.error) {
      btnText = 'Error occured, click to try again'
    } else if (this.split.last_in_stage) {
      btnText = 'Finish stage'
    } else {
      btnText = 'Start next split'
    }

    return (
      <ProgressButton style={{borderTop: 0, borderRadius: '4px'}} onClick={this.finishSplit}>
        {btnText}
      </ProgressButton>
    )
  }
}

const mapStateToProps = (state) => ({
  splits: state.splits.byId
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    finishSplit
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FinishSplitButton)
