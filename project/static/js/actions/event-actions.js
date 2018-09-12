import { BASE_URL } from '../config';

export const MOUNT_EVENT_DATA = 'event:mountEventData';
export const IS_LOADING_EVENT = 'event:isLoadingEvent';
export const IS_LOADING_STAGE = 'event:isLOadingStage';
export const MOUNT_STAGE_DATA = 'event:mountStageData';

export const isLoadingEvent = () => ({
  type: IS_LOADING_EVENT
});

export const mountEventData = payload => ({
  type: MOUNT_EVENT_DATA,
  payload
});

export const fetchEventData = id => {
  return dispatch => {
    dispatch(isLoadingEvent());

    fetch(`${BASE_URL}api/event/info/${id}`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(mountEventData(result));
        },
        (error) => {
          console.log('Error fetching event data!');
        }
      )
  }
}

export const isLoadingStage = id => ({
  type: IS_LOADING_STAGE,
  id
})

export const mountStageData = (id, payload) => ({
  type: MOUNT_STAGE_DATA,
  stageId: id,
  payload
})

export const fetchStage = id => {
  return dispatch => {
    dispatch(isLoadingStage(id));

    fetch(`${BASE_URL}api/stage/${id}`)
      .then(res => res.json())
      .then(
        (result) => {
          dispatch(mountStageData(id, result));
        },
        (error) => {
          console.log('Error fetching event data!');
        }
      )
  }
}
