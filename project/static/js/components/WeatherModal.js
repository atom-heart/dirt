import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { hideModal } from '../actions/modal-actions'
import { addSplitEvent } from '../actions/new-event-actions'

import Modal from './Modal'

import { Button, CustomInput } from 'reactstrap'

import ModalHeader from './styled/ModalHeader'
import ModalFooter from './styled/ModalFooter'
import ModalCloseButton from './styled/ModalCloseButton'

class WeatherModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      weatherId: null
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    this.props.addSplit(this.props.stageIdx, this.props.trackId, this.props.stageId, this.state.weatherId)
    this.props.hideModal()
  }

  render() {
    const country = this.props.countries.find(c => c.id === this.props.countryId)
    const track = country.tracks.find(t => t.id === this.props.trackId)
    const weather = country.weather.map(weather => {
      const fav = weather.favorable ? 'easy' : 'hard'
      const text = `${weather.conditions} (${fav})`
      return (
        <tr
          key={weather.id}
          className="interactive-row"
          onClick={() => this.setState({ weatherId: weather.id })}
        >
          <td>
            <CustomInput
              type="radio"
              id={weather.id}
              label={text}
              checked={weather.id === this.state.weatherId}
            />
          </td>
        </tr>
      )
    })

    return (
      <Modal onClose={this.props.hideModal}>
        <div className="modal-content" style={{minWidth: 350}}>
          <ModalHeader>
            <h5 className="modal-title">{track.name}</h5>
            <ModalCloseButton onClick={this.props.hideModal} />
          </ModalHeader>

          <table className="table">
            <tbody>
              {weather}
            </tbody>
          </table>

          <ModalFooter>
            <div />
            <Button
              onClick={this.onSubmit}
              type="submit"
              color="primary"
              style={{marginLeft: 5, minWidth: 80}}
              disabled={this.state.weatherId === null}
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
  countries: state.newEvent.game.countries,
  // splits: state.newEvent.splits,
  // splitId: state.newEvent.weather.splitIdx
  trackId: state.newEvent.splitModal.trackId,
  countryId: state.newEvent.splitModal.countryId,
  stageId: state.newEvent.splitModal.stageId,
  stageIdx: state.newEvent.splitModal.stageIdx
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    hideModal,
    addSplit: addSplitEvent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WeatherModal)
