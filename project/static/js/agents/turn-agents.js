import { BASE_URL } from '../config'

import { isLoading, throwError } from '../actions/turn-actions'
import { updateSplit } from '../actions/splits-actions'
import { hideModal } from '../actions/modal-actions'

export const sendTurn = ({ turnId, time, disqualified }) => {
  return dispatch => {
    dispatch(isLoading())

    fetch(`${BASE_URL}api/turns/${turnId}`, {
      method: 'PUT',
      body: JSON.stringify({ time, disqualified }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(updateSplit(response))
          dispatch(hideModal())
        },
        () => {
          dispatch(throwError())
        }
      )
  }
}
