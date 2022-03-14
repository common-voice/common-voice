const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');

const OUTPUT_PATH = path.resolve(__dirname, 'dist');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: ['@babel/preset-env'],
  },
};
module.exports = () => {
  const plugins = [
    /** See https://webpack.js.org/plugins/extract-text-webpack-plugin/ */
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),

    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'index_template.html',
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.(png|svg|jpg|gif)$/.test(entry)) return 'image';
        return 'script';
      },
    }),

    function () {
      this.hooks.watchRun.tap('Building', () =>
        console.log(chalk.yellow('Rebuilding…'))
      );
      this.hooks.done.tap('Built', () => console.log(chalk.green('Built!')));
    },

    new webpack.DefinePlugin({
      'process.env.GIT_COMMIT_SHA': JSON.stringify(process.env.GIT_COMMIT_SHA),
    }),

    new BundleStatsWebpackPlugin({
      compare: false,
      outDir: '../artifacts',
      stats: {
        excludeAssets: [/artifacts/],
      },
    }),

    new StatsWriterPlugin({
      filename: '../artifacts/webpack-stats.json',
      stats: {
        all: true,
        source: false,
      },
    }),
  ];

  if (process.env.AUDIT) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: './src/main.ts',
    output: {
      path: OUTPUT_PATH,
      filename: 'bundle.js',
      publicPath: '/dist/',
      chunkFilename: '[name].js?id=[chunkhash]',
    },
    stats: 'errors-only',
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
            babelLoader,
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.js$/,
          include: /@fluent[\\/](bundle|sequence|react)[\\/]/,
          use: [babelLoader],
          type: 'javascript/auto',
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
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            esModule: false, // TODO: Switch to ES modules syntax.
          },
        },
      ],
    },
    plugins,
  };
};
