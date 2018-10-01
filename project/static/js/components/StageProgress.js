import React from 'react';

const StageProgress = props => {
  let ranking = [];

  props.ranking.forEach(player => {
    ranking.push(
      <tr key={player.id}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td>{player.position_diff}</td>
        <td>{player.points}</td>
        <td>{player.time}</td>
        <td>{player.time_diff}</td>
      </tr>
    )
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="pos" scope="col">Pos.</th>
          <th scope="col" colSpan="2">Name</th>
          <th scope="col">Pts.</th>
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

export default StageProgress;
