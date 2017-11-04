import tape = require('tape');

const SUITE_TIMEOUT = 10000;
const TIMEOUT = 1000;

export type AsyncFunction = () => Promise<void>;
export type HelperFunction = (callback: AsyncFunction) => void;
export type TestFunction = (name: string, testFn: tape.TestCase) => void;

export type TestHelper = {
  before: HelperFunction;
  after: HelperFunction;
  test: TestFunction;
};

export type SuiteTestCase = {
  name: string;
  testFn: tape.TestCase;
};

export type SuiteFn = (testHelper: TestHelper) => void;

/**
 * Manages the state of any new suites that are created.
 */
class SuiteState {
  private name: string;
  private tape: tape.Test;
  private beforeHandler: AsyncFunction;
  private afterHandler: AsyncFunction;
  private tests: SuiteTestCase[];

  constructor(name: string, t: tape.Test) {
    this.name = name;
    this.tape = t;
    this.tests = [];

    // Use global finish handler to run `after` helper.
    tape.onFinish(this.onTapeFinish.bind(this));
  }

  /**
   * Tries to run a test function, but forwards unhandled errors into tape.
   */
  private async runTest(testCase: SuiteTestCase, t: tape.Test): Promise<void> {
    try {
      await testCase.testFn(t);
      t.pass(`succeeded ${testCase.name}`);
      t.end();
    } catch (err) {
      t.end(err);
    }
  }

  /**
   * Create a single tape test, bound to our `runTest` wrapper.
   */
  private createTest(testCase: SuiteTestCase): void {
    const testName = `${this.name}::${testCase.name}`;
    this.tape.test(
      testName,
      { timeout: TIMEOUT },
      this.runTest.bind(this, testCase)
    );
  }

  /**
   * Run when tape detects all tests have been run.
   */
  private async onTapeFinish(): Promise<void> {
    if (this.afterHandler) {
      await this.afterHandler();
    }
  }

  /**
   * Set callback for running before tests.
   */
  onBefore(callback: AsyncFunction): void {
    this.beforeHandler = callback;
  }

  /**
   * Set callback for running after all tests.
   */
  onAfter(callback: AsyncFunction): void {
    this.afterHandler = callback;
  }

  /**
   * Put a test in our test queue.
   */
  addTest(name: string, testFn: tape.TestCase): void {
    this.tests.push({
      name: name,
      testFn: testFn,
    });
  }

  /**
   * Get a nice object for interacting with the test suite.
   */
  getTestHelper(): TestHelper {
    return {
      before: this.onBefore.bind(this),
      after: this.onAfter.bind(this),
      test: this.addTest.bind(this),
    };
  }

  /**
   * Run the tests, will return when before handler is complete.
   */
  async runTests(): Promise<void> {
    if (this.beforeHandler) {
      try {
        await this.beforeHandler();
      } catch (err) {
        // If the before handler fails, forward that to tape.
        this.tape.end(err);
        return;
      }
    }

    // Now we are creating our tests. Tape will run them next tick.
    this.tests.map(this.createTest.bind(this));
  }
}

/**
 * This is our test suite creator. Here we create a tape context
 * and give it a suitably long timeout for running multiple tests.
 * We also assume all tasks are added before a single spin of the
 * event loop. The `before` and `after` helper functions are for
 * any test setup that needs async operation.
 */
export default function TestSuite(name: string, cb: SuiteFn) {
  tape(`Suite ${name}`, { timeout: SUITE_TIMEOUT }, (t: tape.Test) => {
    const suite = new SuiteState(name, t);
    cb(suite.getTestHelper());

    // Run all tests after next tick of the event loop.
    setTimeout(() => {
      suite.runTests();
    }, 0);
  });
}
