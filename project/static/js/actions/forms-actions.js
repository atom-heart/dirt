import { BASE_URL } from '../config';

import { fetchSplit, dispatchCascadeUpdate, dispatchTurnUpdate } from './event-actions.js';

export const IS_LOADING_MODAL = 'forms:isLoadingModal'
export const UPDATE_TURN = 'forms:updateTurn';
export const TURN_UPDATED = 'forms:turnUpdated';

export const isLoadingModal = () => ({
  type: IS_LOADING_MODAL
});

export const turnUpdated = () => ({
  type: TURN_UPDATED
})

export const updateTurn = data => ({
  type: UPDATE_TURN,
  data
})

export const dispatchUpdateTurn = data => {
  return dispatch => dispatch(updateTurn(data));
}

export const sendTurn = data => {
  return dispatch => {
    dispatch(isLoadingModal());

    fetch(`${BASE_URL}api/time`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(turnUpdated());
          dispatch(dispatchTurnUpdate(response));
          // dispatch(fetchSplit(data.split_id));
        },
        (error) => {
          console.error('Error: ', JSON.stringify(error))
        }
      );
  }
}
