import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRetention,
  calculateDueIntervalHours,
  updateQuestionState,
  selectNextQuestion,
  DEFAULT_CONFIG,
  type QuestionLearningState
} from './scheduler';

test('calculateRetention returns null for unseen question', () => {
  assert.equal(calculateRetention(null, 24), null);
});

test('calculateRetention computes correct exponential decay', () => {
  const now = 10000000;
  const halfLifeElapsed = now + 24 * 3600 * 1000; // 24 hours elapsed
  const ret = calculateRetention(now, 24, halfLifeElapsed);
  assert.ok(ret !== null);
  // exp(-24/24) = exp(-1) ≈ 0.367879
  assert.ok(Math.abs(ret - Math.exp(-1)) < 0.001);
});

test('calculateDueIntervalHours respects target retention', () => {
  // due_interval = -S * ln(r)
  // For S = 24h, r = 0.85: -24 * ln(0.85) ≈ 3.9004 h
  const interval = calculateDueIntervalHours(24, 0.85);
  const expected = -24 * Math.log(0.85);
  assert.ok(Math.abs(interval - expected) < 0.01);
});

test('updateQuestionState increases stability on correct answer', () => {
  const t0 = 1000000;
  const state1 = updateQuestionState(undefined, 'Q1', 'B', true, t0);
  assert.equal(state1.reps, 1);
  assert.equal(state1.lapses, 0);
  assert.equal(state1.stability, DEFAULT_CONFIG.initialStabilityHours);

  // Review after some time, answered correctly again
  const t1 = t0 + 4 * 3600 * 1000;
  const state2 = updateQuestionState(state1, 'Q1', 'B', true, t1);
  assert.equal(state2.reps, 2);
  assert.equal(state2.lapses, 0);
  assert.equal(state2.stability, state1.stability * DEFAULT_CONFIG.correctGrowthMultiplier);
});

test('updateQuestionState decreases stability and logs lapse on incorrect answer', () => {
  const t0 = 1000000;
  const state1 = updateQuestionState(undefined, 'Q1', 'B', true, t0);
  const t1 = t0 + 4 * 3600 * 1000;
  const state2 = updateQuestionState(state1, 'Q1', 'A', false, t1);
  assert.equal(state2.reps, 2);
  assert.equal(state2.lapses, 1);
  assert.ok(state2.stability < state1.stability);
});

test('selectNextQuestion returns single question when pool has size 1', () => {
  const pool = [{ id: 'Q1', primaryTheme: 'Isomerism', academicYear: 'AY21/22' }];
  const chosen = selectNextQuestion(pool, {
    learningStates: {},
    recentQuestionIds: [],
    sessionMistakeQueue: [],
    themeAttemptCounts: {},
    totalSessionAttempts: 0
  });
  assert.equal(chosen?.id, 'Q1');
});

test('selectNextQuestion prioritizes session relearning items after threshold', () => {
  const pool = [
    { id: 'Q1', primaryTheme: 'Theme 1', academicYear: 'AY21/22' },
    { id: 'Q2', primaryTheme: 'Theme 2', academicYear: 'AY21/22' },
    { id: 'Q3', primaryTheme: 'Theme 3', academicYear: 'AY21/22' },
    { id: 'Q4', primaryTheme: 'Theme 4', academicYear: 'AY21/22' }
  ];
  const chosen = selectNextQuestion(pool, {
    learningStates: {},
    recentQuestionIds: ['Q1', 'Q2', 'Q3'],
    sessionMistakeQueue: [{ questionId: 'Q4', questionsSinceLapse: 3 }],
    themeAttemptCounts: {},
    totalSessionAttempts: 3
  });
  assert.equal(chosen?.id, 'Q4');
});
