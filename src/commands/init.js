const { Command } = require('@oclif/command');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

class InitCommand extends Command {
  async run() {
    const { args } = this.parse(InitCommand);
    this.log(`Run \`react-native init ${args.name}\``);
    this.log('Generate white-label directories and files');

    if (fs.existsSync(args.name)) {
      this.error(`Directory ${args.name} already exists.`);
    }

    // TODO: use execSync(`react-native init ${args.name}`); instead of mkdir when init is ready
    execSync(`mkdir ${args.name}`);

    const wlDirectories = ['modules', 'namedModules', 'themes', 'contexts', '.rayctl'];
    wlDirectories.forEach(directoryName => {
      fs.mkdirSync(path.join(args.name, directoryName));
    });

    fs.writeFileSync(path.join(args.name, '.rayctl', 'config.json'), '');
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
