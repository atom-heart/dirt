export const IS_LOADING = 'turn:loading'
export const THROW_ERROR = 'turn:error'
export const MOUNT_TURN = 'turn:mountTurn'
export const UPDATE_TIME = 'turn:updateTime'
export const TOGGLE_DISQ = 'turn:toggleDisq'

export const isLoading = () => ({
  type: IS_LOADING
})

export const throwError = () => ({
  type: THROW_ERROR
})

export const mountTurn = (data) => ({
  type: MOUNT_TURN,
  data
})

export const updateTime = (interval, value) => ({
  type: UPDATE_TIME,
  interval,
  value
})

export const toggleDisq = () => ({
  type: TOGGLE_DISQ
})
