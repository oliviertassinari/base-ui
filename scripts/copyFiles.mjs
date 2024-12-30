/* eslint-disable no-console */
import path from 'path';
import fs from 'fs/promises';
import { $ } from 'execa';
import { includeFileInBuild, prepend, typescriptCopy } from './copyFilesUtils.mjs';

const $$ = $({ stdio: 'inherit' });

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './build');
const srcPath = path.join(packagePath, './src');

async function addLicense(packageData) {
  const license = `/**
 * ${packageData.name} v${packageData.version}
 *
 * @license ${packageData.license}
 * This source code is licensed under the ${packageData.license} license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;
  await Promise.all(
    ['./cjs/index.js', './esm/index.js'].map(async (file) => {
      try {
        await prepend(path.resolve(buildPath, file), license);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`Skipped license for ${file}`);
        } else {
          throw err;
        }
      }
    }),
  );
}

async function removeBuildArtefacts() {
  await $$`rimraf --glob ${buildPath}/*.tsbuildinfo`;
}

async function run() {
  const extraFiles = process.argv.slice(2);
  try {
    // TypeScript
    await typescriptCopy({ from: srcPath, to: buildPath });

    await Promise.all(
      ['./README.md', '../../CHANGELOG.md', '../../LICENSE', ...extraFiles].map(async (file) => {
        const [sourcePath, targetPath] = file.split(':');
        await includeFileInBuild(sourcePath, targetPath);
      }),
    );

    const packageFile = await fs.readFile(path.resolve(packagePath, './package.json'), { encoding: 'utf-8' });
    const packageData = JSON.parse(packageFile);
    await addLicense(packageData);
    await removeBuildArtefacts();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
