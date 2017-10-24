import tape = require('tape');

const SUITE_TIMEOUT = 10000;
const TIMEOUT = 100;

// All our test functions will be async.
export type TestFunction = (
  name: string,
  testCase: tape.TestCase
) => Promise<void>;

export type SuiteFn = (testFn: TestFunction) => void;

/**
 * This is our test suite creator. Here we create a tape context
 * and give it a suitably long timeout for running multiple tests.
 */
export default function TestSuite(name: string, cb: SuiteFn, done: () => void) {
  tape.onFinish(done);
  tape(`Suite ${name}`, { timeout: SUITE_TIMEOUT }, (t: tape.Test) => {
    cb(createTest.bind(null, t, name));
  });
}

/**
 * Tries to run a test function, but forwards unhandled errors into tape.
 */
async function runTest(name: string, testCase: tape.TestCase, t: tape.Test) {
  try {
    await testCase(t);
    t.pass(`succeeded ${name}`);
    t.end();
  } catch (err) {
    t.end(err);
  }
}

/**
 * Create a new tape test function, and runTest when it's ready.
 */
function createTest(
  t: any, // TODO: turn into tape.Test (but requires some type wrangling)
  suite: string,
  test: string,
  testCase: tape.TestCase
) {
  const name = `${suite}::${test}`;
  t.test(name, { timeout: TIMEOUT }, runTest.bind(null, name, testCase));
}
