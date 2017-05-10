var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html


var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, 'public/dist'); //发布文件所存放的目录

module.exports = {
    devtool: 'inline-source-map',
    entry:{
      app: APP_FILE
    },
    // entry: ['babel-polyfill', './src/App.jsx'],
    output: {
        publicPath: '/public/dist/', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js',
    },
    module: {
        loaders: [

        {
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel-loader',
            include: [APP_PATH]
        },
        {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader']
              }),
            include: [APP_PATH]
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader', 'less-loader']
              }),
            include: [APP_PATH]
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader', 'sass-loader']
              }),
            include: [APP_PATH]
        },
        {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(png|jpg)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx-loader', 'babel-loader'],
            include: [APP_PATH]
        },
        {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /^node_modules$/,
            include: [APP_PATH],
            query: {
                presets: [
                    'react',
                    ['es2015', {modules: false}],
                    'stage-0'
                ],
                plugins: [
                  ['transform-runtime'],
                  ["import", [
                    { "style": "css", "libraryName": "antd-mobile"},
                    { "style": "css", "libraryName": "antd"}
                  ]]
                ],
                cacheDirectory: false
            }
        }
      ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // NODE_ENV: JSON.stringify('production') //定义生产环境
                NODE_ENV: JSON.stringify('development') //定义编译环境
            }
        }),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于 path
            template: './src/template/index.html', //html模板路径
            inject: 'body',
            hash: false,
        }),
        new ExtractTextPlugin('[name].css')
        // new webpack.LoaderOptionsPlugin({
        //   minimize: false,
        //   debug: true
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //   name:"common",
        //   filename:"common.bundle.js",
        //   minChunks: 2,
        //   children: true
        // }),

        // new webpack.optimize.UglifyJsPlugin({
        //     output: {
        //         comments: false, // remove all comments
        //     },
        //     compress: {
        //         warnings: true
        //     }
        // })
    ],
    resolve: {
        extensions: ['.web.js', '.js', '.jsx', '.json', '.less', '.scss', '.css'], //后缀名自动补全
    }
};
