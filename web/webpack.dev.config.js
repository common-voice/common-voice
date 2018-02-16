const eslintFormatter = require('react-dev-utils/eslintFormatter');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');

module.exports = merge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('eslint-loader'),
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              cache: true,
            },
          },
        ],
      },
    ],
  },
});
