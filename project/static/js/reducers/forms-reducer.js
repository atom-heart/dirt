import {
  IS_LOADING_MODAL,
  UPDATE_TURN,
  TURN_UPDATED
} from '../actions/forms-actions.js'

const formsBlueprint = {
  addTimeForm: {
    showModal: false,
    isLoading: false,
    error: false,
    player: {
      id: null,
      name: null
    },
    split: {
      id: null,
      track: null,
    },
    mins: 0,
    secs: 0,
    mills: 0,
    disq: false
  }
}

export const formsReducer = (state = formsBlueprint, action) => {
  let addTimeForm

  switch (action.type) {

  case TURN_UPDATED:
    addTimeForm = Object.assign({}, state.addTimeForm, { isLoading: false, showModal: false })
    return Object.assign({}, state, {addTimeForm})

  case IS_LOADING_MODAL:
    addTimeForm = Object.assign({}, state.addTimeForm, {isLoading: true})
    return Object.assign({}, state, {addTimeForm})

  case UPDATE_TURN:
    addTimeForm = Object.assign({}, state.addTimeForm, action.data)
    return Object.assign({}, state, {addTimeForm})

  default:
    return state

  }
}
