const fs = require('fs-extra');
const path = require('path');
const sh = require('shelljs');
const { expect, test } = require('@oclif/test');
const { clean, createDir, run, tempDir } = require('../helpers');

const projectName = 'foo';

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

  test.it('shows a message log', () => {
    const out = run(`init ${projectName}`);
    expect(out.stdout).to.contain(`Run \`react-native init ${projectName}\``);
  });

  test.it('prints error on project folder already present', () => {
    sh.cd(tempDir);
    sh.mkdir('-p', path.join('rayctl', projectName));
    const out = run(`init ${projectName}`);
    expect(out.stderr).to.contain(`Directory ${projectName} already exists.`);
  });

  test.it('creates init folder', () => {
    run(`init ${projectName}`);
    const fooFolderExists = fs.existsSync(path.join(tempDir, 'rayctl', projectName));
    expect(fooFolderExists).to.equal(true);
  });

  test.it('creates correct wl structure', () => {
    run(`init ${projectName}`);

    const modulesDirectory = fs.existsSync(path.join(projectName, 'modules'));
    const namedModulesDirectory = fs.existsSync(path.join(projectName, 'namedModules'));
    const themesDirectory = fs.existsSync(path.join(projectName, 'themes'));
    const contextsDirectory = fs.existsSync(path.join(projectName, 'contexts'));
    const rayctlDirectory = fs.existsSync(path.join(projectName, '.rayctl'));

    expect(modulesDirectory).to.equal(true);
    expect(namedModulesDirectory).to.equal(true);
    expect(themesDirectory).to.equal(true);
    expect(contextsDirectory).to.equal(true);
    expect(rayctlDirectory).to.equal(true);

    const rayctlConfig = fs.existsSync(path.join(tempDir, 'rayctl', projectName, '.rayctl', 'config.json'));
    expect(rayctlConfig).to.equal(true);
  });
});
