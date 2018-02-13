const path = require('path');

module.exports = {
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname,'src'),
				],
				test: /\.js$/,
				//options to config babel-loader
				query: {
					presets: ['es2015'],
					plugins: ['transform-object-rest-spread']
				}
			}
		]
	},

	entry: {
		'cpanel': ["./src/control-panel.js"],
		"tasks": ["./src/tasks.js"],
		"message-board": ["./src/message-board.js"]
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		publicPath: "/assets/",
		filename: "[name].bundle.js",
	},
	devServer: {inline: true},
	devtool: 'source-map',
}