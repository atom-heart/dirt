import { LOAD_ALL_EVENTS } from '../actions/all-events-actions.js'

export const allEventsReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_ALL_EVENTS:
      return action.events

    default:
      return state
  }
}
