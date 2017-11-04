import { TestHelper, default as TestSuite } from './lib/test-suite';
import ServerHarness from './lib/server-harness';
import ApiHarness from './lib/api-harness';
import { Test as Tape } from 'tape';
import { CommonVoiceConfig, getConfig } from '../config-helper';
import { generateGUID } from './lib/utility';

TestSuite('User Tests', (helper: TestHelper) => {
  let serverHarness: ServerHarness;
  let apiHarness: ApiHarness;

  // Prepare tests.
  helper.before(async function() {
    const config = getConfig();
    config.SERVER_PORT++; // Don't interfere with default server.
    serverHarness = new ServerHarness(config);
    apiHarness = new ApiHarness(config);
    await serverHarness.connectToDatabase();
    await serverHarness.resetDatabase();
    await serverHarness.performMaintenance();

    serverHarness.listen();
    await apiHarness.ready();
  });

  helper.after(async function() {
    if (serverHarness) {
      serverHarness.done();
    }
  });

  helper.test('new user, updating', async function(t: Tape) {
    const clientId = generateGUID();
    const email = `email${Date.now()}@fake.com`;
    let clientCount, emailCount;

    clientCount = await serverHarness.getClientCount();
    emailCount = await serverHarness.getEmailCount();
    t.equal(clientCount, 0, 'should have no clients yet');
    t.equal(emailCount, 0, 'should have no emails yet');

    await apiHarness.syncUser(clientId);
    clientCount = await serverHarness.getClientCount();
    emailCount = await serverHarness.getEmailCount();
    t.equal(clientCount, 1, 'should have 1 client so far');
    t.equal(emailCount, 0, 'should not have email yet');

    await apiHarness.syncUser(clientId, email);
    clientCount = await serverHarness.getClientCount();
    emailCount = await serverHarness.getEmailCount();
    t.equal(clientCount, 1, 'should still have 1 client');
    t.equal(emailCount, 1, 'should now have 1 email');

    await apiHarness.syncUser(clientId, 'new_' + email);
    clientCount = await serverHarness.getClientCount();
    emailCount = await serverHarness.getEmailCount();
    t.equal(clientCount, 1, 'should still have 1 client');
    t.equal(emailCount, 2, 'should now have multiple emails');
  });
});
