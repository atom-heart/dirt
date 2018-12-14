import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { strToTime } from '../helpers.js'

import { mountTurn } from '../actions/turn-actions'
import { sendTurn } from '../agents/turn-agents'
import { showModal } from '../actions/modal-actions'

import { TURN_MODAL } from '../modal-types'

class TurnActive extends React.Component {
  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)
  }

  openModal() {
    let turnData = {
      turnId: this.props.player.turn_id,
      player: this.props.player.name,
      track: this.props.split.track
    }

    if (this.props.player.time) {
      turnData.time = strToTime(this.props.player.time)
    } else if (this.props.player.disqualified) {
      turnData.disqualified = true
    }

    this.props.mountTurn(turnData)
    this.props.showModal(TURN_MODAL)
  }

  render() {
    return (
      <tr
        className="interactive-row"
        onClick={this.openModal}
      >
        {this.props.children}
      </tr>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mountTurn,
    sendTurn,
    showModal
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(TurnActive)
