import React from 'react'

const StageProgress = props => {
  let players = props.players.map(player => (
    <tr key={player.id}>
      <td>{player.order}</td>
      <td>{player.name}</td>
      <td>{player.car_name}</td>
    </tr>
  ))

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="pos" scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Car</th>
        </tr>
      </thead>
      <tbody>
        {players}
      </tbody>
    </table>
  )
}

export default StageProgress
