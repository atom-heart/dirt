import { BASE_URL } from '../config'

import { sending, error } from '../actions/turn-actions'
import { updateSplit } from '../actions/event-actions'
import { hideModal } from '../actions/modal-actions'

export const sendTurn = data => {
  return dispatch => {
    dispatch(sending())

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
          dispatch(updateSplit(response))
          dispatch(hideModal())
        },
        () => {
          dispatch(error())
        }
      )
  }
}
