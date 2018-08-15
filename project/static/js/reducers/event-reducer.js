import {
  MOUNT_INITIAL_DATA,
  IS_LOADING
} from '../actions/event-actions.js';

const initalState = {
  isLoading: false,
  error: false,
  id: 1,
  stages: [],
}

export const eventReducer = (state = initalState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return Object.assign({}, state, {isLoading: true})
    case MOUNT_INITIAL_DATA:
      return Object.assign({}, state, {stages: action.payload, isLoading: false});
    default:
      return state;
  };
}
