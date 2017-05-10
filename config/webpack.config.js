var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    vb: "./src/main.tsx",
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "[name].bundle.js"
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    // alias: { 'react': path.resolve(__dirname, 'node_modules', 'react') }
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]

    // preLoaders: [
    //     // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    //     { test: /\.js$/, loader: "source-map-loader" }
    // ]
  },
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    // "react": "React",
    // "react-dom": "ReactDOM"
  },
};
