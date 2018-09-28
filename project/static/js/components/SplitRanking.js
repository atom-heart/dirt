import React from 'react';

import { Card } from 'reactstrap';

import TableHeader from './TableHeader';

class SplitRanking extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showProgress: false }
    this.toggleProgress = this.toggleProgress.bind(this);
  }

  toggleProgress() {
    this.setState({ showProgress: !this.state.showProgress });
  }

  render() {
    let ranking = []
    let progress = []

    let progressButton = text => {
      return (
        <div className="card-footer border-top">
          <button
            className="btn btn-link progress-toggle"
            onClick={this.toggleProgress}
          >
            {text}
          </button>
        </div>
      )
    }

    this.props.split.ranking.finished.forEach(player => {
      ranking.push(
        <tr key={player.id}>
          <td>{player.position}</td>
          <td>{player.name}</td>
          <td>{player.time}</td>
          <td>{player.time_diff}</td>
        </tr>
      );
    });

    this.props.split.ranking.disqualified.forEach(player => {
      ranking.push(
        <tr key={player.id}>
          <td>{player.position}</td>
          <td>{player.name}</td>
          <td> </td>
          <td>disqualified</td>
        </tr>
      );
    });

    this.props.split.ranking.not_finished.forEach(player => {
      ranking.push(
        <tr key={player.id}>
          <td>{player.position}</td>
          <td>{player.name}</td>
          <td colSpan="2"></td>
        </tr>
      );
    });

    ranking.pop();

    ranking = (
      <div>
        <table className="table interactive-table">
          <thead>
            <tr>
              <th className="pos" scope="col">Pos.</th>
              <th scope="col">Name</th>
              <th scope="col">Time</th>
              <th scope="col">Diff.</th>
            </tr>
          </thead>
          <tbody>
            {ranking}
          </tbody>
        </table>
        {this.props.split.finished ? progressButton('Show progress →') : null}
      </div>
    );

    if (this.props.split.finished) {
      this.props.split.progress.finished.forEach(player => {
        progress.push(
          <tr key={player.id}>
            <td>{player.position}</td>
            <td>{player.name}</td>
            <td>{player.position_diff}</td>
            <td>{player.time}</td>
            <td>{player.time_diff}</td>
          </tr>
        );
      });

      this.props.split.progress.disqualified.forEach(player => {
        progress.push(
          <tr key={player.id}>
            <td>{player.position}</td>
            <td>{player.name}</td>
            <td>{player.position_diff}</td>
            <td> </td>
            <td>disqualified</td>
          </tr>
        );
      });

      progress = (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th className="pos" scope="col">Pos.</th>
                <th scope="col" colSpan="2">Name</th>
                <th scope="col">Time</th>
                <th scope="col">Diff.</th>
              </tr>
            </thead>
            <tbody>
              {progress}
            </tbody>
          </table>
          {progressButton('← Back to ranking')}
        </div>
      );
    }

    return (
      <Card>
        <TableHeader>
          <h4>{this.props.split.order}. {this.props.split.track}</h4>
          <span className="text-muted weather">{this.props.split.weather}</span>
        </TableHeader>
        {this.state.showProgress ? progress : ranking}
      </Card>
    );
  }
}

export default SplitRanking;
