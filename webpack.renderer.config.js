const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
	},
  module: {
    rules,
  },
	plugins: plugins
};
