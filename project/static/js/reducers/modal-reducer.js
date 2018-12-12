import { SHOW_MODAL, HIDE_MODAL } from '../actions/modal-actions'

const initialState = {
  modalType: null
}

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return Object.assign({}, state, { modalType: action.modalType })

    case HIDE_MODAL:
      return initialState

    default:
      return state
  }
}
