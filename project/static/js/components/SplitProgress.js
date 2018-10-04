import React from 'react';

const SplitProgress = props => {
  let ranking = [];

  props.ranking.finished.forEach(player => {
    ranking.push(
      <tr key={player.id}>
        <td>{player.position}</td>
        <td>{player.position_diff}</td>
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
        <td>{player.position_diff}</td>
        <td>{player.name}</td>
        <td colSpan="2">disqualified</td>
      </tr>
    );
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="pos" scope="col">Pos.</th>
          <th scope="col">Diff.</th>
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

export default SplitProgress;
