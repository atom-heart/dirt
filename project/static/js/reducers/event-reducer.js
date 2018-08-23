import {
  MOUNT_INITIAL_DATA,
  IS_LOADING
} from '../actions/event-actions.js';

const initalState = {
  isLoading: true,
  error: false,
  stages: [],
}

export const eventReducer = (state = initalState, action) => {
  switch (action.type) {
    case IS_LOADING:
      return Object.assign({}, state, {isLoading: true})
    case MOUNT_INITIAL_DATA:
      return Object.assign({}, state, action.payload, {isLoading: false});
    default:
      return state;
  };
}
