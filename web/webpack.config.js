const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    function () {
      this.hooks.watchRun.tap('Building', () => {
        console.log(chalk.yellow('Webpack: Rebuilding…'));
      });
      this.hooks.done.tap('Built', () => {
        console.log(chalk.green('Webpack: Built!'));
      });
    },

    new CleanWebpackPlugin(),

    new CopyPlugin({
      patterns: [
        // copy release files into dist
        { from: 'releases', to: 'releases' },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
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

    new webpack.DefinePlugin({
      'process.env.GIT_COMMIT_SHA': JSON.stringify(process.env.GIT_COMMIT_SHA),
    }),
  ];

  if (process.env.AUDIT) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: './src/main.ts',
    output: {
      path: OUTPUT_PATH,
      filename: '[name].[contenthash].js',
      publicPath: '/dist/',
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

      /*
        some test files require node and webpack
        complains so we'll disable these dependancies
      */
      fallback: {
        path: false,
        fs: false,
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
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                esModule: false, // TODO: Switch to ES modules syntax.
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|ttf)$/,
          loader: 'file-loader',
          options: {
            esModule: false, // TODO: Switch to ES modules syntax.
            name() {
              if (process.env.NODE_ENV === 'development') {
                return '[path][name].[ext]';
              }

              return '[name].[contenthash].[ext]';
            },
          },
        },
      ],
    },
    plugins,
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};
