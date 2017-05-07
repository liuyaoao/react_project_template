import { combineReducers } from 'redux'
import indexReducer from './index_reducer'
import { routerReducer } from 'react-router-redux'


const rootReducers = combineReducers({
  indexReducer,
  routing: routerReducer

})

export default rootReducers
