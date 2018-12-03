import React from 'react'

import TurnInactive from './TurnInactive'
import TurnActive from './TurnActive'

const SplitRanking = (props) => {
  let ranking = []

  const Turn = props.split.active ? TurnActive : TurnInactive

  props.split.ranking.finished.forEach(player => {
    ranking.push(
      <Turn key={player.id} split={props.split} player={player}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td>{player.time}</td>
        <td>{player.time_diff}</td>
      </Turn>
    )
  })

  props.split.ranking.disqualified.forEach(player => {
    ranking.push(
      <Turn key={player.id} split={props.split} player={player}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td colSpan="2">disqualified</td>
      </Turn>
    )
  })

  props.split.ranking.stage_disqualified.forEach(player => {
    ranking.push(
      <TurnInactive key={player.id}>
        <td>{player.position}</td>
        <td>{player.name}</td>
        <td colSpan="2">previously disqualified</td>
      </TurnInactive>
    )
  })

  props.split.ranking.not_finished.forEach(player => {
    ranking.push(
      <Turn key={player.id} split={props.split} player={player}>
        <td></td>
        <td>{player.name}</td>
        <td colSpan="2"></td>
      </Turn>
    )
  })

  return (
    <table className="table">
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
  )
}

export default SplitRanking
