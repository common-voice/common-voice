const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');

module.exports = merge(commonConfig, {
  plugins: [
    /** See https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6 */
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
