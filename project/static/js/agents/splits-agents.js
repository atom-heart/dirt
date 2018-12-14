import { BASE_URL } from '../config'

import { updateSplits, isLoading, throwError } from '../actions/splits-actions'
import { updateStage } from '../actions/stages-actions'
import { updateEvent } from '../actions/event-actions'

export const finishSplit = splitId => {
  return dispatch => {
    dispatch(isLoading(splitId))

    fetch(`${BASE_URL}api/splits/${splitId}/finish`, { method: 'PUT' })
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
          dispatch(throwError(splitId))
        }
      )
  }
}
