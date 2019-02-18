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
      return  { ...state, ...action.data, ...compStates.hasLoaded }

    case IS_LOADING:
      return { ...state, ...compStates.isLoading }

    case THROW_ERROR:
      return { ...state, ...state, ...compStates.error }

    case UPDATE_EVENT:
      return { ...state, ...action.data }

    default:
      return state
  }
}
