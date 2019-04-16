// src/base.ts
const { Command, flags: flagType } = require('@oclif/command');

class BaseCommand extends Command {
  /**
   * Constructor
   *
   * The constructor assigns three public methods
   *   - printLog: prints to the stdout.
   *   - printWarn: prints to the stderr.
   *   - printError: prints to the stderr and exits with 1.
   * These methods are used respectively in `this.log`, `this.warn` and
   * `this.error`. They are the default functions used to log.
   * The constructor also parses the command and assigns arguments and flags
   * to attributes `this.args` and `this.flags` respectively.
   *
   * @param props Props to be forwarded to parent constructor.
   */
  constructor(...props) {
    super(...props);
    this.printLog = super.log;
    this.printWarning = super.warn;
    this.printError = super.error;

    // Check and set args/flags if they have never been set for the current
    // command class (i.e., `setArgs` and/or `setFlags` have not been called
    // when defining a command a sub-class of BaseCommand).
    if (!this.constructor.didSetArgs) {
      this.constructor.setArgs();
    }
    if (!this.constructor.didSetFlags) {
      this.constructor.setFlags();
    }

    const { args, flags } = super.parse(this.constructor);
    this.args = args;
    this.flags = flags;
  }

  /**
   * Parse command's arguments and flags
   *
   * This method is used to retrieve arguments and flags passed to a command
   *   const { args, flags } = this.parse();
   * Usually it is used in the `run` method of a command.
   *
   * However, arguments and flags are already parsed in the constructor, and
   * they are assigned to `this.args` and `this.flags`, so parsing the command
   * a second time is usually not necessary.
   *
   * @returns The parsed command's arguments and flags (as well as other data).
   */
  parse() {
    return super.parse(this.constructor);
  }

  /**
   * Set arguments for the command extending `BaseCommand`
   *
   * The arguments will extend the default arguments of `BaseCommand`.
   *
   * @param args List of argumets accepted by a given command.
   */
  static setArgs(args = []) {
    this.didSetArgs = true;
    this.args = [...BaseCommand.args, ...args];
  }

  /**
   * Set flags for the command extending `BaseCommand`
   *
   * The arguments will extend the default flags of `BaseCommand`.
   *
   * @param flags Dictionary of flags accepted by a given command.
   */
  static setFlags(flags = {}) {
    this.didSetFlags = true;
    this.flags = {
      ...BaseCommand.flags,
      ...flags
    };
  }

  /**
   * Log messages
   *
   * It logs messages (by default to stdout, but it can be overridden), with the
   * option to define verbose logs (logs which are only visible when a command
   * is invoked with the `--verbose` flag); logs can be disabled completely by
   * using the `--silence` flag. The user can also specify which function to use
   * to log.
   *
   * Example usage
   *   this.log('This is a message');
   *   this.log('This is a verbose message', { verbose: true })'
   *   this.log('This message uses a custom logger', {}, console.log)'
   *
   * @param msg Message to be logged.
   * @param options (default = {})
   *   - verbose: If marked verbose, a log is printed only if the command is
   *     invoked with the `--verbose` flag
   *       $ rayctl command --verbose
   * @param logger (default = this.printLog) Function used to actually log.
   * The `logger` has the following signature
   *   logger(msg: string)
   *     - msg: The message to be logged.
   */
  log(msg, { verbose } = {}, logger = this.printLog) {
    const { flags } = this.parse(BaseCommand);

    // Silent prevents any log
    if (flags.silent || flags.quiet) {
      return;
    }

    // Log is marked verbose, but the verbose flag is not present
    if (!flags.verbose && verbose) {
      return;
    }

    logger(msg);
  }

  /**
   * Log warnings
   *
   * It logs warnings (by default to stderr, but it can be overridden), with the
   * option to define verbose logs (warnings which are only visible when a
   * command is invoked with the `--verbose` flag). The user can also specify
   * which function to use to log.
   *
   * Example usage
   *   this.warn('This is a warning');
   *   this.warn('This is a verbose warning', { verbose: true })'
   *   this.warn('This warning uses a custom logger', {}, console.warn)'
   *
   * @param msg Warning message to be logged.
   * @param options (default = {})
   *   - verbose: If marked verbose, a warning is printed only if the command is
   *   invoked with the `--verbose` flag
   *       $ rayctl command --verbose
   * @param logger (default = this.printWarning) Function used to actually log.
   * The `logger` has the following signature
   *   logger(msg: string)
   *     - msg: The warning message to be logged.
   */
  warn(msg, { verbose } = {}, logger = this.printWarning) {
    const { flags } = this.parse(BaseCommand);

    // Log is marked verbose, but the verbose flag is not present
    if (!flags.verbose && verbose) {
      return;
    }

    logger(msg);
  }

  /**
   * Log errors
   *
   * It logs errors (by default to stderr, followed by an exit 1). The user can
   * also specify which function to use to log.
   *
   * Example usage
   *   this.error('This is an error');
   *   this.error('This is error uses a custom logger', {}, console.error)'
   *
   * @param msg Error message to be logged.
   * @param options (default = {})
   *   - verbose: If marked verbose, an error is printed only if the command is
   *   invoked with the `--verbose` flag
   *       $ rayctl command --verbose
   * @param logger (default = this.printError) Function used to actually log.
   * The `logger` has the following signature
   *   logger(msg: string, options: { code: string, exit: number })
   *     - msg: The error message to be logged.
   *     - options:
   *         - code: Code for the error.
   *         - exit: Exit number.
   *   When passing a custom logger, keep in mind that it should exit after
   *   logging the error.
   */
  error(msg, options = {}, logger = this.printError) {
    logger(msg, options);
  }
}

/**
 * Default arguments, passed to all commands inheriting from BaseCommand
 */
BaseCommand.args = [];

/**
 * Default flags, passed to all commands inheriting from BaseCommand
 */
BaseCommand.flags = {
  quiet: flagType.boolean({
    description: 'skip rayctl logs, other logs will be printed',
    exclusive: ['verbose']
  }),
  silent: flagType.boolean({
    description: 'skip rayctl logs, other logs will be printed',
    exclusive: ['verbose']
  }),
  verbose: flagType.boolean({
    description: 'output verbose messages on internal operations',
    exclusive: ['silent', 'quiet']
  })
};

module.exports = {
  Command: BaseCommand,
  flags: flagType
};
