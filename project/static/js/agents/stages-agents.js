import { BASE_URL } from '../config'

import { updateStage, throwError, isLoading } from '../actions/stages-actions'
import { loadSplits } from '../actions/splits-actions'

export const fetchStage = id => {
  return dispatch => {
    dispatch(isLoading(id))

    fetch(`${BASE_URL}api/stage/${id}`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(updateStage(response.stage))
          dispatch(loadSplits(response.splits))
        },
        () => {
          dispatch(throwError(id))
        }
      )
  }
}
