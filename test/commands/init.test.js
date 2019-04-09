const { expect, test } = require('@oclif/test');

describe('init', () => {
  test
    .command(['init'])
    .exit(2)
    .it('crashes without argument');

  test
    .stdout()
    .command(['init', 'foo'])
    .it('crashes without argument', ctx => {
      expect(ctx.stdout).to.contain('Run `react-native init foo`');
    });
});
