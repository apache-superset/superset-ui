#!/bin/env node
/**
 * Build plugins specified by globs
 */
const rimraf = require('rimraf');
const { spawnSync } = require('child_process');
const fastGlob = require('fast-glob');

const glob = process.argv[2];
const extraArgs = process.argv.slice(2);

process.env.PATH = `./node_modules/.bin:${process.env.PATH}`;

// packages that do not need tsc
const metaPackages = new Set(['demo', 'generator-superset']);

const run = cmd => {
  // eslint-disable-next-line no-console
  console.log(`>> ${cmd}`);
  const [p, ...args] = cmd.split(' ');
  const runner = spawnSync;
  const { status } = runner(p, args, { stdio: 'inherit' });
  if (status !== 0) {
    process.exit(status);
  }
};

const BABEL_CONFIG = '--config-file=../../babel.config.js';

if (glob) {
  // lint is slow, so not turning it on by default
  if (extraArgs.includes('--lint')) {
    run(`nimbus eslint {packages,plugins}/${glob}/{src,test}`);
  }
  rimraf.sync(
    `./{packages,plugins}/${glob}/{lib,esm,tsconfig.tsbuildinfo,node_modules/@types/react}`,
  );
  let packageName = glob.replace(/^superset-ui-/, '');
  if (!extraArgs.includes('--type-only')) {
    run(`nimbus babel --clean --workspaces="@superset-ui/${packageName}" ${BABEL_CONFIG}`);
    run(`nimbus babel --clean --workspaces="@superset-ui/${packageName}" --esm ${BABEL_CONFIG}`);
  }
  // only build for packages with ts files
  packageName = `(${[
    ...new Set(
      fastGlob
        .sync([`./node_modules/@superset-ui/${glob}/src/**/*.ts`])
        .map(x => x.split('/')[3])
        .filter(x => !metaPackages.has(x)),
    ),
  ].join('|')})`;
  run(`nimbus typescript --build --workspaces="@superset-ui/${packageName}"`);
  // eslint-disable-next-line global-require
  require('./copyAssets');
} else {
  run('yarn babel');
  run('yarn type');
  run('yarn build:assets');
}
