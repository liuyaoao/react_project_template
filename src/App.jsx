import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import {Provider} from 'react-redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import routes from './Router/Route'; //路由配置
// import store from './Redux/Store/Store';
import rootReducers from './reducers/index' // Or wherever you keep your reducers
import './Config/Config.js';//引入默认配置

import './Style/common.scss';
import './Style/head.scss';
import './Style/index.scss';
import './Style/chooseProducts.scss';
import './Style/helpCenter.less';
import './Style/saleRecord.less';
import './Style/allDeposit.less';
import './Style/applyDeposit.less';
import './Style/applyRecord.less';


// store.subscribe(() => { //监听state变化
//     //console.log(store.getState())
// });

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
function configureStore(initialState) {
  const sto = createStore(
    rootReducers,
    initialState,
    applyMiddleware(thunk, logger)
  )
  return sto;
}
  const store = configureStore();
// const store = createStore(
//   combineReducers({
//     rootReducers,
//     routing: routerReducer
//   }),
//   applyMiddleware(thunk, logger)
// )
//如果是生成环境就用hash路由。
let historyWay = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;
// let history = browserHistory;

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(historyWay, store)
// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

render(
    <Provider store={store}>
    <Router
      history={history}
      routes={routes}
      />
    </Provider>,
    document.body.appendChild(document.createElement('div'))
);
