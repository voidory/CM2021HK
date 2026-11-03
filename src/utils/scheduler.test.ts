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

test('selectNextQuestion with rapidIntakeEnabled selects unseen question', () => {
  const pool = [
    { id: 'Q1', primaryTheme: 'Theme 1', academicYear: 'AY21/22' },
    { id: 'Q2', primaryTheme: 'Theme 2', academicYear: 'AY21/22' },
    { id: 'Q3', primaryTheme: 'Theme 3', academicYear: 'AY21/22' }
  ];
  const now = 10000000;
  // Q1 is seen and retained nicely
  const learningStates: Record<string, QuestionLearningState> = {
    Q1: {
      questionId: 'Q1',
      reps: 1,
      lapses: 0,
      stability: 48,
      lastReviewedAt: now - 3600 * 1000,
      nextDueAt: now + 40 * 3600 * 1000,
      history: []
    }
  };

  const chosen = selectNextQuestion(pool, {
    learningStates,
    recentQuestionIds: ['Q1'],
    sessionMistakeQueue: [],
    themeAttemptCounts: { 'Theme 1': 1 },
    totalSessionAttempts: 1,
    rapidIntakeEnabled: true,
    currentTime: now
  });

  // Must pick one of the unseen questions (Q2 or Q3)
  assert.ok(chosen?.id === 'Q2' || chosen?.id === 'Q3');
});

test('selectNextQuestion with rapidIntakeEnabled prioritizes review guard if critically overdue', () => {
  const pool = [
    { id: 'Q1', primaryTheme: 'Theme 1', academicYear: 'AY21/22' },
    { id: 'Q2', primaryTheme: 'Theme 2', academicYear: 'AY21/22' }
  ];
  const now = 10000000;
  // Q1 has lapsed/decayed significantly: elapsed 100h on stability 24h -> R(t) = exp(-100/24) ≈ 0.015 (< 0.70)
  const learningStates: Record<string, QuestionLearningState> = {
    Q1: {
      questionId: 'Q1',
      reps: 1,
      lapses: 1,
      stability: 24,
      lastReviewedAt: now - 100 * 3600 * 1000,
      nextDueAt: now - 50 * 3600 * 1000,
      history: []
    }
    // Q2 is unseen
  };

  const chosen = selectNextQuestion(pool, {
    learningStates,
    recentQuestionIds: [],
    sessionMistakeQueue: [],
    themeAttemptCounts: {},
    totalSessionAttempts: 5,
    rapidIntakeEnabled: true,
    criticalRetentionThreshold: 0.70,
    currentTime: now
  });

  // Because Q1 is critically overdue (R < 0.70), Review Guard triggers to save Q1 from total forgetting
  assert.equal(chosen?.id, 'Q1');
});

