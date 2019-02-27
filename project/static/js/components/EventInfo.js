import React from 'react'
import { connect } from 'react-redux'

import { Card, CardBody } from 'reactstrap'

import EventRanking from './EventRanking'
import Players from './Players'
import TableHeader from './TableHeader'
import Modal from './Modal'

class EventInfo extends React.Component {
  render() {
    return (
      <div>

        <Card>
          <TableHeader
            title={this.props.finished ? 'Event finished' : 'Event in progress'}
          />
          <table className="table">
            <tbody>
              <tr>
                <td>Started:</td>
                <td>{this.props.start}</td>
              </tr>
              <tr>
                <td>Game:</td>
                <td>DiRT Rally</td>
              </tr>
              <tr>
                <td>Car classes:</td>
                <td>{this.props.carClasses.map(c => c.name).join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </Card>

        <hr />

        {this.props.finished ? (
          <Card>
            <TableHeader title={'General ranking'} />
            <EventRanking ranking={this.props.ranking} />
          </Card>
        ) : (
          <Card>
            <TableHeader title={'Players'} />
            <Players players={this.props.players} />
          </Card>
        )}

      </div>
    )
  }
}

const mapStateToProps = state => ({
  game: state.event.game,
  players: state.event.players,
  carClasses: state.event.carClasses,
  ranking: state.event.ranking,
  finished: state.event.finished,
  start: state.event.start,
})

export default connect(mapStateToProps)(EventInfo)
