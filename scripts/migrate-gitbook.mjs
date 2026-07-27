#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import fg from 'fast-glob';

import { convertGitBookPage } from './lib/gitbook/blocks.mjs';
import { isFenceClosing, matchFenceOpening } from './lib/gitbook/fences.mjs';
import { mapGitBookPath } from './lib/gitbook/paths.mjs';
import { parseSummary } from './lib/gitbook/summary.mjs';

function parseArguments(argv) {
  const options = {
    source: '.',
    output: 'src/content/docs/guide',
    check: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check') {
      options.check = true;
    } else if (argument === '--source' || argument === '--output') {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a value`);
      options[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function brandReviewEntries(source, sourceFile) {
  const entries = [];
  let fence = null;
  for (const [lineIndex, fullLine] of source.split(/\r?\n/).entries()) {
    if (fence) {
      if (isFenceClosing(fullLine, fence)) fence = null;
      continue;
    }
    const opening = matchFenceOpening(fullLine);
    if (opening) {
      fence = opening;
      continue;
    }

    const withoutInlineCode = fullLine.replace(/(`+).*?\1/g, '');
    const sentences = withoutInlineCode.match(/[^.!?]*Released[^.!?]*(?:[.!?]|$)/g) ?? [];
    for (const value of sentences) {
      const sentence = value.trim();
      if (!sentence) continue;
      entries.push({
        sourceFile,
        line: lineIndex + 1,
        sentence,
        classification: 'review'
      });
    }
  }
  return entries;
}

function writeIfChanged(filePath, value) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath).equals(value)) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function sameFile(filePath, value) {
  return fs.existsSync(filePath) && fs.readFileSync(filePath).equals(value);
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const sourceRoot = path.resolve(options.source);
  const summaryPath = path.join(sourceRoot, 'SUMMARY.md');
  if (!fs.existsSync(summaryPath)) {
    throw new Error(`${summaryPath}:1 Missing SUMMARY.md`);
  }

  const outputRoot = path.isAbsolute(options.output)
    ? path.relative(sourceRoot, options.output)
    : options.output;
  const summary = parseSummary(fs.readFileSync(summaryPath, 'utf8'), {
    outputRoot: outputRoot.split(path.sep).join('/')
  });
  const summaryBySource = new Map(
    summary.map((entry) => [entry.sourcePath, entry])
  );
  const discovered = fg.sync(
    [
      'README.md',
      'getting-started/**/*.md',
      'product/**/*.md',
      'resources/**/*.md',
      'product-tour/**/*.md'
    ],
    {
      cwd: sourceRoot,
      onlyFiles: true,
      unique: true
    }
  ).sort();
  const sourcePaths = [
    ...summary.map((entry) => entry.sourcePath),
    ...discovered.filter((sourcePath) => !summaryBySource.has(sourcePath))
  ];
  const outputOwners = new Map();
  const migrationEntries = sourcePaths.map((sourcePath, index) => {
    const mapped = summaryBySource.get(sourcePath) ??
      {
        ...mapGitBookPath(sourcePath, {
          outputRoot: outputRoot.split(path.sep).join('/')
        }),
        order: index + 1
      };
    const absoluteOutputPath = path.resolve(sourceRoot, mapped.outputPath);
    const owner = outputOwners.get(absoluteOutputPath);
    if (owner) {
      throw new Error(
        `${sourcePath}:1 Duplicate migration destination "${mapped.outputPath}" already claimed by "${owner}"`
      );
    }
    outputOwners.set(absoluteOutputPath, sourcePath);
    return { sourcePath, mapped, absoluteOutputPath };
  });

  const outputs = new Map();
  const assets = new Map();
  const review = [];
  for (const { sourcePath, mapped, absoluteOutputPath } of migrationEntries) {
    const absoluteSourcePath = path.join(sourceRoot, sourcePath);
    if (!fs.existsSync(absoluteSourcePath)) {
      throw new Error(`${sourcePath}:1 Source listed in SUMMARY.md does not exist`);
    }
    const source = fs.readFileSync(absoluteSourcePath, 'utf8');
    const converted = convertGitBookPage(source, {
      sourcePath,
      outputPath: mapped.outputPath,
      order: mapped.order,
      sourceRoot
    });
    for (const warning of converted.warnings) {
      console.warn(
        `${warning.file}:${warning.line} Review converted GitBook construct "${warning.construct}"`
      );
    }
    outputs.set(absoluteOutputPath, Buffer.from(converted.content));
    for (const copy of converted.assetCopies) {
      const assetSource = path.resolve(sourceRoot, copy.sourcePath);
      if (!fs.existsSync(assetSource)) {
        throw new Error(`${sourcePath}:1 Missing local asset ${copy.sourcePath}`);
      }
      assets.set(
        path.resolve(sourceRoot, copy.publicPath),
        fs.readFileSync(assetSource)
      );
    }
    review.push(...brandReviewEntries(source, sourcePath));
  }

  const reportPath = path.join(sourceRoot, 'reports', 'hub-brand-review.json');
  const report = Buffer.from(`${JSON.stringify(review, null, 2)}\n`);
  if (options.check) {
    const stale = [];
    const unexpected = [];
    const unexpectedAssets = [];
    for (const [filePath, value] of [...outputs, ...assets]) {
      if (!sameFile(filePath, value)) {
        stale.push(path.relative(sourceRoot, filePath));
      }
    }
    if (!sameFile(reportPath, report)) {
      stale.push(path.relative(sourceRoot, reportPath));
    }
    const outputDirectory = path.resolve(sourceRoot, outputRoot);
    if (fs.existsSync(outputDirectory)) {
      for (const relativePath of fg.sync(['**/*.md', '**/*.mdx'], {
        cwd: outputDirectory,
        onlyFiles: true,
        unique: true
      })) {
        const filePath = path.resolve(outputDirectory, relativePath);
        if (!outputs.has(filePath)) {
          unexpected.push(path.relative(sourceRoot, filePath));
        }
      }
    }
    const assetOutputDirectory = path.resolve(
      sourceRoot,
      'public/media/hub'
    );
    if (fs.existsSync(assetOutputDirectory)) {
      for (const relativePath of fg.sync('**/*', {
        cwd: assetOutputDirectory,
        onlyFiles: true,
        unique: true
      })) {
        const filePath = path.resolve(assetOutputDirectory, relativePath);
        if (!assets.has(filePath)) {
          unexpectedAssets.push(path.relative(sourceRoot, filePath));
        }
      }
    }
    if (stale.length || unexpected.length || unexpectedAssets.length) {
      for (const filePath of stale) {
        console.error(`${filePath}:1 Generated GitBook output is missing or stale`);
      }
      for (const filePath of unexpected.sort()) {
        console.error(`${filePath}:1 Unexpected generated GitBook output`);
      }
      for (const filePath of unexpectedAssets.sort()) {
        console.error(`${filePath}:1 Unexpected generated GitBook asset`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(`GitBook migration check passed for ${outputs.size} pages.`);
    return;
  }

  for (const [filePath, value] of [...outputs, ...assets]) {
    writeIfChanged(filePath, value);
  }
  writeIfChanged(reportPath, report);
  console.log(
    `Migrated ${outputs.size} GitBook pages and ${assets.size} assets; wrote ${review.length} brand review entries.`
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
