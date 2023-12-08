import { defineConfig } from 'cypress'
import { cypressBrowserPermissionsPlugin } from 'cypress-browser-permissions'
import 'dotenv/config'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000', // TODO: generate this based on the env we run the test
    setupNodeEvents(on, config) {
      config = cypressBrowserPermissionsPlugin(on, config)

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'firefox') {
          // launchOptions.preferences is a map of preference names to values
          // login is not working in firefox when testing_localhost_is_secure_when_hijacked is false
          launchOptions.preferences[
            'network.proxy.testing_localhost_is_secure_when_hijacked'
          ] = true
        }

        return launchOptions
      })
    },
    env: {
      browserPermissions: {
        microphone: 'allow',
      },
      auth0Domain: process.env.AUTH0_DOMAIN,
      testUserEmail: process.env.TEST_USER_EMAIL,
      testUserPassword: process.env.TEST_USER_PASSWORD,
    },
    viewportWidth: 1500,
    viewportHeight: 1000,
  },
})
