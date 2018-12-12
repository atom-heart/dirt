import {
  IS_LOADING,
  THROW_ERROR,
  MOUNT_TURN,
  UPDATE_TIME,
  TOGGLE_DISQ
} from '../actions/turn-actions'

const initialState = {
  isLoading: false,
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
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  },
  disqualified: false
}

function updateTime(state, action) {
  const time = Object.assign({}, state.time, {
    [action.interval]: action.value
  })

  return Object.assign({}, state, { time })
}

export const turnReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return Object.assign({}, state, { isLoading: true, error: false })

    case THROW_ERROR:
      return Object.assign({}, state, { isLoading: false, error: true })

    case MOUNT_TURN:
      return Object.assign({}, initialState, action.data)

    case TOGGLE_DISQ:
      return Object.assign({}, state, {disqualified: !state.disqualified})

    case UPDATE_TIME:
      return updateTime(state, action)

    default:
      return state
  }
}
