const { expect, test } = require('@oclif/test');
const sinon = require('sinon');
const { Command } = require('../src/base');

/* eslint-disable no-console,no-process-exit,unicorn/no-process-exit */
/**
 * Custom loggers
 */
const logger = {
  info: msg => {
    console.log(msg);
  },
  warn: msg => {
    console.warn(msg);
  },
  error: (msg, { exit } = {}) => {
    console.error(msg);
    process.exit(exit || 1);
  }
};
/* eslint-enable no-console,no-process-exit,unicorn/no-process-exit */

/**
 * Custom Command classes for tests
 */
class TestLogCommand extends Command {
  async run() {
    this.log('log');
  }
}

class TestLogVerboseCommand extends Command {
  async run() {
    this.log('log verbose', { verbose: true });
  }
}

class TestLogCustomCommand extends Command {
  async run() {
    this.log('log custom', {}, logger.info);
  }
}

class TestWarnCommand extends Command {
  async run() {
    this.warn('warn');
  }
}

class TestWarnVerboseCommand extends Command {
  async run() {
    this.warn('warn verbose', { verbose: true });
  }
}

class TestWarnCustomCommand extends Command {
  async run() {
    this.warn('warn custom', {}, logger.warn);
  }
}

class TestErrorCommand extends Command {
  async run() {
    this.error('error', {});
  }
}

class TestErrorCustomCommand extends Command {
  async run() {
    this.error('error custom', {}, logger.error);
  }
}

/**
 * Tests
 */
