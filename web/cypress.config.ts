import { defineConfig } from 'cypress'
import { cypressBrowserPermissionsPlugin } from 'cypress-browser-permissions'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000', // TODO: generate this based on the env we run the test
    setupNodeEvents(on, config) {
      config = cypressBrowserPermissionsPlugin(on, config)
    },
    env: {
      browserPermissions: {
        microphone: 'allow',
      },
    },
    viewportWidth: 1200,
    viewportHeight: 1000,
  },
})
