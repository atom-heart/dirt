export const LOAD_EVENT = 'event:load'
export const UPDATE_EVENT = 'event:update'
export const IS_LOADING = 'event:loading'
export const THROW_ERROR = 'event:error'

export const loadEvent = data => ({
  type: LOAD_EVENT,
  data
})

export const updateEvent = data => ({
  type: UPDATE_EVENT,
  data
})

export const isLoading = () => ({
  type: IS_LOADING
})

export const throwError = () => ({
  type: THROW_ERROR
})
