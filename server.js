var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var compiler = webpack(config);
// var express = require('express');
// var app = express();

//启动服务
var server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    proxy:{
        '**/v1/**': {
            // target: 'http://106.39.13.149',
            target: 'http://m.jyall.com',
            secure: false,
            changeOrigin: true,
            logLevel: 'debug'
        }
    }
});

server.app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: config.output.publicPath
}));
server.app.use(require("webpack-hot-middleware")(compiler));
//将其他路由，全部返回index.html
// server.app.get('*', function (req,res) {
//     res.sendFile('/index.html')
// });

server.listen(3000);