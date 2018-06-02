const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: OUTPUT_PATH,
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  resolve: {
    /**
     * See https://webpack.js.org/configuration/resolve/#resolve-extensions
     *
     * ".js" included to make some Webpack plugins work.
     */
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: ['', '..'].map(p =>
          path.resolve(p, 'node_modules', 'fluent-react')
        ),
        loader: 'babel-loader',
        options: {
          plugins: ['transform-object-rest-spread'],
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              silent: true,
            },
          },
        ],
      },
      {
        /**
         * By default, Webpack (rather, style-loader) includes stylesheets
         * into the JS bundle.
         *
         * ExtractTextPlugin emits them into a separate plain file instead.
         */
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    /** See https://webpack.js.org/plugins/extract-text-webpack-plugin/ */
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'index_template.html',
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ],
};
