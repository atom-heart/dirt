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
import ModalError from './styled/ModalError'
import ModalCloseButton from './styled/ModalCloseButton'

import { hideModal } from '../actions/modal-actions'
import { toggleDisq } from '../actions/turn-actions'

import { sendTurn } from '../agents/turn-agents'

class TurnModal extends React.Component {
  constructor(props) {
    super(props)

    this.listenKeyboard = this.listenKeyboard.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onSend = this.onSend.bind(this)
  }

  listenKeyboard(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.onSend(event)
    }

    else if (
      event.key === 'd' ||
      event.key === 'D' ||
      event.keyCode === 68 ||
      event.keyCode === 100
    ) {
      document.activeElement.blur()
      this.props.toggleDisq()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.listenKeyboard, true)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.listenKeyboard, true)
  }

  onClose() {
    this.props.hideModal()
  }

  onSend(event) {
    event.preventDefault()

    this.props.sendTurn({
      turnId: this.props.turnId,
      time: this.props.disqualified ? null : timeToStr(this.props.time),
      disqualified: this.props.disqualified
    })
  }

  render() {
    const buttonText = this.props.isLoading ? 'Sending...' : 'Send'

    return (
      <Modal onClose={this.onClose}>
        <div className="modal-content split-modal">

          <ModalHeader>
            <div>
              <h5 className="modal-title">{this.props.player}</h5>
              <span className="text-muted">
                {this.props.track}
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
              color="primary"
              disabled={this.props.isLoading}
              style={{marginLeft: 5, minWidth: 80}}
            >
              {buttonText}
            </Button>
          </ModalFooter>

          {this.props.error &&
            <ModalError>
              An error occured. Give it another try.
            </ModalError>
          }

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
