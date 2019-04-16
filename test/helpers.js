const fs = require('fs-extra');
const sh = require('shelljs');
const os = require('os');
const path = require('path');

exports.tempDir = os.tmpdir();

const defaultOptions = {
  dir: this.tempDir
};

exports.clean = opts => {
  const { dir } = { ...defaultOptions, ...opts };
  const rootPath = path.join(dir, 'rayctl');
  if (fs.existsSync(rootPath)) {
    fs.removeSync(rootPath);
  }
};

exports.createDir = opts => {
  const { dir } = { ...defaultOptions, ...opts };
  sh.mkdir('-p', path.join(dir, 'rayctl'));
};

exports.run = (command, opts) => {
  const { before, after, silent, dir } = { ...defaultOptions, ...opts };
  const commandPath = path.join(dir, 'rayctl');

  sh.cd(commandPath);

  const preCommand = before ? `${before} && ` : '';
  const postCommand = after ? `&& ${after}` : '';
  const silentOutput = silent || false;

  return sh.exec(`${preCommand}rayctl ${command} ${postCommand}`, silentOutput);
};
