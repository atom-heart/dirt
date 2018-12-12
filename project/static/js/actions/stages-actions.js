export const UPDATE_STAGE = 'stages:update'
export const LOAD_STAGES = 'stages:load'
export const THROW_ERROR = 'stages:error'
export const IS_LOADING = 'stages:loading'

export const updateStage = stage => ({
  type: UPDATE_STAGE,
  stage
})

export const loadStages = stages => ({
  type: LOAD_STAGES,
  stages
})

export const throwError = stageId => ({
  type: THROW_ERROR,
  stageId
})

export const isLoading = stageId => ({
  type: IS_LOADING,
  stageId
})
