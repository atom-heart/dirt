import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { timeToStr } from '../helpers'

import { Input, Button, FormGroup, Label } from 'reactstrap'

import Modal from './Modal'
import TimeInput from './TimeInput'

import ModalHeader from './styled/ModalHeader'
import ModalBody from './styled/ModalBody'
import ModalFooter from './styled/ModalFooter'
import ModalCloseButton from './styled/ModalCloseButton'

import { hideModal } from '../actions/modal-actions'
import { toggleDisq } from '../actions/turn-actions'

import { sendTurn } from '../agents/turn-agents'

class TurnModal extends React.Component {
  constructor(props) {
    super(props)
    this.onClose = this.onClose.bind(this)
    this.onSend = this.onSend.bind(this)
  }

  onClose() {
    this.props.hideModal()
  }

  onSend(e) {
    e.preventDefault()

    this.props.sendTurn({
      action: this.props.disqualified ? 'DISQUALIFY' : 'ADD_TIME',
      time: this.props.disqualified ? null : timeToStr(this.props.time),
      player_id: this.props.player.id,
      split_id: this.props.split.id
    })
  }

  render() {
    let button = {}

    if (this.props.error) {
      button = { text: 'Error. Try again!', color: 'danger' }
    } else if (this.props.sending) {
      button = { text: 'Sending...', color: 'primary', disabled: true }
    } else {
      button = { text: 'Send', color: 'primary' }
    }

    return (
      <Modal onClose={this.onClose}>
        <div className="modal-content split-modal">

          <ModalHeader>
            <div>
              <h5 className="modal-title">Add time</h5>
              <span className="text-muted">
                {this.props.player.name} / {this.props.split.track}
              </span>
            </div>
            <ModalCloseButton onClick={this.onClose} />
          </ModalHeader>

          <ModalBody>
            <TimeInput disabled={this.props.disqualified} />
          </ModalBody>

          <ModalFooter>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={this.props.disqualified}
                  onChange={this.props.toggleDisq}
                /> Disqualify
              </Label>
            </FormGroup>

            <Button
              onClick={this.onSend}
              type="submit"
              color={button.color}
              disabled={button.disabled}
              style={{marginLeft: 5, minWidth: 80}}
            >
              {button.text}
            </Button>
          </ModalFooter>

        </div>
      </Modal>
    )
  }
}

TurnModal.propTypes = {
  hideModal: PropTypes.func
}

const mapStateToProps = state => state.turn

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    hideModal,
    toggleDisq,
    sendTurn
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnModal)
