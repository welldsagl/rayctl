const fs = require('fs-extra');
const sh = require('shelljs');
const { expect, test } = require('@oclif/test');
const { clean, run } = require('../helpers');

const projectInit = 'foo';

describe('init', () => {
  /* eslint-disable no-undef */
  beforeEach(() => {
    clean(projectInit);
  });

  afterEach(() => {
    clean(projectInit);
  });
  /* eslint-enable no-undef */

  test.it('crashes without argument', () => {
    const out = run(['init']);
    expect(out.code).to.equal(2);
  });

  test.it('message log appears', () => {
    const out = run(['init', 'foo']);
    expect(out.stdout).to.contain('Run `react-native init foo`');
  });

  test.it('init folder already exists', () => {
    sh.cd('/tmp');
    sh.mkdir('foo');
    const out = run(['init', 'foo']);
    expect(out.stderr).to.contain('Directory foo already exists.');
  });

  test.it('creates foo folder', () => {
    run(['init', 'foo']);
    const fooFolderExists = fs.existsSync('/tmp/foo');
    expect(fooFolderExists).to.equal(true);
  });

  test.it('creates correct wl structure', () => {
    run(['init', 'foo']);

    const modulesDirectory = fs.existsSync('foo/modules');
    const namedModulesDirectory = fs.existsSync('foo/namedModules');
    const themesDirectory = fs.existsSync('foo/themes');
    const contextsDirectory = fs.existsSync('foo/contexts');
    const rayctlDirectory = fs.existsSync('foo/.rayctl');

    expect(modulesDirectory).to.equal(true);
    expect(namedModulesDirectory).to.equal(true);
    expect(themesDirectory).to.equal(true);
    expect(contextsDirectory).to.equal(true);
    expect(rayctlDirectory).to.equal(true);

    const rayctlConfig = fs.existsSync('/tmp/foo/.rayctl/config.json');
    expect(rayctlConfig).to.equal(true);
  });
});
