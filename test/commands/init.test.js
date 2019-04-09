const fs = require('fs-extra');
const { expect, test } = require('@oclif/test');

const cleanInitFolder = () => {
  if (fs.existsSync('foo')) {
    fs.removeSync('foo');
  }
};

describe('init', () => {
  /* eslint-disable no-undef */
  afterEach(() => {
    cleanInitFolder();
  });
  /* eslint-enable no-undef */

  test
    .command(['init'])
    .exit(2)
    .it('crashes without argument');

  test
    .stdout()
    .command(['init', 'foo'])
    .it('message log appears', ctx => {
      expect(ctx.stdout).to.contain('Run `react-native init foo`');
    });

  test
    .do(() => {
      fs.mkdirSync('foo');
    })
    .stdout()
    .command(['init', 'foo'])
    .exit(1)
    .it('init folder already exists', ctx => {
      expect(ctx.stdout).to.contain('Directory foo already exists.');
    });

  test.command(['init', 'foo']).it('creates foo folder', () => {
    const fooFolderExists = fs.existsSync('foo');
    expect(fooFolderExists).to.equal(true);
  });

  test.command(['init', 'foo']).it('creates correct wl structure', () => {
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

    const rayctlConfig = fs.existsSync('foo/.rayctl/config.json');
    expect(rayctlConfig).to.equal(true);
  });
});
