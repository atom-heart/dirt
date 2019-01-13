import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { setPlayer, removePlayerEvent } from '../actions/new-event-actions'
import { createPlayer } from '../agents/new-event-agents'

import { showModal } from '../actions/modal-actions'
import { ADD_PLAYER_MODAL } from '../modal-types'

import { Card, Input, Button } from 'reactstrap'

import TableHeader from './TableHeader'
import ProgressButton from './ProgressButton'

class EventPlayers extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addPlayer: false,
      newPlayerName: ''
    }

    this.toggleAddPlayer = this.toggleAddPlayer.bind(this)
    this.openModal = this.openModal.bind(this)
    this.getModalOpener = this.getModalOpener.bind(this)
    this.getPlayerRemover = this.getPlayerRemover.bind(this)
    this.updateNewPlayerName = this.updateNewPlayerName.bind(this)
    this.createPlayer = this.createPlayer.bind(this)
  }

  updateNewPlayerName(event) {
    this.setState({ newPlayerName: event.target.value })
  }

  toggleAddPlayer() {
    this.setState({ addPlayer: !this.state.addPlayer })
  }

  createPlayer() {
    if (this.state.newPlayerName !== '') {
      this.props.createPlayer(this.state.newPlayerName)
    }
    this.setState({ newPlayerName: '' })
  }

  openModal() {
    this.props.showModal(ADD_PLAYER_MODAL)
  }

  getModalOpener(playerId) {
    function openModal() {
      this.props.setPlayer(playerId)
      this.props.showModal(ADD_PLAYER_MODAL)
      this.setState({ addPlayer: false })
    }
    return openModal.bind(this)
  }

  getPlayerRemover(playerId) {
    function removePlayer() {
      this.props.removePlayer(playerId)
    }
    return removePlayer.bind(this)
  }

  render() {
    let players

    if (this.state.addPlayer) {
      players = this.props.allPlayers.filter(player => {
        return !this.props.eventPlayers.map(p => p.playerId).includes(player.id)
      }).map(player => (
        <tr key={player.id} className="interactive-row" onClick={this.getModalOpener(player.id)}>
          <td>{player.name}</td>
        </tr>
      ))

      players.push(
        <tr>
          <td className="d-flex">
            <Input
              value={this.state.newPlayerName}
              onChange={this.updateNewPlayerName}
            />
            <Button
              style={{marginLeft: 10}}
              color="primary"
              onClick={this.createPlayer}
            >
              Create player
            </Button>
          </td>
        </tr>
      )
    } else {
      players = this.props.eventPlayers.map(({ playerId, carId }, index) => {
        const player = this.props.allPlayers.find(p => p.id === playerId)
        const car = this.props.eventClasses.reduce((cars, id) => {
          return cars.concat(this.props.allClasses.find(c => c.id === id).cars)
        }, []).find(car => car.id === carId)

        return (
          <tr key={player.id}>
            <td>{index + 1}</td>
            <td>{player.name}</td>
            <td>{car.name}</td>
            <td
              onClick={this.getPlayerRemover(player.id)}
              style={{cursor: 'pointer', textAlign: 'center'}}
            >
              &times;
            </td>
          </tr>
        )
      })
    }

    return (
      <Card>
        <TableHeader><h4>{this.state.addPlayer ? 'Add player' : 'Players'}</h4></TableHeader>

        <table className="table">
          <tbody>
            {players}
          </tbody>
        </table>

        <ProgressButton onClick={this.toggleAddPlayer}>
          {this.state.addPlayer ? 'Cancel' : 'Add player'}
        </ProgressButton>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  allPlayers: state.newEvent.players,
  eventPlayers: state.newEvent.event.players,
  allClasses: state.newEvent.game.carClasses,
  eventClasses: state.newEvent.event.classes
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    showModal,
    setPlayer,
    removePlayer: removePlayerEvent,
    createPlayer
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPlayers)
