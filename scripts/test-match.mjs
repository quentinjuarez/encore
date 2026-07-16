// Self-check for the song -> track matching heuristic.
// Run: node --test scripts/test-match.mjs   (or: pnpm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, buildQuery, scoreTrack, pickBestMatch } from '../server/utils/match.ts';

const t = (name, artists, uri = 'u') => ({
  uri,
  name,
  artists: artists.map((n) => ({ name: n })),
  album: { images: [] },
});

test('normalize strips live / remaster noise and accents', () => {
  assert.equal(normalize('Paranoid Android'), 'paranoid android');
  assert.equal(normalize('Creep (Live)'), 'creep');
  assert.equal(normalize('Idioteque - Live at Glastonbury'), 'idioteque');
  assert.equal(normalize('Café del Mar'), 'cafe del mar');
});

test('buildQuery uses Spotify field filters', () => {
  assert.equal(buildQuery('Creep', 'Radiohead'), 'track:Creep artist:Radiohead');
});

test('pickBestMatch prefers the studio cut over a live one', () => {
  const tracks = [t('Creep - Live', ['Radiohead'], 'live'), t('Creep', ['Radiohead'], 'studio')];
  assert.equal(pickBestMatch('Creep', 'Radiohead', tracks)?.uri, 'studio');
});

test('artist agreement outscores a same-title wrong artist', () => {
  const right = scoreTrack('Creep', 'Radiohead', t('Creep', ['Radiohead']));
  const wrong = scoreTrack('Creep', 'Radiohead', t('Creep', ['Stone Temple Pilots']));
  assert.ok(right > wrong, `expected ${right} > ${wrong}`);
});

test('pickBestMatch returns null when there are no candidates', () => {
  assert.equal(pickBestMatch('Creep', 'Radiohead', []), null);
});
