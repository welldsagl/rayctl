const { Command } = require('@oclif/command');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const commandExistsSync = require('command-exists').sync;

class InitCommand extends Command {
  async run() {
    const { args } = this.parse(InitCommand);
    this.log(`Run \`react-native init ${args.name}\``);
    this.log('Generate white-label directories and files');
    if (!commandExistsSync('react-native')) {
      this.log('react-native command, not found. This CLI requires react-native to be installed');
      this.exit(1);
    }
    if (fs.existsSync(args.name)) {
      this.log(`Directory ${args.name} already exists.`);
      this.exit(1);
    }

    // to test, we can use this: execSync(`mkdir ${args.name}`);
    // execSync(`react-native init ${args.name}`);
    execSync(`mkdir ${args.name}`);

    const wlDirectories = ['modules', 'namedModules', 'themes', 'contexts', '.rayctl'];
    wlDirectories.forEach(directoryName => {
      fs.mkdirSync(`${args.name}/${directoryName}`);
    });

    fs.writeFileSync(`${args.name}/.rayctl/config.json`, '');
  }
}

InitCommand.description = `\
Initialize React Native white-label project.

This command will create a new React Native project, with 'react-native init',
with the addition of white-label custom files and directories.
`;

InitCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the white-label project'
  }
];

module.exports = InitCommand;
