import assert from 'node:assert/strict';
import test from 'node:test';

import { getSpace, getSpaceFromPath } from '../../src/data/spaces.ts';

test('assigns paths to their documentation spaces', () => {
  assert.equal(getSpaceFromPath('/'), 'all');
  assert.equal(getSpaceFromPath('/guide/'), 'hub');
  assert.equal(getSpaceFromPath('/guide/product/changelog/'), 'hub');
  assert.equal(getSpaceFromPath('/betterboard/start/quick-start/'), 'betterboard');
  assert.equal(getSpaceFromPath('/partners/'), 'partners');
  assert.equal(getSpaceFromPath('/guidebook/'), 'all');
  assert.equal(getSpaceFromPath('/betterboarder/'), 'all');
});

test('keeps partner documentation unavailable', () => {
  assert.equal(getSpace('partners').available, false);
});
