#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import { convertGitBookPage } from './lib/gitbook/blocks.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const sourcePath = 'tests/fixtures/gitbook/all-content-components.md';
const outputPath =
  'src/content/docs/component-tests/generated-content-components.mdx';
const source = fs.readFileSync(path.join(repositoryRoot, sourcePath), 'utf8');
const converted = convertGitBookPage(source, {
  sourcePath,
  outputPath,
  order: 999,
  sourceRoot: repositoryRoot
});

if (converted.assetCopies.length || converted.warnings.length) {
  throw new Error(
    'The content component fixture must not create migration assets or review warnings'
  );
}

const absoluteOutputPath = path.join(repositoryRoot, outputPath);
if (process.argv[2] === '--check') {
  const current = fs.existsSync(absoluteOutputPath)
    ? fs.readFileSync(absoluteOutputPath, 'utf8')
    : null;
  if (current !== converted.content) {
    console.error(`${outputPath}:1 Generated content component fixture is missing or stale`);
    process.exitCode = 1;
  } else {
    console.log('Generated content component fixture is current.');
  }
} else if (process.argv.length > 2) {
  throw new Error(`Unknown argument: ${process.argv[2]}`);
} else {
  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
  fs.writeFileSync(absoluteOutputPath, converted.content);
  console.log(`Generated ${outputPath}.`);
}
