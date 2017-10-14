declare var define: any;
declare var require: any;

define('preact', () => {
  return preact;
});

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  let App = require('./lib/app').default;
  let app = new App();
  await app.init();
  app.run();
});
