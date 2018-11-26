import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { dispatchUpdateTurn } from '../actions/forms-actions.js'

import AddTimeModal from './AddTimeModal'

class SplitRanking extends React.Component {
  constructor(props) {
    super(props)

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal(player, update) {
    if (!this.props.split.active) {
      return
    }

    this.props.updateTurn({
      showModal: true,
      player: {
        id: player.id,
        name: player.name
      },
      split: {
        id: this.props.split.id,
        track: this.props.split.track
      }
    })
  }

  closeModal() {
    this.props.updateTurn({
      showModal: false
    })
  }

  render() {
    let modal = this.props.showModal ? (
      <AddTimeModal
        close={this.closeModal}
        player={this.props.player}
      />
    ) : null

    let ranking = []

    this.props.split.ranking.finished.forEach(player => {
      ranking.push(
        <tr key={player.id} onClick={() => this.openModal(player, true)}>
          <td>{player.position}</td>
          <td>{player.name}</td>
          <td>{player.time}</td>
          <td>{player.time_diff}</td>
        </tr>
      )
    })

    this.props.split.ranking.disqualified.forEach(player => {
      ranking.push(
        <tr key={player.id} onClick={() => this.openModal(player, true)}>
          <td>{player.position}</td>
          <td>{player.name}</td>
          <td colSpan="2">disqualified</td>
        </tr>
      )
    })

    this.props.split.ranking.stage_disqualified.forEach(player => {
      ranking.push(
        <tr key={player.id}>
          <td>{player.position}</td>
          <td>{player.name}</td>
          <td colSpan="2">previously disqualified</td>
        </tr>
      )
    })

    this.props.split.ranking.not_finished.forEach(player => {
      ranking.push(
        <tr key={player.id} onClick={() => this.openModal(player, false)}>
          <td></td>
          <td>{player.name}</td>
          <td colSpan="2"></td>
        </tr>
      )
    })

    return (
      <div>
        <table className="table interactive-table">
          <thead>
            <tr>
              <th className="pos" scope="col">Pos.</th>
              <th scope="col">Name</th>
              <th scope="col">Time</th>
              <th scope="col">Diff.</th>
            </tr>
          </thead>
          <tbody>
            {ranking}
          </tbody>
        </table>

        {modal}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  showModal: state.forms.addTimeForm.showModal
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    updateTurn: dispatchUpdateTurn
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SplitRanking)
