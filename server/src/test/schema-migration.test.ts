import ServerHarness from './lib/server-harness';

let serverHarness: ServerHarness;

beforeAll(async () => {
  serverHarness = new ServerHarness();
  await serverHarness.connectToDatabase();
});

beforeEach(async () => {
  await serverHarness.resetDatabase();
});

afterAll(() => {
  if (serverHarness) {
    serverHarness.done();
  }
});

test('database initialized with version 0', async () => {
  const version = await serverHarness.getDatabaseVersion();
  expect(version).toBe(0);
});

test('maintenance results in database using the most recent version', async () => {
  await serverHarness.performMaintenance();
  const version = await serverHarness.getDatabaseVersion();
  const codeVersion = serverHarness.getCodeVersion();
  expect(version).toBe(codeVersion);
});

test('upgrade from version to version, with all table names being there', async () => {
  for (let i = 1; i <= serverHarness.getCodeVersion(); i++) {
    await serverHarness.upgradeToVersion(i);
    const version = await serverHarness.getDatabaseVersion();
    expect(version).toBe(i);

    const currentTables = await serverHarness.getTableList();
    const exptectedTables = serverHarness.getTablesForVersion(i);
    expect(currentTables.sort()).toEqual(exptectedTables.sort());
  }
});
