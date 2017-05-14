document.addEventListener('DOMContentLoaded', () => {
  let container = document.getElementById('content');
  let App = require('./lib/app').default;
  let app = new App(container);
  app.run();
});
