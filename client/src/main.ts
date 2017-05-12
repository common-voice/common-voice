/// <reference path="./vendor/require.d.ts" />

require(['app'], (module) => {
  let App = module.default;
  let container = document.getElementById('content');
  let app = new App(container);
  app.run();
});
