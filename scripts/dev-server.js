const path = require('path');
const chalk = require('chalk');
const ESLint = require('eslint');
const nodemon = require('nodemon');
const webpack = require('webpack');
const buildServer = require('./build-server');

let serverRunning = false;

function startServer() {
  serverRunning = true;
  const SERVER_JS = 'server/js/server.js';
  nodemon({
    script: SERVER_JS,
    watch: SERVER_JS,
  });
}
const serverCompiler = buildServer();
serverCompiler.plugin('compile', () => {
  console.log(chalk.yellow('Rebuilding the server...'));
});
serverCompiler.watch({}, (err, stats) => {
  if (stats.hasErrors()) {
    console.log(stats.toString('errors-only'));
  } else {
    console.log(chalk.green('Server built!'));
    if (!serverRunning) startServer();
  }
});

const clientCompiler = webpack(
  Object.assign(
    { context: path.join(__dirname, '..', 'web'), mode: 'development' },
    require('../web/webpack.config')
  )
);
clientCompiler.plugin('compile', () => {
  console.log(chalk.yellow('Rebuilding the client...'));
});
clientCompiler.watch({}, (err, stats) => {
  if (stats.hasErrors()) {
    console.log(stats.toString('errors-only'));
  } else {
    console.log(chalk.green('Client built!'));
  }
});

// "npm run lint\"
