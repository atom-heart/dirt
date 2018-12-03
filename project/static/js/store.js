import { combineReducers, applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

import { eventReducer } from './reducers/event-reducer.js'
import { modalReducer } from './reducers/modal-reducer.js'
import { turnReducer } from './reducers/turn-reducer.js'

const store = createStore(combineReducers({
  event: eventReducer,
  modal: modalReducer,
  turn: turnReducer
}), compose(
  applyMiddleware(thunk),
  window.devToolsExtension && window.devToolsExtension()
))

export default store
