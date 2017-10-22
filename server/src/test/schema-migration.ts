import { TestFunction, default as TestSuite } from './lib/test-suite';
import ServerHarness from './lib/server-harness';
import { Test as Tape } from 'tape';

const serverHarness = new ServerHarness();

TestSuite(
  'Schema Migrations',
  (test: TestFunction) => {
    test('connect to database', async function(t: Tape) {
      await serverHarness.connectToDatabase();
    });

    test('create database user', async function(t: Tape) {
      await serverHarness.createDatabaseUser();
    });

    test('check database is at 0', async function(t: Tape) {
      const version = await serverHarness.getDatabaseVersion();
      t.equal(version, 0, 'database should start at 0');
    });

    serverHarness.done();
  },

  // When we are done, make sure to clean up the testing harness.
  () => {
    if (serverHarness) {
      serverHarness.done();
    }
  }
);
