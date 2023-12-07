import { defineConfig } from 'cypress'
import { cypressBrowserPermissionsPlugin } from 'cypress-browser-permissions'

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:9000', // TODO: generate this based on the env we run the test
    setupNodeEvents(on, config) {
      config = cypressBrowserPermissionsPlugin(on, config)
    },
    env: {
      browserPermissions: {
        microphone: 'allow',
      },
      // TODO: move this to env file
      auth0Domain: 'auth0Domain',
    },
    viewportWidth: 1500,
    viewportHeight: 1000,
  },
})
