import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000', // TODO: generate this based on the env we run the test
  },
})
