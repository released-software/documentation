#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import fg from 'fast-glob';

import { convertGitBookPage } from './lib/gitbook/blocks.mjs';
import { isFenceClosing, matchFenceOpening } from './lib/gitbook/fences.mjs';
import { mapGitBookPath } from './lib/gitbook/paths.mjs';
import { parseSummary } from './lib/gitbook/summary.mjs';

const brandClassifications = new Set([
  'review',
  'change display copy to Hub',
  'retain product/marketplace name',
  'retain code/config/API/asset identifier',
  'retain historical usage'
]);

function parseArguments(argv) {
  const options = {
    source: '.',
    output: 'src/content/docs/guide',
    manifest: null,
    check: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check') {
      options.check = true;
    } else if (
      argument === '--source' ||
      argument === '--output' ||
      argument === '--manifest'
    ) {
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

    const withoutInlineCode = fullLine.replace(
      /(`+).*?\1/g,
      (value) => ' '.repeat(value.length)
    );
    const sentences = withoutInlineCode.matchAll(
      /[^.!?]*Released[^.!?]*(?:[.!?]|$)/g
    );
    for (const match of sentences) {
      const leadingWhitespace = match[0].match(/^\s*/)?.[0].length ?? 0;
      const trailingWhitespace = match[0].match(/\s*$/)?.[0].length ?? 0;
      const start = (match.index ?? 0) + leadingWhitespace;
      const end = (match.index ?? 0) + match[0].length - trailingWhitespace;
      const sentence = fullLine.slice(start, end);
      if (!sentence) continue;
      const maskedSentence = withoutInlineCode.slice(start, end);
      for (const occurrence of maskedSentence.matchAll(/\bReleased\b/g)) {
        entries.push({
          sourceFile,
          line: lineIndex + 1,
          column: start + (occurrence.index ?? 0) + 1,
          sentence,
          classification: 'review'
        });
      }
    }
  }
  return entries;
}

function brandDecisionKey({ sourceFile, line, column, sentence }) {
  return JSON.stringify([sourceFile, line, column, sentence]);
}

function loadBrandDecisions(reportPath) {
  if (!fs.existsSync(reportPath)) return new Map();

  const entries = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  return new Map(entries.map((entry) => {
    if (!brandClassifications.has(entry.classification)) {
      throw new Error(
        `${entry.sourceFile}:${entry.line} Unknown brand classification "${entry.classification}"`
      );
    }
    return [brandDecisionKey(entry), entry];
  }));
}

function applyBrandDecisions(source, entries) {
  const lines = source.split(/\r?\n/);
  const displayChanges = entries
    .filter((entry) => entry.classification === 'change display copy to Hub')
    .sort((left, right) => right.line - left.line || right.column - left.column);
  for (const entry of displayChanges) {
    if (!entry.replacement) {
      throw new Error(
        `${entry.sourceFile}:${entry.line} Display-copy brand decision requires a replacement`
      );
    }

    const lineIndex = entry.line - 1;
    const columnIndex = entry.column - 1;
    if (lines[lineIndex]?.slice(columnIndex, columnIndex + 'Released'.length) !== 'Released') {
      throw new Error(
        `${entry.sourceFile}:${entry.line} Brand-review occurrence no longer matches its source column`
      );
    }
    lines[lineIndex] =
      lines[lineIndex].slice(0, columnIndex) +
      entry.replacement +
      lines[lineIndex].slice(columnIndex + 'Released'.length);
  }
  return lines.join('\n');
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function countFencedCodeBlocks(source) {
  let count = 0;
  let fence = null;
  for (const line of source.split(/\r?\n/)) {
    if (fence) {
      if (isFenceClosing(line, fence)) fence = null;
      continue;
    }
    const opening = matchFenceOpening(line);
    if (opening) {
      count += 1;
      fence = opening;
    }
  }
  return count;
}

function convertedConstructCounts(outputs) {
  const counts = {
    neutralCallouts: 0,
    steps: 0,
    tabs: 0,
    tabItems: 0,
    linkRows: 0,
    responsiveEmbeds: 0,
    figures: 0,
    tables: 0,
    details: 0,
    codeBlocks: 0
  };

  for (const value of outputs.values()) {
    const source = value.toString('utf8');
    counts.neutralCallouts += countMatches(source, /<NeutralCallout\b/g);
    counts.steps += countMatches(source, /<Steps>/g);
    counts.tabs += countMatches(source, /<Tabs>/g);
    counts.tabItems += countMatches(source, /<TabItem\b/g);
    counts.linkRows += countMatches(source, /<LinkRow\b/g);
    counts.responsiveEmbeds += countMatches(source, /<ResponsiveEmbed\b/g);
    counts.figures += countMatches(source, /<Figure\b/g);
    counts.tables += countMatches(source, /<table\b/g);
    counts.details += countMatches(source, /<details\b/g);
    counts.codeBlocks += countFencedCodeBlocks(source);
  }

  return counts;
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
  if (options.manifest) {
    const manifestPath = path.isAbsolute(options.manifest)
      ? options.manifest
      : path.resolve(sourceRoot, options.manifest);
    writeIfChanged(
      manifestPath,
      Buffer.from(`${JSON.stringify(summary.map(({ route }) => route), null, 2)}\n`)
    );
    console.log(`Wrote ${summary.length} legacy Hub routes.`);
    return;
  }
  const reportPath = path.join(sourceRoot, 'reports', 'hub-brand-review.json');
  const brandDecisions = loadBrandDecisions(reportPath);
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
  const genericEmbedReviewWarnings = [];
  for (const { sourcePath, mapped, absoluteOutputPath } of migrationEntries) {
    const absoluteSourcePath = path.join(sourceRoot, sourcePath);
    if (!fs.existsSync(absoluteSourcePath)) {
      throw new Error(`${sourcePath}:1 Source listed in SUMMARY.md does not exist`);
    }
    const source = fs.readFileSync(absoluteSourcePath, 'utf8');
    const sourceReview = brandReviewEntries(source, sourcePath).map((entry) => {
      const decision = brandDecisions.get(brandDecisionKey(entry));
      return decision
        ? {
            ...entry,
            classification: decision.classification,
            ...(decision.replacement ? { replacement: decision.replacement } : {})
          }
        : entry;
    });
    const converted = convertGitBookPage(
      applyBrandDecisions(source, sourceReview),
      {
      sourcePath,
      outputPath: mapped.outputPath,
      order: mapped.order,
      sourceRoot
      }
    );
    for (const warning of converted.warnings) {
      genericEmbedReviewWarnings.push(warning);
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
    review.push(...sourceReview);
  }

  const report = Buffer.from(`${JSON.stringify(review, null, 2)}\n`);
  const migrationSummaryPath = path.join(
    sourceRoot,
    'reports',
    'hub-migration-summary.json'
  );
  const previousSummary = fs.existsSync(migrationSummaryPath)
    ? JSON.parse(fs.readFileSync(migrationSummaryPath, 'utf8'))
    : {};
  const classificationCounts = Object.fromEntries(
    [...brandClassifications].map((classification) => [
      classification,
      review.filter((entry) => entry.classification === classification).length
    ])
  );
  const migrationSummary = Buffer.from(
    `${JSON.stringify(
      {
        sourcePageCount: migrationEntries.length,
        outputPageCount: outputs.size,
        referencedAssetCount: assets.size,
        convertedConstructCounts: convertedConstructCounts(outputs),
        droppedConstructCount: 0,
        brandClassificationCounts: classificationCounts,
        genericEmbedReviewWarnings,
        deliberateTransformations: previousSummary.deliberateTransformations ?? [],
        representativeContentReviews:
          previousSummary.representativeContentReviews ?? []
      },
      null,
      2
    )}\n`
  );
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
    if (!sameFile(migrationSummaryPath, migrationSummary)) {
      stale.push(path.relative(sourceRoot, migrationSummaryPath));
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
        dot: true,
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
  writeIfChanged(migrationSummaryPath, migrationSummary);
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
