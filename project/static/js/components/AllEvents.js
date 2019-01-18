import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { fetchAllEvents } from '../agents/all-events-agents'

import PageLoader from './PageLoader'
import TableHeader from './TableHeader'

import { Card, Row } from 'reactstrap'

class Events extends React.Component {
  constructor(props) {
    super(props)

    this.state = { redirect: false, eventId: null }

    this.redirect = this.redirect.bind(this)
  }

  componentDidMount() {
    this.props.fetchAllEvents()
  }

  redirect(eventId) {
    this.setState({ redirect: true, eventId })
  }

  render() {
    if (this.state.redirect) {
      const path = `/event/${this.state.eventId}`
      return <Redirect to={path} />
    }

    else if (this.props.events.length === 0) {
      return <PageLoader />
    }

    const events = this.props.events.map(event => (
      <tr
        key={event.id}
        className="interactive-row"
        onClick={() => this.redirect(event.id)}
      >
        <td>{event.name}</td>
        <td>{event.started}</td>
      </tr>
    ))

    return (
      <Row>
        <div className="container" id="main">
          <Card>
            <TableHeader>
              <h4>Events</h4>
            </TableHeader>

            <table className="table">
              <tbody>
                {events}
              </tbody>
            </table>
          </Card>
        </div>
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  events: state.allEvents
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchAllEvents
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)
