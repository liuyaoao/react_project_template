import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';


import {Provider} from 'react-redux';
import { Router, browserHistory, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import configureStore from './configureStore';

import routes from './routers/routes'; //路由配置
// import store from './Redux/Store/Store';

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


  const store = configureStore();

//如果是生成环境就用hash路由。
let historyWay = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;
// let history = browserHistory;

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(historyWay, store);

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
