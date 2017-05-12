/// <reference path="./vendor/require.d.ts" />

function run(appModule) {
  let App = appModule.default;
  let container = document.getElementById('content');
  let app = new App(container);
  app.run();
}

// Configure entry point regaurdless of if requirejs has loaded yet.
if (!require) {
  let require = {
    deps: ["app"],
    callback: run
  };
} else {
  require(['app'], run);
}
