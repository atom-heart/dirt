import { BASE_URL } from '../config';

export const MOUNT_EVENT_DATA = 'event:mountEventData';
export const IS_LOADING_EVENT = 'event:isLoadingEvent';
export const IS_LOADING_STAGE = 'event:isLoadingStage';
export const MOUNT_STAGE_DATA = 'event:mountStageData';
export const THROW_EVENT_ERROR = 'event:throwEventError';
export const THROW_STAGE_ERROR = 'event:throwStageError';

export const isLoadingEvent = () => ({
  type: IS_LOADING_EVENT
});

export const mountEventData = payload => ({
  type: MOUNT_EVENT_DATA,
  payload
});

export const throwEventError = error => ({
  type: THROW_EVENT_ERROR,
  error
});

export const fetchEventData = id => {
  return dispatch => {
    fetch(`${BASE_URL}api/event/info/${id}`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(mountEventData(result));
        },
        (error) => {
          dispatch(throwEventError(error));
        }
      )
  }
}

export const reloadEvent = () => {
  return dispatch => {
    dispatch(isLoadingEvent());
  }
}

export const isLoadingStage = stageId => ({
  type: IS_LOADING_STAGE,
  stageId
});

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
        (result) => {
          dispatch(mountStageData(id, result));
        },
        (error) => {
          dispatch(throwStageError(id, error));
        }
      );
  }
}

export const reloadStage = id => {
  return dispatch => {
    dispatch(isLoadingStage(id));
  }
}
