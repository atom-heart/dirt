export const MOUNT_GAME = 'newEvent:mountGame'
export const MOUNT_CAR_CLASSES = 'newEvent:mountCarClasses'
export const MOUNT_COUNTRIES = 'newEvent:mountCountries'
export const MOUNT_PLAYERS = 'newEvent:mountPlayers'
export const ADD_PLAYER = 'newEvent:addPlayer'
export const REMOVE_PLAYER = 'newEvent:removePlayer'
export const ADD_PLAYER_EVENT = 'newEvent:addPlayerEvent'
export const REMOVE_PLAYER_EVENT = 'newEvent:removePlayerEvent'
export const ADD_STAGE_EVENT = 'newEvent:addStageEvent'
export const REMOVE_STAGE_EVENT = 'newEvent:removeStageEvent'
export const ADD_SPLIT_EVENT = 'newEvent:addSplitEvent'
export const REMOVE_SPLIT_EVENT = 'newEvent:removeSplitEvent'
export const ADD_CLASS_EVENT = 'newEvent:addClassEvent'
export const REMOVE_CLASS_EVENT = 'newEvent:removeClassEvent'
export const SET_PLAYER = 'newEvent:setPlayer'
export const UPDATE_EVENT_NAME = 'newEvent:updateName'
export const SET_TRACK = 'newEvent:setTrack'
export const REDIRECT = 'newEvent:redirect'

export const updateEventName = (name) => ({
  type: UPDATE_EVENT_NAME,
  name
})

export const mountGame = (game) => ({
  type: MOUNT_GAME,
  game
})

export const mountCarClasses = (carClasses) => ({
  type: MOUNT_CAR_CLASSES,
  carClasses
})

export const mountCountries = (countries) => ({
  type: MOUNT_COUNTRIES,
  countries
})

export const mountPlayers = (players) => ({
  type: MOUNT_PLAYERS,
  players
})

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
})


export const addClassEvent = (classId) => ({
  type: ADD_CLASS_EVENT,
  toAdd: classId
})

export const removeClassEvent = (classId) => ({
  type: REMOVE_CLASS_EVENT,
  toRemove: classId
})

export const setPlayer = (playerId) => ({
  type: SET_PLAYER,
  playerId
})

export const setTrack = (trackId, countryId, stageId, stageIdx) => ({
  type: SET_TRACK,
  trackId,
  countryId,
  stageId,
  stageIdx
})

export const addPlayerEvent = (playerId, carId) => ({
  type: ADD_PLAYER_EVENT,
  toAdd: { playerId, carId }
})

export const removePlayerEvent = (playerId) => ({
  type: REMOVE_PLAYER_EVENT,
  toRemove: playerId
})

export const addStageEvent = (stageId) => ({
  type: ADD_STAGE_EVENT,
  toAdd: stageId
})

export const removeStageEvent = (stageIdx) => ({
  type: REMOVE_STAGE_EVENT,
  stageIdx
})

export const addSplitEvent = (stageIdx, trackId, stageId, weatherId) => ({
  type: ADD_SPLIT_EVENT,
  toAdd: { stageIdx, trackId, stageId, weatherId }
})

export const removeSplitEvent = (splitIdx) => ({
  type: REMOVE_SPLIT_EVENT,
  splitIdx
})

export const redirect = (eventId) => ({
  type: REDIRECT,
  eventId
})
