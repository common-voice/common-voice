import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';

const OUTPUT_PATH = path.resolve(__dirname, 'js');

const nodeModules: {[mod: string]: string} = {};
fs.readdirSync(path.resolve(__dirname, '..', 'node_modules'))
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


const config: webpack.Configuration = {
  entry: './src/server.ts',
  output: {
    path: OUTPUT_PATH,
    filename: 'server.js'
  },
  target: 'node',

  node: {
    __dirname: true,
    __filename: true
  },
  externals: nodeModules,
  resolve: {
      /**
       * See https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
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
  ]
};

export default config;