import React from 'react';

const SplitRanking = props => {
  let ranking = [];

  props.ranking.finished.forEach(player => {
    ranking.push(
      <tr key={player.id}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td>{player.time}</td>
        <td>{player.time_diff}</td>
      </tr>
    );
  });

  props.ranking.disqualified.forEach(player => {
    ranking.push(
      <tr key={player.id}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td colSpan="2">disqualified</td>
      </tr>
    );
  });

  props.ranking.stage_disqualified.forEach(player => {
    ranking.push(
      <tr key={player.id}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td colSpan="2">previously disqualified</td>
      </tr>
    );
  });

  props.ranking.not_finished.forEach(player => {
    ranking.push(
      <tr key={player.id}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td colSpan="2"></td>
      </tr>
    );
  });

  // don't ask, temporary
  // ranking.pop();

  return (
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
  );
}

export default SplitRanking;
