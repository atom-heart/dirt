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
  turnId: null,
  player: null,
  track: null,
  time: {
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  },
  disqualified: false
}

function updateTime(state, action) {
  const time = { ...state.time, [action.interval]: action.value }
  return { ...state, time }
}

export const turnReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOUNT_TURN:
      return { ...initialState, ...action.data }
      
    case IS_LOADING:
      return { ...state, isLoading: true, error: false }

    case THROW_ERROR:
      return { ...state, isLoading: false, error: true }

    case TOGGLE_DISQ:
      return { ...state, disqualified: !state.disqualified }

    case UPDATE_TIME:
      return updateTime(state, action)

    default:
      return state
  }
}
