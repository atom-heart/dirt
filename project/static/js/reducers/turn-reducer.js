import {
  SENDING,
  ERROR,
  MOUNT_TURN,
  UPDATE_TIME,
  TOGGLE_DISQ
} from '../actions/turn-actions'

const initialState = {
  sending: false,
  error: false,
  player: {
    id: null,
    name: null
  },
  split: {
    id: null,
    track: null
  },
  time: {
    minutes: null,
    seconds: null,
    milliseconds: null
  },
  disqualified: false
}

export const turnReducer = (state = initialState, action) => {
  switch (action.type) {

    case SENDING:
      return Object.assign({}, state, {sending: true, error: false})

    case ERROR:
      return Object.assign({}, state, {sending: false, error: true})

    case MOUNT_TURN:
      return Object.assign({}, initialState, action.data)

    case UPDATE_TIME:
      return Object.assign({}, state, {time: action.time})

    case TOGGLE_DISQ:
      return Object.assign({}, state, {disqualified: !state.disqualified})

    default:
      return state

  }
}
