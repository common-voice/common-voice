import * as webpack from 'webpack';
import * as path from 'path';

import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

const config: webpack.Configuration = {
  entry: './src/main.ts',
  output: {
    path: OUTPUT_PATH,
    filename: 'bundle.js'
  },
  resolve: {
      /**
       * See https://webpack.js.org/configuration/resolve/#resolve-extensions
       * 
       * ".js" included to make some Webpack plugins work.
       */
      extensions: ['.ts', '.tsx', '.js']
  },
  module: {
      rules: [
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ['ts-loader']
        }, {
          /**
           * By default, Webpack (rather, style-loader) includes stylesheets
           * into the JS bundle.
           * 
           * ExtractTextPlugin emits them into a separate plain file instead.
           */
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
              'postcss-loader'
            ]
          })
        }
      ]
  },
  plugins: [
    // new CopyWebpackPlugin([{
    //   from: 'css/index.css',
    //   to: OUTPUT_PATH }
    // ]),

    /** See https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6 */
    new webpack.optimize.UglifyJsPlugin(),

    /** See https://webpack.js.org/plugins/extract-text-webpack-plugin/ */
    new ExtractTextPlugin('index.css')
  ]
};

export default config;