const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, 'js');

/**
 * For backend builds, we want to prevent webpack from bundling dependencies
 * from node_modules into our output file (since we have access to node_modules
 * at runtime), so this inserts runtime 'require()' calls using modules.
 * 
 * See https://jlongster.com/Backend-Apps-with-Webpack--Part-I
 */
const nodeModules = {};
fs
  .readdirSync(path.resolve(__dirname, '..', 'node_modules'))
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/server.ts',
  mode: 'development',
  output: {
    path: OUTPUT_PATH,
    filename: 'server.js',
  },
  target: 'node',

  node: {
    __dirname: true,
    __filename: true,
  },
  externals: nodeModules,
  resolve: {
    /**
       * See https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            // options: {
            //   silent: true,
            // },
          },
        ],
      },
    ],
  },
  plugins: [],
};
