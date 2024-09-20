import Server from './server';
import { getConfig } from './config-helper';

async function runServer() {
  // Handle any top-level exceptions uncaught in the app.
  process.on('uncaughtException', function (err: any) {
    if (err.code === 'EADDRINUSE') {
      // For now, do nothing when we are unable to start the http server.
      console.error('ERROR: server already running');
    } else {
      // We will crash the app when getting unknown top-level exceptions.
      console.error('uncaught exception', err);
      process.exit(1);
    }
  });

  process.on('unhandledRejection', r =>
    console.error('unhandled promise rejection', r)
  );

  // If this file is run directly, boot up a new server instance.
  if (require.main === module) {
    const server = new Server();
    await server.setupAppRouting();
    server
      .run({ doImport: getConfig().IMPORT_SENTENCES })
      .catch(e => console.log('error while starting server', e));
  }
}

runServer();
