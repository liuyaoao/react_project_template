import React, {Component} from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';
import PropTypes from 'prop-types';

// import index from '../Component/index'; //销售录入

class App_Root extends Component {
  constructor(props) {
        super(props);
        this.state = {
            locale: 'en',
            translations: null
        };
    }
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
App_Root.defaultProps = {
};
App_Root.propTypes = {
    children: PropTypes.object
};
//App_Root component end.

function importComponentSuccess(callback) {
    return (comp) => callback(null, comp.default);
}
function createGetChildComponentsFunction(arrayOfComponents) {
    return (locaiton, callback) => callback(null, arrayOfComponents);
}

const Index = (location, callback) => {
                  System.import('../containers/index_page.jsx').then(importComponentSuccess(callback));
              }
// const index = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/index').default)
//     },'index')
// }

// const chooseProducts = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/chooseProducts').default)
//     },'chooseProducts')
// }
//
// const helpCenter = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/helpCenter').default)
//     },'helpCenter')
// }
//
// const saleRecord = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/saleRecord').default)
//     },'saleRecord')
// }
//
// const allDeposit = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/allDeposit').default)
//     },'allDeposit')
// }
//
// const applyRecord = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/applyRecord').default)
//     },'applyRecord')
// }
//
// const applyDeposit = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../Component/applyDeposit').default)
//     },'applyDeposit')
// }

const RouteConfig = {
    path: '/',
    component: App_Root,
    indexRoute: { getComponents: Index },
    getChildRoutes: createGetChildComponentsFunction(
      [
        {
            path: 'index',
            getComponents: (location, callback) => {
                System.import('../containers/index_page.jsx').then(importComponentSuccess(callback));
            }
          }
      ])
  }

export default RouteConfig;
