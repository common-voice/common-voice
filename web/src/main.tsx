import * as React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app';
import './components/index.css';

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

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
