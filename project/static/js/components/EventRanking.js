import React from 'react'

const EventRanking = props => {
  let ranking = props.ranking.map(player => (
    <tr key={player.id}>
      <td>{player.position}</td>
      <td>{player.name}</td>
      <td>{player.points}</td>
      <td>{player.car}</td>
    </tr>
  ))

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="pos" scope="col">Pos.</th>
          <th scope="col">Name</th>
          <th scope="col">Pts.</th>
          <th scope="col">Car</th>
        </tr>
      </thead>
      <tbody>
        {ranking}
      </tbody>
    </table>
  )
}

export default EventRanking
