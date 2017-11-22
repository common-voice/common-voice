const eslintFormatter = require('react-dev-utils/eslintFormatter');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');

module.exports = merge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
});
