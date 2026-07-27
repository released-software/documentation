import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeResponsiveEmbed
} from '../../src/components/content/responsive-embed.mjs';

test('normalizes canonical YouTube and Loom sources', () => {
  assert.deepEqual(
    normalizeResponsiveEmbed({
      src: 'https://youtu.be/Ll1hArmqOAg',
      title: '  YouTube demo  ',
      provider: 'youtube'
    }),
    {
      embedSrc: 'https://www.youtube-nocookie.com/embed/Ll1hArmqOAg',
      title: 'YouTube demo',
      aspectRatio: '16 / 9'
    }
  );

  assert.deepEqual(
    normalizeResponsiveEmbed({
      src: 'https://www.loom.com/share/e972f54ef3644aa78b822b2cbf573e14',
      title: 'Loom demo',
      provider: 'loom',
      aspectRatio: '4/3'
    }),
    {
      embedSrc: 'https://www.loom.com/embed/e972f54ef3644aa78b822b2cbf573e14',
      title: 'Loom demo',
      aspectRatio: '4 / 3'
    }
  );
});

test('rejects non-canonical YouTube and Loom media IDs', () => {
  for (const src of [
    'https://youtu.be/abcdef',
    'https://youtu.be/Ll1hArmqOAgx',
    'https://www.youtube.com/watch?v=too-short',
    'https://www.loom.com/share/e972f54ef3644aa7',
    'https://www.loom.com/share/e972f54ef3644aa78b822b2cbf573e1',
    'https://www.loom.com/share/E972F54EF3644AA78B822B2CBF573E14',
    'https://www.loom.com/share/e972f54ef3644aa78b822b2cbf573e140'
  ]) {
    const provider = src.includes('loom.com') ? 'loom' : 'youtube';
    assert.throws(
      () => normalizeResponsiveEmbed({ src, title: 'Demo', provider }),
      /valid (?:YouTube|Loom) video ID/
    );
  }
});

test('rejects provider and hostname mismatches', () => {
  assert.throws(
    () =>
      normalizeResponsiveEmbed({
        src: 'https://www.loom.com/share/e972f54ef3644aa78b822b2cbf573e14',
        title: 'Demo',
        provider: 'youtube'
      }),
    /provider "youtube" does not allow hostname "www\.loom\.com"/
  );
  assert.throws(
    () =>
      normalizeResponsiveEmbed({
        src: 'https://youtu.be/Ll1hArmqOAg',
        title: 'Demo',
        provider: 'loom'
      }),
    /provider "loom" does not allow hostname "youtu\.be"/
  );
  assert.throws(
    () =>
      normalizeResponsiveEmbed({
        src: 'https://youtube.com.example.test/watch?v=Ll1hArmqOAg',
        title: 'Demo',
        provider: 'youtube'
      }),
    /does not allow hostname/
  );
});

test('rejects credentials and non-HTTPS protocols', () => {
  assert.throws(
    () =>
      normalizeResponsiveEmbed({
        src: 'https://user:secret@youtu.be/Ll1hArmqOAg',
        title: 'Demo',
        provider: 'youtube'
      }),
    /standard HTTPS URL without credentials/
  );
  assert.throws(
    () =>
      normalizeResponsiveEmbed({
        src: 'http://youtu.be/Ll1hArmqOAg',
        title: 'Demo',
        provider: 'youtube'
      }),
    /standard HTTPS URL without credentials/
  );
});

test('rejects invalid and non-positive aspect ratios', () => {
  for (const aspectRatio of ['16', '0/9', '16/0', '-1/2', '1/-2', 'NaN/1']) {
    assert.throws(
      () =>
        normalizeResponsiveEmbed({
          src: 'https://youtu.be/Ll1hArmqOAg',
          title: 'Demo',
          provider: 'youtube',
          aspectRatio
        }),
      /invalid aspect ratio/
    );
  }
});

test('rejects empty and whitespace-only iframe titles', () => {
  for (const title of ['', '   ', '\n\t']) {
    assert.throws(
      () =>
        normalizeResponsiveEmbed({
          src: 'https://youtu.be/Ll1hArmqOAg',
          title,
          provider: 'youtube'
        }),
      /non-empty title/
    );
  }
});
