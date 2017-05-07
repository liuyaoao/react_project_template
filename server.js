var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
// var webpackMiddleware = require("webpack-dev-middleware");
var config = require('./webpack.config.dev');

var compiler = webpack(config);
//代理服务器
var proxy = [{
	path: '/*/*', //必须得有一个文件地址，如果顶层文件夹名字不同，则用/*代替
	target: 'http://dev.fe.ptdev.cn',
	host: 'dev.fe.ptdev.cn',
	secure: false
}];
var server = new WebpackDevServer(compiler, {
	publicPath: config.output.publicPath,
	noInfo: false, // display no info to console (only warnings and errors)
	// quiet:false, // display nothing to the console
	inline: true,

	// switch into lazy mode
	// that means no watching, but recompilation on every request
	// lazy: true,
	stats: {
		colors: true,
	}
});

//将其他路由，全部返回index.html
server.app.get('*', function(req, res) {
	res.sendFile(__dirname + '/index.html')
});
server.listen(8088, function() {
	console.log('正常打开8088端口')
});
