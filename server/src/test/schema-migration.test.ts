import { NextFunction, Request, Response } from 'express';

import Schema from '../lib/model/db/schema';
import ServerHarness from './lib/server-harness';

let serverHarness: ServerHarness;
let schema: Schema;

jest.mock('../lib/rate-limiter-middleware', () => ({
  default: function () {
    return async (
      _request: Request,
      _response: Response,
      next: NextFunction
    ) => {
      next();
    };
  },
}));

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
