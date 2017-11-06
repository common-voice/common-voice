const path = require('path');
const webpack = require('webpack');
const config = require('../server/webpack.config');

function buildServer() {
  return webpack(
    Object.assign({ context: path.join(__dirname, '..', 'server') }, config)
  );
}

module.exports = buildServer;

if (require.main === module) {
  buildServer().run((err, stats) => {
    console.log(stats.toString({ colors: true }));
  });
}
