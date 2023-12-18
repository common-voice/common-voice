import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000', // TODO: generate this based on the env we run the test
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'firefox') {
          // launchOptions.preferences is a map of preference names to values
          // login is not working in firefox when testing_localhost_is_secure_when_hijacked is false
          launchOptions.preferences[
            'network.proxy.testing_localhost_is_secure_when_hijacked'
          ] = true

          launchOptions.preferences['permissions.default.microphone'] = 1
          // allowing this for the purpose of running tests
          launchOptions.preferences['media.devices.insecure.enabled'] = true
          launchOptions.preferences['media.getusermedia.insecure.enabled'] =
            true
          launchOptions.preferences['media.getusermedia.audiocapture.enabled'] =
            true
        }

        return launchOptions
      })
    },
    viewportWidth: 1500,
    viewportHeight: 1000,
  },
})
