import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

import { RESET_STORE } from './actions/app-actions'

import { eventReducer } from './reducers/event-reducer'
import { stagesReducer } from './reducers/stages-reducer'
import { splitsReducer } from './reducers/splits-reducer'
import { modalReducer } from './reducers/modal-reducer'
import { turnReducer } from './reducers/turn-reducer'
import { newEventReducer } from './reducers/new-event-reducer'
import { allEventsReducer } from './reducers/all-events-reducer'

const appReducer = combineReducers({
  event: eventReducer,
  stages: stagesReducer,
  splits: splitsReducer,
  modal: modalReducer,
  turn: turnReducer,
  newEvent: newEventReducer,
  allEvents: allEventsReducer
})

export const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined
  }

  return appReducer(state, action)
}


const store = createStore(rootReducer, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

export default store
