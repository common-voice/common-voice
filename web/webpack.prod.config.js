const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');

module.exports = merge(commonConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    /** See https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6 */
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
