import 'focus-visible'
import * as React from 'react'
// import { render } from 'react-dom'
import { createRoot } from 'react-dom/client'

import App from './components/app'

import './components/index.css'

// declare var require: any

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function () {}, true)

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const deferredPolyfills = [
    typeof window.IntersectionObserver === 'undefined'
      ? require('intersection-observer')
      : Promise.resolve(),
    typeof window.MediaRecorder === 'undefined'
      ? require('audio-recorder-polyfill')
      : Promise.resolve(),
  ]
  const [, AudioRecorder] = await Promise.all(deferredPolyfills)

  if (AudioRecorder) window.MediaRecorder = AudioRecorder.default

  // const App = require('./components/app').default
  const container = document.getElementById('root')
  const root = createRoot(container)

  root.render(<App />)
})
