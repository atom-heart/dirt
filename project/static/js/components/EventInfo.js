import React from 'react';
import { connect } from 'react-redux';

import { Card, CardBody } from 'reactstrap';

class EventInfo extends React.Component {
  render() {
    let players = this.props.players.map((player) => (
      <li key={player.id}>{player.name}</li>
    ));
    let carClasses = this.props.carClasses.map((carClass) => (
      <li key={carClass.id}>{carClass.name}</li>
    ));
    return (
      <Card>
        <CardBody>
          <p><strong>Game:</strong> {this.props.game.name}</p>
          <strong>Players:</strong>
          <ul>{players}</ul>
          <strong>Car classes:</strong>
          <ul>{carClasses}</ul>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  game: state.event.game,
  players: state.event.players,
  carClasses: state.event.carClasses
});

export default connect(mapStateToProps)(EventInfo);
