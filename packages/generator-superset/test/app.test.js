const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-superset:app', () => {
  beforeAll(() =>
    helpers.run(path.join(__dirname, '../generators/app')).withPrompts({ name: 'my-package' }));

  it('creates files', () => {
    assert.file(['package.json', 'README.md', 'src/index.js', 'test/index.test.js']);
  });
});
