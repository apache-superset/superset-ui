/* eslint-disable sort-keys */

const Generator = require('yeoman-generator');
const _ = require('lodash');

module.exports = class extends Generator {
  async prompting() {
    this.option('skipInstall');

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name:',
        // Default to current folder name
        default: _.kebabCase(this.appname.replace('plugin chart', '').trim()),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        // Default to current folder name
        default: _.upperFirst(_.startCase(this.appname.replace('plugin chart', '').trim())),
      },
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.answers,
    );

    const packageLabel = _.upperFirst(_.camelCase(this.answers.packageName));

    const params = {
      ...this.answers,
      packageLabel,
    };

    [
      ['_README.md', 'README.md'],
      ['test/_index.test.ts', 'test/index.test.ts'],
    ].map(([src, dest]) => {
      this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), params);
    });
  }
};
