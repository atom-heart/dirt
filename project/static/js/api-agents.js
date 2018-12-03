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
        (error) => {
          dispatch(error())
        }
      )
  }
}
