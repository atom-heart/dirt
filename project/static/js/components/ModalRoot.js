import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TurnModal from './TurnModal'

import { TURN_MODAL } from '../modal-types'

const MODAL_COMPONENTS = {
  [TURN_MODAL]: TurnModal,
}

const ModalRoot = (props) => {
  if (!props.modalType) {
    return null
  }

  const SpecificModal = MODAL_COMPONENTS[props.modalType]

  return <SpecificModal />
}

ModalRoot.propTypes = {
  modalType: PropTypes.string
}

const mapStateToProps = state => ({
  modalType: state.modal.modalType
})

export default connect(mapStateToProps)(ModalRoot)
