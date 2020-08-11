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

const BABEL_CONFIG = '--config-file=../../babel.config.js';
// packages that do not need tsc
const META_PACKAGES = new Set(['demo', 'generator-superset']);

function run(cmd) {
  // eslint-disable-next-line no-console
  console.log(`>> ${cmd}`);
  const [p, ...args] = cmd.split(' ');
  const runner = spawnSync;
  const { status } = runner(p, args, { stdio: 'inherit' });
  if (status !== 0) {
    process.exit(status);
  }
}

function getPackages(pattern, tsOnly = false) {
  return `(${[
    ...new Set(
      fastGlob
        .sync([
          `./node_modules/@superset-ui/${pattern}/src/**/*.${
            tsOnly ? '{ts,tsx}' : '{ts,tsx,js,jsx}'
          }`,
        ])
        .map(x => x.split('/')[3])
        .filter(x => !META_PACKAGES.has(x)),
    ),
  ].join('|')})`;
}

if (glob) {
  // lint is slow, so not turning it on by default
  if (extraArgs.includes('--lint')) {
    run(`nimbus eslint {packages,plugins}/${glob}/{src,test}`);
  }
  rimraf.sync(
    `./{packages,plugins}/${glob}/{lib,esm,tsconfig.tsbuildinfo,node_modules/@types/react}`,
  );
  let packageNames = getPackages(glob);
  if (!extraArgs.includes('--type-only')) {
    run(`nimbus babel --clean --workspaces="@superset-ui/${packageNames}" ${BABEL_CONFIG}`);
    run(`nimbus babel --clean --workspaces="@superset-ui/${packageNames}" --esm ${BABEL_CONFIG}`);
  }
  // only run tsc for packages with ts files
  packageNames = getPackages(glob, true);
  run(`nimbus typescript --build --workspaces="@superset-ui/${packageNames}"`);
  // eslint-disable-next-line global-require
  require('./copyAssets');
} else {
  run('yarn build *');
}
