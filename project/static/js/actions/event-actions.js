import { BASE_URL } from '../config'

export const MOUNT_EVENT_DATA = 'event:mountEventData'
export const IS_LOADING_EVENT = 'event:isLoadingEvent'
export const IS_LOADING_STAGE = 'event:isLoadingStage'
export const MOUNT_STAGE_DATA = 'event:mountStageData'
export const THROW_EVENT_ERROR = 'event:throwEventError'
export const THROW_STAGE_ERROR = 'event:throwStageError'
export const UPDATE_SPLIT = 'event:updateSplit'
export const TURN_UPDATE = 'event:turnUpdate'
export const FINISH_SPLIT_REQUEST = 'event:finishSplitRequest'
export const FINISH_SPLIT_ERROR = 'event:finishSplitError'
export const UPDATE_SPLITS = 'event:updateSplits'
export const UPDATE_STAGE = 'event:updateStage'
export const UPDATE_EVENT = 'event:updateEvent'

export const isLoadingEvent = () => ({
  type: IS_LOADING_EVENT
})

export const mountEventData = payload => ({
  type: MOUNT_EVENT_DATA,
  payload
})

export const throwEventError = error => ({
  type: THROW_EVENT_ERROR,
  error
})

export const fetchEventData = id => {
  return dispatch => {
    fetch(`${BASE_URL}api/event/info/${id}`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(mountEventData(result))
        },
        (error) => {
          dispatch(throwEventError(error))
        }
      )
  }
}

export const reloadEvent = () => {
  return dispatch => {
    dispatch(isLoadingEvent())
  }
}

export const isLoadingStage = stageId => ({
  type: IS_LOADING_STAGE,
  stageId
})

export const throwStageError = (stageId, error) => ({
  type: THROW_STAGE_ERROR,
  stageId,
  error
})

export const mountStageData = (stageId, payload) => ({
  type: MOUNT_STAGE_DATA,
  stageId,
  payload
})

export const fetchStage = id => {
  return dispatch => {
    fetch(`${BASE_URL}api/stage/test/${id}`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(mountStageData(id, response))
        },
        (error) => {
          dispatch(throwStageError(id, error))
        }
      )
  }
}

export const reloadStage = id => {
  return dispatch => {
    dispatch(isLoadingStage(id))
  }
}

export const updateSplit = split => ({
  type: UPDATE_SPLIT,
  split
})

export const fetchSplit = splitId => {
  return dispatch => {
    fetch(`${BASE_URL}api/split/${splitId}`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(updateSplit(splitId, response))
        },
        (error) => {
          console.log('fetchSplitRanking error')
        }
      )
  }
}

export const turnUpdate = payload => ({
  type: TURN_UPDATE,
  payload
})

export const dispatchTurnUpdate = payload => {
  return dispatch => { return dispatch(turnUpdate(payload)) }
}

export const finishSplitRequest = splitId => ({
  type: FINISH_SPLIT_REQUEST,
  splitId
})

export const finishSplitError = splitId => ({
  type: FINISH_SPLIT_ERROR,
  splitId
})

export const updateSplits = splits => ({
  type: UPDATE_SPLITS,
  splits
})

export const updateStage = stage => ({
  type: UPDATE_STAGE,
  stage
})

export const updateEvent = payload => ({
  type: UPDATE_EVENT,
  payload
})

export const dispatchFinishSplit = splitId => {
  return dispatch => {
    dispatch(finishSplitRequest(splitId))

    fetch(`${BASE_URL}api/finish_split`, {
      method: 'PUT',
      body: JSON.stringify({ split_id: splitId }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(
        response => {
          dispatch(updateSplits(response.splits))

          if (response.hasOwnProperty('stage')) {
            dispatch(updateStage(response.stage))
          }

          if (response.hasOwnProperty('event')) {
            dispatch(updateEvent(response.event))
          }
        },
        () => {
          dispatch(finishSplitError(splitId))
        }
      )
  }
}
