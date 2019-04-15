const fs = require('fs-extra');
const sh = require('shelljs');
const os = require('os');
const path = require('path');

exports.clean = (opts = { dir: this.tempDir }) => {
  const tmpPath = path.join(opts.dir, 'rayctl');
  if (fs.existsSync(tmpPath)) {
    fs.removeSync(tmpPath);
  }
};

exports.createDir = (opts = { dir: this.tempDir }) => {
  sh.mkdir('-p', path.join(opts.dir, 'rayctl'));
};

exports.tempDir = os.tmpdir();

exports.run = (command, opts = {}) => {
  const tempDir = opts.dir || this.tempDir;
  const tmpPath = path.join(tempDir, 'rayctl');

  sh.cd(tmpPath);

  const { before, after, silent } = opts;

  const preCommand = before ? `${before} && ` : '';
  const postCommand = after ? `&& ${after}` : '';
  const silentOutput = silent || false;

  return sh.exec(`${preCommand}rayctl ${command} ${postCommand}`, silentOutput);
};
