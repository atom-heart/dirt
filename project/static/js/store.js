import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

import { eventReducer } from './reducers/event-reducer'
import { stagesReducer } from './reducers/stages-reducer'
import { splitsReducer } from './reducers/splits-reducer'
import { modalReducer } from './reducers/modal-reducer'
import { turnReducer } from './reducers/turn-reducer'

const store = createStore(combineReducers({
  event: eventReducer,
  stages: stagesReducer,
  splits: splitsReducer,
  modal: modalReducer,
  turn: turnReducer
}), compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension()
))

export default store
