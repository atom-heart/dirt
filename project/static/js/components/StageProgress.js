import React from 'react'

import DiffIcon from './DiffIcon'

const StageProgress = props => {
  let ranking = props.ranking.map(player => (
    <tr key={player.id}>
      <td>{player.position}</td>
      <td><DiffIcon diff={player.position_diff} /></td>
      <td>{player.name}</td>
      <td>{player.points}</td>
    </tr>
  ))

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="pos" scope="col">Pos.</th>
          <th scope="col">Diff.</th>
          <th scope="col">Name</th>
          <th scope="col">Pts.</th>
        </tr>
      </thead>
      <tbody>
        {ranking}
      </tbody>
    </table>
  )
}

export default StageProgress
