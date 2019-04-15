const fs = require('fs-extra');
const path = require('path');
const sh = require('shelljs');
const { expect, test } = require('@oclif/test');
const { clean, createDir, run, tempDir } = require('../helpers');

const initArg = 'foo';

describe('init', () => {
  /* eslint-disable no-undef */
  beforeEach(() => {
    clean();
    createDir();
  });

  afterEach(() => {
    clean();
  });
  /* eslint-enable no-undef */

  test.it('crashes without argument', () => {
    const out = run('init');
    expect(out.code).to.equal(2);
  });

  test.it('message log appears', () => {
    const out = run(`init ${initArg}`);
    expect(out.stdout).to.contain(`Run \`react-native init ${initArg}\``);
  });

  test.it('init folder already exists', () => {
    sh.cd(tempDir);
    sh.mkdir('-p', path.join('rayctl', initArg));
    const out = run(`init ${initArg}`);
    expect(out.stderr).to.contain(`Directory ${initArg} already exists.`);
  });

  test.it('creates init folder', () => {
    run(`init ${initArg}`);
    const fooFolderExists = fs.existsSync(path.join(tempDir, initArg));
    expect(fooFolderExists).to.equal(true);
  });

  test.it('creates correct wl structure', () => {
    run(`init ${initArg}`);

    const modulesDirectory = fs.existsSync(path.join(initArg, 'modules'));
    const namedModulesDirectory = fs.existsSync(path.join(initArg, 'namedModules'));
    const themesDirectory = fs.existsSync(path.join(initArg, 'themes'));
    const contextsDirectory = fs.existsSync(path.join(initArg, 'contexts'));
    const rayctlDirectory = fs.existsSync(path.join(initArg, '.rayctl'));

    expect(modulesDirectory).to.equal(true);
    expect(namedModulesDirectory).to.equal(true);
    expect(themesDirectory).to.equal(true);
    expect(contextsDirectory).to.equal(true);
    expect(rayctlDirectory).to.equal(true);

    const rayctlConfig = fs.existsSync(path.join(tempDir, initArg, '.rayctl', 'config.json'));
    expect(rayctlConfig).to.equal(true);
  });
});
