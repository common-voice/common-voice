import * as webpack from 'webpack';
import * as path from 'path';

import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

const config: webpack.Configuration = {
  entry: './src/main.ts',
  output: {
    path: OUTPUT_PATH,
    filename: 'bundle.js'
  },
  resolve: {
      extensions: ['.ts', '.tsx']
  },
  module: {
      rules: [
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ['ts-loader']
        }
      ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'css/index.css',
      to: OUTPUT_PATH }
    ]),

    /** See https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6 */
    new webpack.optimize.UglifyJsPlugin()
  ]
};

export default config;