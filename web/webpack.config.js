const path = require('path');
const chalk = require('chalk');
const {
  CheckerPlugin,
  TsConfigPathsPlugin,
} = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: OUTPUT_PATH,
    filename: 'bundle.[chunkhash].js',
    publicPath: '/dist/',
  },
  devtool: 'source-map',
  resolve: {
    /**
     * See https://webpack.js.org/configuration/resolve/#resolve-extensions
     *
     * ".js" included to make some Webpack plugins work.
     */
    extensions: ['.ts', '.tsx', '.js'],

    alias: {
      img: path.join(__dirname, 'img/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              silent: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true, presets: ['@babel/preset-env'] },
        },
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
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: loader => [
                require('postcss-import')(),
                require('postcss-color-mod-function')(),
                require('postcss-nested')(),
                require('postcss-custom-media')(),
                require('postcss-preset-env')(),
                require('cssnano')(),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          esModule: false, // TODO: Switch to ES modules syntax.
        },
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
    new PreloadWebpackPlugin(),
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    function() {
      this.plugin('watchRun', () => console.log(chalk.yellow('Rebuilding...')));
      this.plugin('done', () => console.log(chalk.green('Built!')));
    },
    // new require('webpack-bundle-analyzer').BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ],
};