describe('command', () => {
  /**
   * Logs
   */
  test.it('logs normally without flags', async () => {
    const testCommand = new TestLogCommand([], {});
    sinon.stub(testCommand, 'printLog');

    await testCommand.run();
    expect(testCommand.printLog.calledWith('log')).to.equal(true);

    testCommand.printLog.restore();
  });

  test.it('logs normally with `--verbose` flag', async () => {
    const testCommand = new TestLogCommand(['--verbose'], {});
    sinon.stub(testCommand, 'printLog');

    await testCommand.run();
    expect(testCommand.printLog.calledWith('log')).to.equal(true);

    testCommand.printLog.restore();
  });

  test.it("doesn't log normally with `--silent` flag", async () => {
    const testCommand = new TestLogCommand(['--silent'], {});
    sinon.stub(testCommand, 'printLog');

    await testCommand.run();
    expect(testCommand.printLog.calledWith('log')).to.equal(false);

    testCommand.printLog.restore();
  });

  test.it('throws an error with both `--silent` and `--verbose` flags', async () => {
    const testCommand = new TestLogCommand(['--silent', '--verbose'], {});
    const errorMessage = '--verbose= cannot also be provided when using --silent=';
    testCommand
      .run()
      .then(() => {
        throw new Error(errorMessage);
      })
      .catch(error => expect(error.message).to.equal(errorMessage));
  });

  /**
   * Verbose logs
   */
  test.it("doesn't log verbose without flags", async () => {
    const testCommand = new TestLogVerboseCommand([], {});
    sinon.stub(testCommand, 'printLog');

    await testCommand.run();
    expect(testCommand.printLog.calledWith('log verbose')).to.equal(false);

    testCommand.printLog.restore();
  });

  test.it('logs verbose with `--verbose` flag', async () => {
    const testCommand = new TestLogVerboseCommand(['--verbose'], {});
    sinon.stub(testCommand, 'printLog');

    await testCommand.run();
    expect(testCommand.printLog.calledWith('log verbose')).to.equal(true);

    testCommand.printLog.restore();
  });

  test.it("doesn't log verbose with `--silent` flag", async () => {
    const testCommand = new TestLogVerboseCommand(['--silent'], {});
    sinon.stub(testCommand, 'printLog');

    await testCommand.run();
    expect(testCommand.printLog.calledWith('log verbose')).to.equal(false);

    testCommand.printLog.restore();
  });

  /**
   * Custom log logger
   */
  test.it('logs normally with custom logger', async () => {
    const testCommand = new TestLogCustomCommand([], {});
    sinon.stub(logger, 'info');

    await testCommand.run();
    expect(logger.info.calledWith('log custom')).to.equal(true);

    logger.info.restore();
  });

  /**
   * Warnings
   */
  test.it('warns normally without flags', async () => {
    const testCommand = new TestWarnCommand([], {});
    sinon.stub(testCommand, 'printWarning');

    await testCommand.run();
    expect(testCommand.printWarning.calledWith('warn')).to.equal(true);

    testCommand.printWarning.restore();
  });

  test.it('warns normally with `--verbose` flag', async () => {
    const testCommand = new TestWarnCommand(['--verbose'], {});
    sinon.stub(testCommand, 'printWarning');

    await testCommand.run();
    expect(testCommand.printWarning.calledWith('warn')).to.equal(true);

    testCommand.printWarning.restore();
  });

  test.it('warns normally with `--silent` flag', async () => {
    const testCommand = new TestWarnCommand(['--silent'], {});
    sinon.stub(testCommand, 'printWarning');

    await testCommand.run();
    expect(testCommand.printWarning.calledWith('warn')).to.equal(true);

    testCommand.printWarning.restore();
  });

  /**
   * Verbose logs
   */
  test.it("doesn't warn verbose without flags", async () => {
    const testCommand = new TestWarnVerboseCommand([], {});
    sinon.stub(testCommand, 'printWarning');

    await testCommand.run();
    expect(testCommand.printWarning.calledWith('warn verbose')).to.equal(false);

    testCommand.printWarning.restore();
  });

  test.it('warns verbose with `--verbose` flag', async () => {
    const testCommand = new TestWarnVerboseCommand(['--verbose'], {});
    sinon.stub(testCommand, 'printWarning');

    await testCommand.run();
    expect(testCommand.printWarning.calledWith('warn verbose')).to.equal(true);

    testCommand.printWarning.restore();
  });

  test.it("doesn't warn verbose with `--silent` flag", async () => {
    const testCommand = new TestWarnVerboseCommand(['--silent'], {});
    sinon.stub(testCommand, 'printWarning');

    await testCommand.run();
    expect(testCommand.printWarning.calledWith('warn verbose')).to.equal(false);

    testCommand.printWarning.restore();
  });

  /**
   * Custom warning logger
   */
  test.it('logs normally with custom logger', async () => {
    const testCommand = new TestWarnCustomCommand([], {});
    sinon.stub(logger, 'warn');

    await testCommand.run();
    expect(logger.warn.calledWith('warn custom')).to.equal(true);

    logger.warn.restore();
  });

  /**
   * Errors
   */
  test.it('prints error without flags', async () => {
    const testCommand = new TestErrorCommand([], {});
    sinon.stub(testCommand, 'printError');

    await testCommand.run();
    expect(testCommand.printError.calledWith('error')).to.equal(true);

    testCommand.printError.restore();
  });

  test.it('prints error with `--verbose` flag', async () => {
    const testCommand = new TestErrorCommand(['--verbose'], {});
    sinon.stub(testCommand, 'printError');

    await testCommand.run();
    expect(testCommand.printError.calledWith('error')).to.equal(true);

    testCommand.printError.restore();
  });

  test.it('prints error with `--silent` flag', async () => {
    const testCommand = new TestErrorCommand(['--verbose'], {});
    sinon.stub(testCommand, 'printError');

    await testCommand.run();
    expect(testCommand.printError.calledWith('error')).to.equal(true);

    testCommand.printError.restore();
  });

  /**
   * Custom error logger
   */
  test.it('prints error with custom logger', async () => {
    const testCommand = new TestErrorCustomCommand([], {});
    sinon.stub(logger, 'error');

    await testCommand.run();
    expect(logger.error.calledWith('error custom')).to.equal(true);

    logger.error.restore();
  });
});
