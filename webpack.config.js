var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
var WebpackStripLoader = require('strip-loader');
// var ImageminPlugin = require('imagemin-webpack-plugin').default;

var publicPath = '/'; //服务器路径
var path = __dirname + '/';

var plugins = [];
var devtool = 'cheap-module-eval-source-map';
var entryObj = {
    app: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/App'
    ]
};

var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';

if (process.argv.indexOf('-p') > -1) { //生产环境
    plugins.push(new webpack.DefinePlugin({ //编译成生产版本
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
    publicPath = '/build/dist/';
    path = __dirname + '/build/dist/';
    devtool = false;
    entryObj = {
        app: [
            './src/App'
        ]
    }
} else {
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoErrorsPlugin());
}
plugins.push(new ExtractTextPlugin('[name].css?[hash:8]')); //css单独打包

plugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
    filename: 'index.html', //生成的html存放路径，相对于 path
    template: 'src/Template/index.html', //html模板路径
    // hash: true,//为静态资源生成hash值
    chunks: ['app']
}));

plugins.push(new webpack.optimize.UglifyJsPlugin({
    output: {
        comments: false, // remove all comments
    },
    compress: {
        warnings: false
    }
}));

// plugins.push(new ImageminPlugin({
//       disable: false,
//       optipng: {
//         optimizationLevel: 3
//       },
//       gifsicle: {
//         optimizationLevel: 1
//       },
//       jpegtran: {
//         progressive: false
//       },
//       svgo: {
//       },
//       pngquant: null, // pngquant is not run unless you pass options here
//       plugins: []
//     }));

module.exports = {
    // devtool: '#source-map',
    devtool: devtool,
    entry: entryObj,
    output: {
        publicPath, //编译好的文件，在服务器的路径
        path, //编译到当前目录
        filename: '[name].js?[hash:8]' //编译后的文件名字
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /^node_modules$/,
                loader: 'babel?presets=es2015'
            }, {
                test: /\.css$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
            }, {
                test: /\.less/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader')
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
            },
            // {
            //     test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            //     exclude: /^node_modules$/,
            //     loader: 'file-loader?name=[name].[ext]'
            // },
            {
                test: /\.(png|jpg)$/,
                exclude: /^node_modules$/,
                loader: 'url?limit=8192&name=[name].[ext]' //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            }, {
                test: /\.jsx$/,
                exclude: /^node_modules$/,
                loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=react']
            }, {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: "html" //?attrs=img:src img:data-src
            },
            //{test:/\.jsx$/, loaders: ["react-hot-loader", "babel-loader?stage=0"]}
        ]
    },
    plugins,
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.less', '.scss'], //后缀名自动补全
        alias: {
            define: 'define'
        }
    },
    node: {
        Buffer: false
    },
    externals: [
        require('webpack-require-http')
    ]
};
