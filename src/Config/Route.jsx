import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute,Redirect, browserHistory, hashHistory } from 'react-router';

// import Login from '../views/Login'; //登录
// import Register from '../views/Register'; //注册
// import RegisterPro from '../views/RegisterPro'; //注册协议
// import Yue from '../views/yue'; //预约
// import Center from '../views/Center'; //个人中心
// import RegisterPassword from '../views/RegisterPassword'; //设置密码
// import ShoppingCart from '../views/ShoppingCart'; //购物车
// import OrderClosed from '../views/OrderClosed'; //订单结算
// import SetBill from '../views/SetBill'; //设置发票信息
import {Tool, merged} from '../Tool';
// import Address from '../views/Address'; //收货地址
// import AddressAdd from '../views/Address_add'; //新增收货地址
// import MyOrder from '../views/MyOrder'; //全部订单
// import OrderDetail from '../views/OrderDetail'; //订单详情
// import Appointment from '../views/Appointment'; //预约单
// import ExpressInfo from '../views/ExpressInfo'; //物流详情

/**
 * (路由根目录组件，显示当前符合条件的组件)
 * 
 * @class Roots
 * @extends {Component}
 */
class Roots extends Component {

    render() {
        console.log(this.props);
        return (
            <div className="route-div" id="route_div">{this.props.children}</div>
        );
    }
}

var history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;

// const RouteConfig = (
//     <Router history={history}>
//         <Route path="/" component={Roots}>
//             <IndexRoute component={Login} />
//             <Route path="register" component={require('react-router!../views/Register')} />
//             <Route path="registerpd" component={RegisterPassword} />
//             <Route path="registerpro" component={RegisterPro} />
//             <Route path="yue*" component={Yue} />
//             <Route path="center" component={Center} />
//             <Route path="shoppingcart" component={ShoppingCart} />
//             <Route path="orderclosed*" component={OrderClosed} />
//             <Route path="setbill" component={SetBill} />
//             <Route path="address" component={Address} />
//             <Route path="address-add" component={AddressAdd} />
//             <Route path="myorder" component={MyOrder} />
//             <Route path="orderdetail*" component={OrderDetail} />
//             <Route path="appointment" component={Appointment} />
//             <Route path="expressinfo*" component={ExpressInfo} />
//         </Route>
//     </Router>
// );


// let random = Math.random();
const rootRoute = {
  component: Roots,
  path: '/',
  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {cb(null, require('../views/Login').default)}, 'login')
    },
  },   
  childRoutes: [ 
    {
      path: 'register',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/Register').default)}, 'register')
      }
    },
    {
      path: 'registerpd',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/RegisterPassword').default)}, 'registerpd')
      }
    },
    {
      path: 'registerpro',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/RegisterPro').default)}, 'registerpro')
      }
    },
    {
      path: 'yue*',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/yue').default)}, 'yue')
      }
    },                
    {
      path: 'center',
      getComponent(location, cb) {
        require.ensure([], function (require) {cb(null, require('../views/Center').default)},"center")          
      }
    },
    {
      path: 'shoppingcart',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/ShoppingCart').default)}, 'shoppingcart')
      }
    },
    {
      path: 'orderclosed*',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/OrderClosed').default)}, 'orderclosed')
      }
    },
    {
      path: 'setbill',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/SetBill').default)}, 'setbill')
      }
    },
    {
      path: 'address',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/Address').default)}, 'address')
      }
    },
    {
      path: 'address-add',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/Address_add').default)}, 'address-add')
      }
    },
    {
      path: 'myorder',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/MyOrder').default)}, 'myorder')
      }
    },
    {
      path: 'orderdetail*',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/OrderDetail').default)}, 'orderdetail')
      }
    },
    {
      path: 'appointment',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/Appointment').default)}, 'appointment')
      }
    },
    {
      path: 'expressinfo*',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/ExpressInfo').default)}, 'expressinfo')
      }
    },
    {
      path: 'aboutus*',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('../views/AboutUs').default)}, 'aboutus')
      }
    }            
  ]
};

const RouteConfig = (
  <Router history={history} routes={rootRoute} />
);

// Tool.rem();
export default RouteConfig;