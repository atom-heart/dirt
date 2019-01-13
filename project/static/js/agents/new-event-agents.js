import { BASE_URL } from '../config'

import {
  mountGame,
  mountCarClasses,
  mountCountries,
  mountPlayers,
  addPlayer,
  redirect
} from '../actions/new-event-actions.js'

export const fetchGame = id => {
  return dispatch => {
    // dispatch(isLoading())

    fetch(`${BASE_URL}api/games/${id}`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(mountGame(response.game))
          dispatch(mountCarClasses(response.car_classes))
          dispatch(mountCountries(response.countries))
        },
        () => {
          console.log('fetchGame error')
        }
      )
  }
}

export const fetchPlayers = () => {
  return dispatch => {
    // dispatch(isLoading())

    fetch(`${BASE_URL}api/players`)
      .then(res => res.json())
      .then(
        (response) => {
          dispatch(mountPlayers(response))
        },
        () => {
          console.log('fetchPlayers error')
        }
      )
  }
}

export const createPlayer = (name) => {
  return dispatch => {
    // dispatch(isLoading())

    let formData = new FormData()
    formData.append('name', name)

    fetch(`${BASE_URL}api/player`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(
        (newPlayer) => {
          dispatch(addPlayer(newPlayer))
        },
        () => {
          console.log('fetchPlayers error')
        }
      )
  }
}

export const createEvent = (event) => {
  return dispatch => {
    // dispatch(isLoading())

    fetch(`${BASE_URL}api/event`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
      .then(res => res.json())
      .then(
        (json) => {
          dispatch(redirect(json['event_id']))
        },
        () => {
          console.log('createEvent error')
        }
      )
  }
}
