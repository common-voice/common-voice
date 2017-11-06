import './lib/components/index.css';

declare var require: any;

require('es6-promise').polyfill();

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  let App = require('./lib/app').default;
  let app = new App();

  await app.init();
  app.run();
});
