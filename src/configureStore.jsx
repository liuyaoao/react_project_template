import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import rootReducers from './reducers/index' // Or wherever you keep your reducers

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export default function configureStore(initialState) {
  const store = createStore(
    rootReducers,
    initialState,
    applyMiddleware(thunkMiddleware, logger)
  )

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('./reducers/index', () => {
  //     const nextRootReducer = require('./reducers/index').default
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }

  return store;
}
