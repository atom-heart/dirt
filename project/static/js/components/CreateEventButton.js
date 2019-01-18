import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Button } from 'reactstrap'

import { createEvent } from '../agents/new-event-agents'

import NavSection from './NavSection'

class CreateEventButton extends React.Component {
  constructor(props) {
    super(props)
    this.allowCreate = this.allowCreate.bind(this)
    this.createEvent = this.createEvent.bind(this)
  }

  allowCreate() {
    const event = this.props.event

    const occurs = event.splits.reduce((occurs, split) => {
      if (!occurs.includes(split.stageIdx)) {
        occurs.push(split.stageIdx)
      }
      return occurs
    }, [])

    if (
      event.classes.length > 0 &&
      event.players.length > 0 &&
      event.stages.length > 0 &&
      event.stages.length === occurs.length
    ) {
      return true
    }

    return false
  }

  createEvent() {
    const event = this.props.event

    const stages = event.stages.map((stage, idx) => {
      const splits = event.splits.filter(s => s.stageIdx === idx)
      return { countryId: stage, splits }
    })

    let data = {
      gameId: this.props.gameId,
      name: event.name,
      classes: event.classes,
      players: event.players,
      stages
    }

    this.props.createEvent(data)
  }

  render() {
    this.allowed = this.allowCreate()

    return (
      <NavSection>
        <Button
          color="primary"
          disabled={!this.allowed}
          onClick={this.createEvent}
        >
          Create event
        </Button>
      </NavSection>
    )
  }
}

const mapStateToProps = state => ({
  event: state.newEvent.event,
  gameId: state.newEvent.game.meta.id
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    createEvent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventButton)
