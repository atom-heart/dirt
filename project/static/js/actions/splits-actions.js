export const UPDATE_SPLIT = 'splits:updateSingle'
export const UPDATE_SPLITS = 'splits:updateMultiple'
export const LOAD_SPLITS = 'splits:load'
export const THROW_ERROR = 'splits:error'
export const IS_LOADING = 'splits:loading'

export const updateSplit = split => ({
  type: UPDATE_SPLIT,
  split
})

export const updateSplits = splits => ({
  type: UPDATE_SPLITS,
  splits
})

export const loadSplits = splits => ({
  type: LOAD_SPLITS,
  splits
})

export const throwError = splitId => ({
  type: THROW_ERROR,
  splitId
})

export const isLoading = splitId => ({
  type: IS_LOADING,
  splitId
})
