import memoizeOne from 'memoize-one'

import getStages from './getStages'

const getStage = (state, stageOrder) => {
  const stages = getStages(state)

  const stageId = Object.keys(stages).find(id => (
    stages[id].order === parseInt(stageOrder, 10)
  ))

  return stages[stageId]
}

export default getStage
