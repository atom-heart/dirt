import { combineReducers } from 'redux'
import { compStates } from '../component-states'

import {
  UPDATE_SPLIT,
  UPDATE_SPLITS,
  LOAD_SPLITS,
  IS_LOADING,
  THROW_ERROR
} from '../actions/splits-actions'

const updateSplit = (state, action) => {
  const split = Object.assign(
    state[action.split.id],
    action.split
  )
  return Object.assign({}, state, {
    [action.split.id]: split
  })
}

function updateSplits(state, action) {
  const splits = {}

  action.splits.allIds.forEach(id => {
    splits[id] = Object.assign({},
      state[id],
      action.splits.byId[id],
      compStates.idle
    )
  })

  return Object.assign({}, state, splits)
}

function loadSplits(state, action) {
  const splits = action.splits.byId

  action.splits.allIds.forEach(id => {
    splits[id] = Object.assign(splits[id], compStates.idle)
  })

  return Object.assign({}, state, splits)
}

function setSplitState(state, action, compState) {
  const split = Object.assign(
    state[action.splitId],
    compState
  )
  return Object.assign({}, state, {
    [action.splitId]: split
  })
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
      return setSplitState(state, action, compStates.isLoading)

    case THROW_ERROR:
      return setSplitState(state, action, compStates.error)

    default:
      return state
  }
}

const allSplits = (state = [], action) => {
  switch (action.type) {
    case LOAD_SPLITS:
      return state.concat(action.splits.allIds)

    default:
      return state
  }
}

export const splitsReducer = combineReducers({
  byId: splitsById,
  allIds: allSplits
})
