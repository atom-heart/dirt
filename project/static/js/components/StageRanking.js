import React from 'react';

import { Card } from 'reactstrap';

import TableHeader from './TableHeader';

const StageRanking = props => {
  let players = props.finished ? props.stage.ranking.finished : props.stage;

  const tableBody = players.map(player => (
    <tr key={player.id}>
      <td>{props.finished ? player.position : player.order}</td>
      <td>{player.name}</td>
      <td>{props.finished ? player.points : null}</td>
      <td>{props.finished ? player.time : null}</td>
      <td>{props.finished ? player.time_diff : null}</td>
    </tr>
  ));

  return (
    <Card>
      <TableHeader>
        <h4>{props.country}</h4>
      </TableHeader>
      <table className="table">
        <thead>
          <tr>
            <th className="pos" scope="col">Pos.</th>
            <th scope="col">Name</th>
            <th scope="col">Pts.</th>
            <th scope="col">Time</th>
            <th scope="col">Diff.</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
    </Card>
  );
}

export default StageRanking;
