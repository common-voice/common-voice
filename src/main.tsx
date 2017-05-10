import * as React from "react";
import * as ReactDOM from "react-dom";

import injectTapEventPluginRequire = require("react-tap-event-plugin");
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPluginRequire();

ReactDOM.render(
  <div>Voice Bank</div>,
  document.getElementById("app")
);
