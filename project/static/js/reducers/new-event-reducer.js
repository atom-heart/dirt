import { combineReducers } from 'redux'

import {
  MOUNT_GAME,
  MOUNT_CAR_CLASSES,
  MOUNT_COUNTRIES,
  MOUNT_PLAYERS,
  ADD_PLAYER,
  REMOVE_PLAYER,
  ADD_PLAYER_EVENT,
  REMOVE_PLAYER_EVENT,
  ADD_STAGE_EVENT,
  REMOVE_STAGE_EVENT,
  ADD_SPLIT_EVENT,
  REMOVE_SPLIT_EVENT,
  ADD_CLASS_EVENT,
  REMOVE_CLASS_EVENT,
  SET_PLAYER,
  UPDATE_EVENT_NAME,
  SET_TRACK,
  REDIRECT
} from '../actions/new-event-actions.js'

const gameMeta = (state = {
  id: null,
  name: null
}, action) => {
  switch (action.type) {
    case MOUNT_GAME:
      return action.game
    default:
      return state
  }
}

const carClasses = (state = [], action) => {
  switch (action.type) {
    case MOUNT_CAR_CLASSES:
      return action.carClasses
    default:
      return state
  }
}

const countries = (state = [], action) => {
  switch (action.type) {
    case MOUNT_COUNTRIES:
      return action.countries
    default:
      return state
  }
}

const gameReducer = combineReducers({
  meta: gameMeta,
  carClasses,
  countries
})

const playersReducer = (state = [], action) => {
  switch (action.type) {
    case MOUNT_PLAYERS:
      return action.players
    case ADD_PLAYER:
      return state.concat(action.player).map(x => x)
    case REMOVE_PLAYER:
      return Object.assign({}, state.filter(pl => pl.id !== action.id))
    default:
      return state
  }
}

// const getAddRemoveReducer = (ADD_ACTION, REMOVE_ACTION) => {
//   const reducer = (state = [], action) => {
//     switch (action.type) {
//       case ADD_ACTION:
//         return [...state, action.toAdd]
//       case REMOVE_ACTION:
//         return state.filter(id => id !== action.toRemove)
//       default:
//         return state
//     }
//   }
//
//   return reducer
// }

const eventName = (state = '', action) => {
  switch (action.type) {
    case UPDATE_EVENT_NAME:
      return action.name
    default:
      return state
  }
}

const redirect = (state = null, action) => {
  switch (action.type) {
    case REDIRECT:
      return action.eventId
    default:
      return state
  }
}

// const eventPlayers = getAddRemoveReducer(ADD_PLAYER_EVENT, REMOVE_PLAYER_EVENT)
// const eventStages = getAddRemoveReducer(ADD_STAGE_EVENT, REMOVE_STAGE_EVENT)
// const eventSplits = getAddRemoveReducer(ADD_SPLIT_EVENT, REMOVE_SPLIT_EVENT)
// const eventClasses = getAddRemoveReducer(ADD_CLASS_EVENT, REMOVE_CLASS_EVENT)

const eventClasses = (state = [], action) => {
  switch (action.type) {
    case ADD_CLASS_EVENT:
      return [...state, action.toAdd]
    case REMOVE_CLASS_EVENT:
      return state.filter(id => id !== action.toRemove)
    default:
      return state
  }
}

const eventPlayers = (state = [], action) => {
  switch (action.type) {
    case ADD_PLAYER_EVENT:
      return [...state, action.toAdd]
    case REMOVE_PLAYER_EVENT:
      return state.filter(player => player.playerId !== action.toRemove)
    default:
      return state
  }
}

const eventSplits = (state = [], action) => {
  switch (action.type) {
    case ADD_SPLIT_EVENT:
      return [...state, action.toAdd]
    case REMOVE_SPLIT_EVENT:
      return state.filter((s, idx) => idx !== action.splitIdx)
    case REMOVE_STAGE_EVENT:
      return state.filter(s => s.stageIdx !== action.stageIdx)
    default:
      return state
  }
}

const eventStages = (state = [], action) => {
  switch (action.type) {
    case ADD_STAGE_EVENT:
      return [...state, action.toAdd]
    case REMOVE_STAGE_EVENT:
      return state.filter((s, idx) => idx !== action.stageIdx)
    default:
      return state
  }
}

const addPlayerReducer = (state = null, action) => {
  switch (action.type) {
    case SET_PLAYER:
      return { playerId: action.playerId }
    default:
      return state
  }
}

const splitModal = (state = null, action) => {
  switch (action.type) {
    case SET_TRACK:
      return { trackId: action.trackId, countryId: action.countryId, stageId: action.stageId, stageIdx: action.stageIdx }
    default:
      return state
  }
}

const eventReducer = combineReducers({
  name: eventName,
  players: eventPlayers,
  stages: eventStages,
  splits: eventSplits,
  classes: eventClasses,
  redirect
})

export const newEventReducer = combineReducers({
  game: gameReducer,
  players: playersReducer,
  event: eventReducer,
  addPlayer: addPlayerReducer,
  splitModal
})
