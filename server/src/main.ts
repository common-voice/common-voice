// ./instrument has to be imported fist to enable performance monitoring
import './instrument'

import Server from './server'
import { getConfig } from './config-helper'

async function runServer() {
  // Handle any top-level exceptions uncaught in the app.
  process.on('uncaughtException', function (err: any) {
    if (err.code === 'EADDRINUSE') {
      // For now, do nothing when we are unable to start the http server.
      console.error('[MAIN-ERROR] Server already running')
    } else if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
      // Connection reset/broken pipe from client disconnect - non-fatal, don't crash
      console.error('[MAIN-ERROR] non-fatal socket exception:', err.message)
    } else {
      // We will crash the app when getting unknown top-level exceptions.
      console.error('[MAIN-FATAL] uncaught exception', err)
      process.exit(1)
    }
  })

  process.on('unhandledRejection', r =>
    console.error('[MAIN-ERROR] unhandled promise rejection', r)
  )

  // If this file is run directly, boot up a new server instance.
  if (require.main === module) {
    const server = new Server()
    await server.setupApp()
    server
      .run({ doImport: getConfig().IMPORT_SENTENCES })
      .catch(e => console.error('[MAIN-FATAL] error while starting server', e))
  }
}

runServer()
