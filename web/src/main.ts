import 'focus-visible';
import * as React from 'react';
import { render } from 'react-dom';
import './components/index.css';
import './tailwind.css';
declare var require: any;

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function () {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const deferredPolyfills = [
    typeof window.IntersectionObserver === 'undefined'
      ? require('intersection-observer')
      : Promise.resolve(),
    typeof window.MediaRecorder === 'undefined'
      ? require('audio-recorder-polyfill')
      : Promise.resolve(),
  ];
  const [_, AudioRecorder] = await Promise.all(deferredPolyfills);
  if (AudioRecorder) window.MediaRecorder = AudioRecorder.default;
  const App = require('./components/app').default;
  render(React.createElement(App), document.getElementById('root'));
});
