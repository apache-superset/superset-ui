const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-superset:package', () => {
  let dir;

  beforeAll(() => {
    dir = process.cwd();

    return helpers
      .run(path.join(__dirname, '../generators/package'))
      .withPrompts({ name: 'my-package' })
      .withOptions({ skipInstall: true });
  });

  it('creates files', () => {
    assert.file(['package.json', 'README.md', 'src/index.js', 'test/index.test.js']);
  });

  afterAll(() => {
    process.chdir(dir);
  });
});
