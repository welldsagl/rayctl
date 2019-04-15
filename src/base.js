// src/base.ts
const { Command, flags: flagType } = require('@oclif/command');

class BaseCommand extends Command {
  constructor(...props) {
    super(...props);
    this.printLog = super.log;
    this.printWarning = super.warn;
    this.printError = super.error;
  }

  parse() {
    return super.parse(BaseCommand);
  }

  log(msg, { verbose } = {}, logger = this.printLog) {
    const { flags } = this.parse(BaseCommand);

    // Silent prevents any log
    if (flags.silent) {
      return;
    }

    // Log is marked verbose, but the verbose flag is not present
    if (!flags.verbose && verbose) {
      return;
    }

    logger(msg);
  }

  warn(msg, { verbose } = {}, logger = this.printWarning) {
    const { flags } = this.parse(BaseCommand);

    // Log is marked verbose, but the verbose flag is not present
    if (!flags.verbose && verbose) {
      return;
    }

    logger(msg);
  }

  error(msg, options = {}, logger = this.printError) {
    logger(msg, options);
  }
}

/**
 * Default arguments
 */
BaseCommand.args = [];

/**
 * Default flags
 */
BaseCommand.flags = {
  silent: flagType.boolean({
    description: 'skip rayctl logs, other logs will be printed'
    // exclusive: ['verbose'],
  }),
  verbose: flagType.boolean({
    description: 'output verbose messages on internal operations'
    // exclusive: ['silent'],
  })
};

/**
 * Set arguments for the command extending `BaseCommand`
 *
 * The arguments will extend the default arguments of `BaseCommand`.
 * @param args List of argumets accepted by a given command.
 */
BaseCommand.setArgs = args => {
  BaseCommand.args = [...BaseCommand.args, ...args];
};

/**
 * Set flags for the command extending `BaseCommand`
 *
 * The arguments will extend the default flags of `BaseCommand`.
 * @param flags Dictionary of flags accepted by a given command.
 */
BaseCommand.setFlags = (flags = {}) => {
  BaseCommand.flags = {
    ...BaseCommand.flags,
    ...flags
  };
};

module.exports = {
  Command: BaseCommand,
  flags: flagType
};
