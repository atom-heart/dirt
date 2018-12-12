import { combineReducers } from 'redux'
import { compStates } from '../component-states.js'

import {
  UPDATE_STAGE,
  LOAD_STAGES,
  THROW_ERROR,
  IS_LOADING
} from '../actions/stages-actions'

function updateStage(state, action) {
  const stage = Object.assign(
    state[action.stage.id],
    action.stage,
    compStates.hasLoaded
  )
  return Object.assign({}, state, {
    [action.stage.id]: stage
  })
}

function setStageState(state, action, compState) {
  const stage = Object.assign(
    state[action.stageId],
    compState
  )
  return Object.assign({}, state, {
    [action.stageId]: stage
  })
}

function loadStages(state, action) {
  const stages = action.stages.byId

  action.stages.allIds.forEach(id => {
    stages[id] = Object.assign(stages[id], compStates.idle)
  })

  return Object.assign({}, state, stages)
}

const stagesById = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_STAGE:
      return updateStage(state, action)

    case LOAD_STAGES:
      return loadStages(state, action)

    case THROW_ERROR:
      return setStageState(state, action, compStates.error)

    case IS_LOADING:
      return setStageState(state, action, compStates.isLoading)

    default:
      return state
  }
}

const allStages = (state = [], action) => {
  switch (action.type) {
    case LOAD_STAGES:
      return state.concat(action.stages.allIds)

    default:
      return state
  }
}

export const stagesReducer = combineReducers({
  byId: stagesById,
  allIds: allStages
})
