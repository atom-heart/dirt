import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { hideModal } from '../actions/modal-actions'

import Modal from './Modal'

class TurnModal extends React.Component {
  constructor(props) {
    super(props)
    this.onClose = this.onClose.bind(this)
  }

  onClose() {
    this.props.hideModal()
  }

  render() {
    return (
      <Modal onClose={this.onClose}>
        <div style={{width: '350px', height: '250px', background: 'white', borderRadius: '3px'}} />
      </Modal>
    )
  }
}

TurnModal.propTypes = {
  hideModal: PropTypes.func
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    hideModal,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(TurnModal)
