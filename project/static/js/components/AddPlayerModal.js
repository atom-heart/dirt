import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { hideModal } from '../actions/modal-actions'
import { addPlayerEvent } from '../actions/new-event-actions'

import Modal from './Modal'

import { Button, CustomInput } from 'reactstrap'

import ModalHeader from './styled/ModalHeader'
import ModalFooter from './styled/ModalFooter'
import ModalCloseButton from './styled/ModalCloseButton'

class AddPlayerModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      carId: null
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    this.props.addPlayer(this.props.playerId, this.state.carId)
    this.props.hideModal()
  }

  render() {
    const player = this.props.players.find(player => player.id === this.props.playerId)

    const cars = this.props.chosenClasses.reduce((cars, id) => {
      return cars.concat(this.props.carClasses.find(c => c.id === id).cars)
    }, [])

    const form = cars.map(car => (
      <tr
        key={car.id}
        className="interactive-row"
        onClick={() => this.setState({ carId: car.id })}
      >
        <td>
          <CustomInput
            type="radio"
            id={car.id}
            label={car.name}
            checked={car.id === this.state.carId}
          />
        </td>
      </tr>
    ))

    return (
      <Modal onClose={this.props.hideModal}>
        <div className="modal-content" style={{minWidth: 350}}>
          <ModalHeader>
            <h5 className="modal-title">{player.name}</h5>
            <ModalCloseButton onClick={this.props.hideModal} />
          </ModalHeader>

          <table className="table">
            <tbody>
              {form}
            </tbody>
          </table>

          <ModalFooter>
            <div />
            <Button
              onClick={this.onSubmit}
              type="submit"
              color="primary"
              style={{marginLeft: 5, minWidth: 80}}
              disabled={this.state.carId === null}
            >
              Add
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  players: state.newEvent.players,
  playerId: state.newEvent.addPlayer.playerId,
  carClasses: state.newEvent.game.carClasses,
  chosenClasses: state.newEvent.event.classes
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    hideModal,
    addPlayer: addPlayerEvent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPlayerModal)
