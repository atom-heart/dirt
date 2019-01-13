import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Card } from 'reactstrap'

import { addSplitEvent, removeSplitEvent, setTrack } from '../actions/new-event-actions'
import { showModal } from '../actions/modal-actions'

import { WEATHER_MODAL } from '../modal-types'

import TableHeader from './TableHeader'
import ProgressButton from './ProgressButton'

class AddSplits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addSplit: false
    }

    this.getSplitAdder = this.getSplitAdder.bind(this)
    this.toggleAddSplit = this.toggleAddSplit.bind(this)
    this.getSplitRemover = this.getSplitRemover.bind(this)
  }

  toggleAddSplit() {
    this.setState({ addSplit: !this.state.addSplit })
  }

  getSplitAdder(trackId) {
    function addSplit() {
      this.props.setTrack(trackId, this.country.id, this.stage, this.index)
      this.props.showModal(WEATHER_MODAL)
      // this.props.addSplit(this.index, trackId, this.stage)
      this.toggleAddSplit()
    }
    return addSplit.bind(this)
  }

  getSplitRemover(splitIdx) {
    function removeSplit() {
      this.props.removeSplit(splitIdx)
    }
    return removeSplit.bind(this)
  }

  render() {
    this.index = this.props.match.params.stageOrder - 1
    this.stage = this.props.stages[this.index]

    if (this.stage === undefined) { return <div></div>}

    this.country = this.props.countries.find(c => c.id === this.stage)

    const weather = this.country.weather.map(weather => (
      <tr key={weather.id}>
        <td>{weather.conditions}</td>
      </tr>
    ))

    const splits = !this.state.addSplit ? (
      this.props.splits.filter(s => s.stageIdx === this.index).map((s, index) => {
        const track = this.country.tracks.find(c => c.id === s.trackId)
        const weather = this.country.weather.find(w => w.id === s.weatherId)
        return (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{track.name}</td>
            <td>{weather.conditions}</td>
            <td
              onClick={this.getSplitRemover(index)}
              style={{cursor: 'pointer', textAlign: 'center'}}
            >
              &times;
            </td>
          </tr>
        )
      })
    ) : (
      this.country.tracks.map((track, index) => (
        <tr
          key={track.id}
          className="interactive-row"
          onClick={this.getSplitAdder(track.id)}
        >
          <td>{index+1}</td>
          <td>{track.name}</td>
          <td>{track.type}</td>
          <td>{track.length}</td>
        </tr>
      ))
    )

    return (
      <div>
        <Card>
          <TableHeader>
            <h4>
              {this.country.name}
            </h4>
          </TableHeader>
        </Card>

        <hr />

        <Card>
          <TableHeader>
            <h4>
              {this.state.addSplits ? 'Add split' : 'Splits'}
            </h4>
          </TableHeader>

          <table className="table">
            <tbody>
              {splits}
            </tbody>
          </table>

          <ProgressButton onClick={this.toggleAddSplit}>
            {this.state.addSplit ? 'Cancel' : 'Add split'}
          </ProgressButton>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stages: state.newEvent.event.stages,
  countries: state.newEvent.game.countries,
  splits: state.newEvent.event.splits
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    addSplit: addSplitEvent,
    removeSplit: removeSplitEvent,
    setTrack,
    showModal
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSplits)
