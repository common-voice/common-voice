import * as React from 'react';
import { render } from 'react-dom';
import './lib/components/index.css';

declare var require: any;

require('es6-promise').polyfill();

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  const App = require('./lib/app').default;
  render(React.createElement(App), document.getElementById('root'));
});
