export const SHOW_MODAL = 'modal:show'
export const HIDE_MODAL = 'modal:hide'

export const loadModal = modalType => ({
  type: SHOW_MODAL,
  modalType
})

export const hideModal = () => ({
  type: HIDE_MODAL
})
