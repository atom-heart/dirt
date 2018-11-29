import { SHOW_MODAL, HIDE_MODAL } from '../actions/modal-actions'

const initialState = {
  modalType: null
}

export const modalReducer = (state = initialState, action) => {
  const newState = Object.assign({}, state)

  switch (action.type) {

  case SHOW_MODAL:
    newState.modalType = action.modalType
    break

  case HIDE_MODAL:
    return initialState

  default:
    return state

  }

  return newState
}
