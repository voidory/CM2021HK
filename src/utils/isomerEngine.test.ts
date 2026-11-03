import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ISOMER_PROFILES,
  ISOMER_COUNT_QUESTION_IDS,
  QUESTION_ISOMER_COUNT_MAP,
  isIsomerCountQuestion,
  getIsomerProfileForQuestion
} from './isomerEngine';

test('ISOMER_PROFILES contains all core coordination geometries from voidory/isomers', () => {
  const geometries = new Set(Object.values(ISOMER_PROFILES).map(p => p.geometry));
  assert.ok(geometries.has('Octahedral'));
  assert.ok(geometries.has('Square Planar'));
  assert.ok(geometries.has('Tetrahedral'));
});

test('oh-ma4b2 profile defines exactly 2 geometrical isomers and achiral symmetry', () => {
  const p = ISOMER_PROFILES['oh-ma4b2'];
  assert.equal(p.geometricCount, 2);
  assert.equal(p.opticalPairs, 0);
  assert.equal(p.totalStereoisomers, 2);
  assert.equal(p.symmetrySummary.isChiral, false);
});

test('oh-maa2b2 defines 3 stereoisomers including trans (achiral) and cis (chiral)', () => {
  const p = ISOMER_PROFILES['oh-maa2b2'];
  assert.equal(p.totalStereoisomers, 3);
  assert.equal(p.opticalPairs, 1);
  const transIsomer = p.isomers.find(i => i.id === 'trans');
  const cisIsomers = p.isomers.filter(i => i.id.startsWith('cis'));
  assert.ok(transIsomer && !transIsomer.isChiral);
  assert.equal(cisIsomers.length, 2);
  assert.ok(cisIsomers.every(i => i.isChiral));
});

test('Square planar sp-mabcd defines 3 geometrical and 12 total with linkage', () => {
  const p = ISOMER_PROFILES['sp-mabcd'];
  assert.equal(p.geometricCount, 3);
  assert.equal(p.totalStereoisomers, 12);
  assert.equal(p.linkageMultiplier, 4);
});

test('Strictly restricts isomer explanations to explicit isomer count questions', () => {
  // Non-counting questions must return null
  assert.equal(getIsomerProfileForQuestion('AY21_22_Q04'), null);
  assert.equal(getIsomerProfileForQuestion('AY21_22_Q12'), null);
  assert.equal(getIsomerProfileForQuestion('AY21_22_Q14'), null);
  assert.equal(getIsomerProfileForQuestion('AY21_22_Q15'), null);
  assert.equal(getIsomerProfileForQuestion('AY21_22_Q19'), null);
  assert.equal(getIsomerProfileForQuestion('AY23_24_Q04'), null);
  assert.equal(getIsomerProfileForQuestion('AY25_26_Q04'), null);

  // All 16 counting questions must return valid profiles
  assert.equal(ISOMER_COUNT_QUESTION_IDS.size, 16);
  for (const qid of ISOMER_COUNT_QUESTION_IDS) {
    const profile = getIsomerProfileForQuestion(qid);
    assert.ok(profile !== null, `Question ${qid} should resolve to a valid counting profile`);
    assert.ok(profile.totalStereoisomers >= 1);
    assert.ok(profile.sketchbookInsight.length > 10);
  }
});
