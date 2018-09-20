import 'focus-visible';
import * as React from 'react';
import { render } from 'react-dom';
import './components/index.css';

declare var require: any;

if (typeof Promise === 'undefined') {
  require('es6-promise').polyfill();
}

if (!Object.entries) {
  Object.entries = function entries(obj: any): any {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    let resArray = new Array<any>(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  const App = require('./components/app').default;
  render(React.createElement(App), document.getElementById('root'));
});
