const fs = require('fs-extra');
const sh = require('shelljs');

exports.clean = path => {
  if (fs.existsSync(`/tmp/${path}`)) {
    fs.removeSync(`/tmp/${path}`);
  }
};

exports.run = (args, opts, before) => {
  sh.cd('/tmp');
  const command = args.join(' ');

  const preCommand = before ? `${before} && ` : '';
  return sh.exec(`${preCommand}rayctl ${command}`, opts);
};
