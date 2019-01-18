import { BASE_URL } from '../config'

import { loadAllEvents } from '../actions/all-events-actions.js'

export const fetchAllEvents = () => {
  return dispatch => {
    // dispatch(isLoading(id))

    fetch(`${BASE_URL}api/events`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(loadAllEvents(response))
        },
        () => {
          // dispatch(throwError(id))
        }
      )
  }
}
