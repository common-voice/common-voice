import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request-promise-native';
import { AWS } from '../lib/aws';
import Schema from '../lib/model/db/schema';
import ServerHarness from './lib/server-harness';
import { getConfig } from '../config-helper';

let serverHarness: ServerHarness;
let schema: Schema;

beforeAll(async () => {
  serverHarness = new ServerHarness();
  schema = new Schema(serverHarness.mysql);
  await serverHarness.run();
});

beforeEach(async () => {
  await serverHarness.emptyDatabase();
});

afterAll(async () => {
  if (serverHarness) {
    await serverHarness.resetDatabase();
    serverHarness.done();
  }
});

// For Travis tests on PRs, we don't have AWS credentials,
// so we will skip this S3 upload test in this case.
/*(AWS.getS3().config.credentials ? test : test.skip)*/

/**
 * With the way locales are being imported with the sentences,
 * this has become very hard to test realistically
 */
test.skip('recording is uploaded and inserted into the db', async () => {
  expect(await serverHarness.getClipCount()).toBe(0);
  const sentence = 'Wubba lubba dub dub!';
  await request({
    uri: `http://localhost:${getConfig().SERVER_PORT}/api/v1/en/clips`,
    method: 'POST',
    headers: {
      'Content-Type': 'audio/ogg; codecs=opus4',
      client_id: 'wat',
      sentence: encodeURIComponent(sentence),
    },
    body: fs.createReadStream(path.join(__dirname, 'test.ogg')),
  });
  expect(await serverHarness.getClipCount()).toBe(1);
});
