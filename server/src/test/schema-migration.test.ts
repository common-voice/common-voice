import Schema from '../lib/model/db/schema';
import ServerHarness from './lib/server-harness';

let serverHarness: ServerHarness;
let schema: Schema;

beforeAll(async () => {
  serverHarness = new ServerHarness();
  schema = new Schema(serverHarness.mysql);
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

test('migrations run without errors', () => {
  return expect(schema.upgrade()).resolves.toBeUndefined();
});
