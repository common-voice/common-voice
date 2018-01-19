import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import Schema from '../lib/model/db/schema';
import ServerHarness from './lib/server-harness';

let serverHarness: ServerHarness;
let schema: Schema;

beforeAll(async () => {
  serverHarness = new ServerHarness();
  schema = new Schema(serverHarness.mysql, serverHarness.config);
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

test('recording is uploaded and inserted into the db', async () => {
  const sentence = 'Wubba lubba dub dub!';
  await serverHarness.server.api.clip.saveSentence(sentence);
  await fetch(`http://localhost:${serverHarness.config.SERVER_PORT}/upload/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/ogg; codecs=opus4',
      uid: 'wat',
      sentence: encodeURIComponent(sentence),
    },
    body: fs.createReadStream(path.join(__dirname, 'test.ogg')),
  }).then((res: any) => res.text());
  expect(await serverHarness.getClipCount()).toBe(1);
});
