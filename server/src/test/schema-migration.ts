import { TestHelper, default as TestSuite } from './lib/test-suite';
import ServerHarness from './lib/server-harness';
import { Test as Tape } from 'tape';

TestSuite('Schema Migrations', (helper: TestHelper) => {
  let serverHarness: ServerHarness;

  // Prepare tests.
  helper.before(async function() {
    serverHarness = new ServerHarness();
    await serverHarness.connectToDatabase();
  });

  helper.after(async function() {
    if (serverHarness) {
      serverHarness.done();
    }
  });

  helper.test('check initial database', async function(t: Tape) {
    await serverHarness.resetDatabase();
    const version = await serverHarness.getDatabaseVersion();
    t.equal(version, 0, 'database should start at 0');
  });

  helper.test('check maintenance procedure', async function(t: Tape) {
    await serverHarness.resetDatabase();
    await serverHarness.performMaintenance();
    const version = await serverHarness.getDatabaseVersion();
    const codeVersion = serverHarness.getCodeVersion();
    t.equal(version, codeVersion, 'version should be current');
  });

  helper.test('verify tables for each version', async function(t: Tape) {
    await serverHarness.resetDatabase();

    for (let i = 1; i <= serverHarness.getCodeVersion(); i++) {
      await serverHarness.upgradeToVersion(i);
      const version = await serverHarness.getDatabaseVersion();
      t.equal(version, i, `db version match check, ${i}`);

      const currentTables = await serverHarness.getTableList();
      const exptectedTables = serverHarness.getTablesForVersion(i);
      t.deepEqual(
        currentTables.sort(),
        exptectedTables.sort(),
        `db table match check, ${i}`
      );
    }
  });
});
