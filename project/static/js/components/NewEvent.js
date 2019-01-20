import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import { fetchGame, fetchPlayers } from '../agents/new-event-agents.js'

import NewEventStages from './NewEventStages'
import AddSplits from './AddSplits'
import CarClasses from './CarClasses'
import EventPlayers from './EventPlayers'
import Sidebar2 from './Sidebar2'
import PageLoader from './PageLoader'
import NewEventInfo from './NewEventInfo'

import { Row } from 'reactstrap'


class NewEvent extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchGame(1)
    this.props.fetchPlayers()
  }

  render() {
    if (this.props.event.redirect !== null) {
      const url = `/event/${this.props.event.redirect}`
      return <Redirect to={url} />
    }

    if (this.props.game.meta.id === null) {
      return <PageLoader />
    }

    return (
      <Row>
        <Sidebar2
          countries={this.props.game.countries}
          stages={this.props.event.stages}
          eventId="new"
          eventName={this.props.event.name || 'New event'}
        />
        <div className="col" id="main">
          <Route
            exact
            path={'/new'}
            component={NewEventInfo}
          />
          <Route
            exact
            path={'/new/classes'}
            component={CarClasses}
          />
          <Route
            exact
            path={'/new/players'}
            component={EventPlayers}
          />
          <Route
            exact
            path={'/new/stages'}
            component={NewEventStages}
          />
          <Route
            exact
            path={'/new/stage/:stageOrder'}
            component={AddSplits}
          />
        </div>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  players: state.newEvent.players,
  game: state.newEvent.game,
  event: state.newEvent.event
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchGame,
    fetchPlayers
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEvent)
