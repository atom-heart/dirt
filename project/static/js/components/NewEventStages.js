import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Card } from 'reactstrap'

import TableHeader from './TableHeader'
import ProgressButton from './ProgressButton'

import { addStageEvent, removeStageEvent } from '../actions/new-event-actions'

class NewEventStages extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addStage: false
    }

    this.getStageAdder = this.getStageAdder.bind(this)
    this.toggleAddStage = this.toggleAddStage.bind(this)

    this.getStageRemover = this.getStageRemover.bind(this)
  }

  toggleAddStage() {
    if (this.props.splits.length > 0) return
    this.setState({ addStage: !this.state.addStage })
  }

  getStageAdder(stageId) {
    function addStage() {
      if (this.props.splits.length > 0) return
      this.props.addStage(stageId)
      this.toggleAddStage()
    }
    return addStage.bind(this)
  }

  getStageRemover(stageIdx) {
    function removeStage() {
      if (this.props.splits.length > 0) return
      this.props.removeStage(stageIdx)
    }
    return removeStage.bind(this)
  }

  render() {
    let stages

    if (this.state.addStage) {
      stages = this.props.countries.map(country => (
        <tr
          key={country.id}
          className="interactive-row"
          onClick={this.getStageAdder(country.id)}
        >
          <td>{country.name}</td>
        </tr>
      ))
    } else {
      stages = this.props.stages.map((stageId, index) => {
        const country = this.props.countries.find(c => c.id === stageId)

        return (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{country.name}</td>
            <td
              onClick={this.getStageRemover(index)}
              style={{cursor: 'pointer', textAlign: 'center'}}
            >
              &times;
            </td>
          </tr>
        )
      })
    }

    // const stages = this.props.stages.map(stage => {
    //   const country = this.props.countries.find(id => id === stage)
    // })

    return (
      <Card>
        <TableHeader>
          <h4>{this.state.addStage ? 'Add stage' : 'Stages'}</h4>
        </TableHeader>

        <table className="table">
          <tbody>
            {stages}
          </tbody>
        </table>

        <ProgressButton onClick={this.toggleAddStage}>
          {this.state.addStage ? 'Cancel' : 'Add stage'}
        </ProgressButton>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  countries: state.newEvent.game.countries,
  stages: state.newEvent.event.stages,
  splits: state.newEvent.event.splits
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    addStage: addStageEvent,
    removeStage: removeStageEvent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEventStages)
