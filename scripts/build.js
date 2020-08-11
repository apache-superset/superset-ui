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
  console.log(`>> ${cmd}`);
  const [p, ...args] = cmd.split(' ');
  const runner = spawnSync;
  const { status } = runner(p, args, { stdio: 'inherit' });
  if (status !== 0) {
    process.exit(status);
  }
}

function getPackages(pattern, tsOnly = false) {
  if (pattern === '*' && !tsOnly) {
    return `@superset-ui/!(${[...META_PACKAGES].join('|')})`;
  }
  const packages = [
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
  ];
  if (packages.length === 0) {
    throw new Error('No matching packages');
  }
  return `@superset-ui/${packages.length > 1 ? `{${packages.join(',')}}` : packages[0]}`;
}

if (glob) {
  // lint is slow, so not turning it on by default
  if (extraArgs.includes('--lint')) {
    run(`nimbus eslint {packages,plugins}/${glob}/{src,test}`);
  }
  let scope = getPackages(glob);

  // Clean up
  const cachePath = `./node_modules/${scope}/{lib,esm,tsconfig.tsbuildinfo,node_modules/@types/react}`;
  console.log(`Cleaning up ${cachePath}`);
  rimraf.sync(cachePath);

  if (!extraArgs.includes('--type-only')) {
    run(`lerna exec --stream --concurrency 10 --scope ${scope}
         -- babel ${BABEL_CONFIG} src --extensions ".ts,.tsx,.js,.jsx" --out-dir lib --copy-files`);
  }
  // only run tsc for packages with ts files
  scope = getPackages(glob, true);
  run(`lerna exec --stream --concurrency 3 --scope ${scope} \
       -- tsc --build`);
} else {
  run('yarn build *');
}
