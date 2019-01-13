import { combineReducers } from 'redux'
import { compStates, setCompState } from '../component-states'

import {
  LOAD_SPLITS,
  UPDATE_SPLIT,
  UPDATE_SPLITS,
  IS_LOADING,
  THROW_ERROR
} from '../actions/splits-actions'

function loadSplits(state, action) {
  const splits = Object.assign({}, ...action.splits.map(split => (
    { [split.id]: Object.assign(split, compStates.idle) }
  )))
  return Object.assign({}, state, splits)
}

function updateSplit(state, action) {
  const split = Object.assign(state[action.split.id], action.split)
  return Object.assign({}, state, { [action.split.id]: split })
}

function updateSplits(state, action) {
  const splits = Object.assign({}, ...action.splits.map(split => (
    { [split.id]: Object.assign({}, state[split.id], split, compStates.idle) }
  )))
  return Object.assign({}, state, splits)
}

const splitsById = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SPLIT:
      return updateSplit(state, action)

    case UPDATE_SPLITS:
      return updateSplits(state, action)

    case LOAD_SPLITS:
      return loadSplits(state, action)

    case IS_LOADING:
      return setCompState(state, action.splitId, compStates.isLoading)

    case THROW_ERROR:
      return setCompState(state, action.splitId, compStates.error)

    default:
      return state
  }
}

const allSplits = (state = [], action) => {
  switch (action.type) {
    case LOAD_SPLITS:
      return state.concat(action.splits.map(split => split.id))

    default:
      return state
  }
}

export const splitsReducer = combineReducers({
  byId: splitsById,
  allIds: allSplits
})
