import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import { fetchEvent } from '../agents/event-agents'

import Sidebar from '../components/Sidebar'
import PageLoader from '../components/PageLoader'
import EventInfo from '../components/EventInfo'
import Stage from '../components/Stage'
import Standings from '../components/Standings'

import { Row } from 'reactstrap'

class Event extends React.Component {
  constructor(props) {
    super(props)

    this.eventId = this.props.match.params.id
    this.reloadEvent = this.reloadEvent.bind(this)
  }

  reloadEvent(event) {
    event.preventDefault()
    this.props.fetchEvent(this.eventId)
  }

  componentDidMount() {
    this.props.fetchEvent(this.eventId)
  }

  render() {
    if (this.props.isLoading) {
      return <PageLoader />
    }

    else if(this.props.error) {
      return (
        <div>
          Error fetching event data. <a href="#" onClick={this.reloadEvent}>Click here</a> to try again.
        </div>
      )
    }

    else {
      return (
        <Row>
          <Sidebar
            eventId={this.eventId}
            eventName={this.props.name}
          />
          <div className="col" id="main">
            <Route
              exact
              path={`/event/${this.eventId}`}
              component={EventInfo}
            />
            <Route
              exact
              path={`/event/${this.eventId}/:stageOrder`}
              component={Stage}
            />
            <Route
              exact
              path={`/event/${this.eventId}/standings`}
              component={Standings}
            />
          </div>
        </Row>
      )
    }

  }
}

const mapStateToProps = state => state.event

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchEvent
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Event)
