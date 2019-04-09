const { Command } = require('@oclif/command');

class InitCommand extends Command {
  async run() {
    const { args } = this.parse(InitCommand);
    // TODO: implement react-native init and directories/files generation
    this.log(`Run \`react-native init ${args.name}\``);
    this.log('Generate white-label directories and files');
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
