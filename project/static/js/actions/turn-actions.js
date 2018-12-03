export const SENDING = 'turn:sending'
export const ERROR = 'turn:error'
export const MOUNT_TURN = 'turn:mountTurn'
export const UPDATE_TIME = 'turn:updateTime'
export const TOGGLE_DISQ = 'turn:toggleDisq'

export const sending = () => ({
  type: SENDING
})

export const error = () => ({
  type: ERROR
})

export const mountTurn = (data) => ({
  type: MOUNT_TURN,
  data
})

export const updateTime = (time) => ({
  type: UPDATE_TIME,
  time
})

export const toggleDisq = () => ({
  type: TOGGLE_DISQ
})
