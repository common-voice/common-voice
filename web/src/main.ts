declare var define;
declare var require;
define('preact', () => { return preact; })

document.addEventListener('DOMContentLoaded', () => {
  let App = require('./lib/app').default;
  let app = new App();
  app.run();
});
