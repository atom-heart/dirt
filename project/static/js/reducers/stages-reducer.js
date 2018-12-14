import { combineReducers } from 'redux'
import { compStates, setCompState } from '../component-states.js'

import {
  LOAD_STAGES,
  UPDATE_STAGE,
  THROW_ERROR,
  IS_LOADING
} from '../actions/stages-actions'

function loadStages(state, action) {
  const stages = Object.assign({}, ...action.stages.map(stage => (
    { [stage.id]: Object.assign(stage, compStates.idle) }
  )))
  return Object.assign({}, state, stages)
}

function updateStage(state, action) {
  const stage = Object.assign(
    state[action.stage.id],
    action.stage,
    compStates.hasLoaded
  )
  return Object.assign({}, state, { [action.stage.id]: stage })
}

const stagesById = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_STAGE:
      return updateStage(state, action)

    case LOAD_STAGES:
      return loadStages(state, action)

    case THROW_ERROR:
      return setCompState(state, action.stageId, compStates.error)

    case IS_LOADING:
      return setCompState(state, action.stageId, compStates.isLoading)

    default:
      return state
  }
}

const allStages = (state = [], action) => {
  switch (action.type) {
    case LOAD_STAGES:
      return state.concat(action.stages.map(stage => stage.id))

    default:
      return state
  }
}

export const stagesReducer = combineReducers({
  byId: stagesById,
  allIds: allStages
})
