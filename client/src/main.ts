/// <reference path="./vendor/require.d.ts" />

const APP_FILE = './lib/app';

/**
 * Boot the app.
 */
function run(appModule) {
  let App = appModule.default;
  let container = document.getElementById('content');
  let app = new App(container);
  app.run();
}

// Configure entry point regaurdless of if requirejs has loaded yet.
if (!require) {
  let require = {
    deps: [APP_FILE],
    callback: run
  };
} else {
  require([APP_FILE], run);
}
