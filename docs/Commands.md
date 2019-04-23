# Commands

Commands are instruction executed with rayctl in the terminal
```
$ rayctl COMMAND
```

In this section we will see how to add a command to rayctl.

## Files organization

Commands are stored in the `src/commands/` directory. Each command must have a
file (named after the command). For instance, `src/commands/init.js` represents
the command
```
$ rayctl init NAME
```

Every command should also have a corresponding unit test file in directory
`test/commands/`. Taking the init example, it should have a file
`test/commands/init.test.js`.

## Add a command

To add a command, you need to follow the guides provided by oclif
* [Add a command](https://oclif.io/docs/commands)
* [Add command's arguments](https://oclif.io/docs/args)
* [Add command's flags](https://oclif.io/docs/flags)

with a few differences
* Instead of inheriting from `Command`, imported from `@oclif/command`, we
  inherit from a custom base class `Command` imported from
  `src/commands/base.js`
  ```js
  const { Command } = require('../base');
  
  class ExampleCommand extends Command {
    // ...
  }
  ```
* When adding args or flags, instead of adding them with
  ```js
  ExampleCommand.args = { /* ... */ };
  ExampleCommand.flags = { /* ... */ };
  ```
  we assing them via `setArgs` and `setFlags` methods
  ```js
  ExampleCommand.setArgs({ /* ... */ });
  ExampleCommand.setFlags({ /* ... */ });
  ```
* In `run`, instead of parsing arguments and flags with the command class name,
  we can access them with `this.args` and `this.flags`
  ```js
  class ExampleCommand extends Command {
    run() {
      const args = this.args;
      const flags = this.flags;
      // ...
    }
  }
  ```
  If necessary, it is still possible to parse the command, with
  ```js
  const { args, flags } = this.parse;
  ```

These modifications allow us to have customized logs and global `--silent` and
`--verbose` flags for all commands.

## Logs

By extending a command with our custom `Command`, instead of the standard
`Command` provided by oclif, we can have more detailed logs.

Logs can be used as described in the [oclif documentation](https://oclif.io/docs/commands).
In addition to that, `this.log`, `this.warn` and `this.error` are extended to
have the following signatures
```js
this.log(
  message: string,
  options?: { verbose?: boolean, silent?: boolean },
  logger?: (message: string) => {}
)

this.warn(
  message: string | Error,
  options?: { verbose?: boolean },
  logger?: (message: string | Error) => {}
)

this.error(
  message: string | Error,
  options?: { code?: string, exit?: number },
  logger?: (message: string | Error, options?: { code?: string, exit?: number }) => {}
)
```

Options are now defined for all logs and support the **verbose** flag. A log
marked as verbose will only be printed to the console if the command is invoked
with the `--verbose` flag, otherwise it is ignored
```js
this.log('This log is verbose', { verbose: true });
```

Logs inherited from `Command` also support the **silent** flag, meaning that if
the command is invoked with `--silent`, it will not print anything. N.B.: this
is available only for `this.log`, not for `this.warn` or `this.error`.

Logs also take an optional argument `logger`, which is a function that takes
care of printing the message to the console. By default, `super.log`,
`super.warn` and `super.error` are used. The user can also specify different
loggers, such as `console.log` or `Alert.alert`.
