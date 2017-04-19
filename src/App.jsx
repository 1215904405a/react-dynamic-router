import React, { Component, PropTypes } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux';
import route from './Config/Route'; //路由配置
import store from './Config/Store';

import './Style/common'; //加载公共样式
import './Style/tip';
import './Style/index';

store.subscribe(function() {
  // console.log(store.getState());
});
let App = document.createElement('div')
App.className = "appwrap"
render(
  <Provider store={store}>
        {route}
    </Provider>,
  document.body.appendChild(App)
);

process.env.NODE_ENV !== 'production' && module.hot.accept();
