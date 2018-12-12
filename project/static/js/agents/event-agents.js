import { BASE_URL } from '../config'

import { loadEvent, isLoading, throwError } from '../actions/event-actions'
import { loadStages } from '../actions/stages-actions'

export const fetchEvent = id => {
  return dispatch => {
    dispatch(isLoading())

    fetch(`${BASE_URL}api/event/${id}`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(loadEvent(response.event))
          dispatch(loadStages(response.stages))
        },
        () => {
          dispatch(throwError())
        }
      )
  }
}
