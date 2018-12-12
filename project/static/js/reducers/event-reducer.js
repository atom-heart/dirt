import { compStates } from '../component-states.js'

import {
  UPDATE_EVENT,
  LOAD_EVENT,
  IS_LOADING,
  THROW_ERROR
} from '../actions/event-actions.js'

export const eventReducer = (state = compStates.isLoading, action) => {
  switch (action.type) {
    case LOAD_EVENT:
      return Object.assign({}, state, action.data, compStates.hasLoaded)

    case IS_LOADING:
      return Object.assign({}, state, compStates.isLoading)

    case THROW_ERROR:
      return Object.assign({}, state, compStates.error)

    case UPDATE_EVENT:
      return Object.assign({}, state, action.data)

    default:
      return state
  }
}
