/**
 * Adaptive Spaced-Repetition Scheduler
 * Based on exponential forgetting model:
 *   R_i(t) = exp(-Δt / S_i)
 *   due_interval = -S_i * ln(r)
 */

export interface QuestionLearningState {
  questionId: string;
  reps: number;
  lapses: number;
  stability: number; // in hours
  lastReviewedAt: number | null; // epoch timestamp ms
  nextDueAt: number | null; // epoch timestamp ms
  history: {
    timestamp: number;
    selectedOption: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
  }[];
}

export interface SchedulerConfig {
  targetRetention: number; // default 0.85
  initialStabilityHours: number; // default 24 hours
  minStabilityHours: number; // default 4 hours
  maxStabilityHours: number; // default 8760 hours (1 year)
  correctGrowthMultiplier: number; // default 2.2
  lapseDecayMultiplier: number; // default 0.35
  relearningInterveningQuestions: number; // default 3
}

export const DEFAULT_CONFIG: SchedulerConfig = {
  targetRetention: 0.85,
  initialStabilityHours: 24,
  minStabilityHours: 4,
  maxStabilityHours: 8760,
  correctGrowthMultiplier: 2.2,
  lapseDecayMultiplier: 0.35,
  relearningInterveningQuestions: 3
};

/**
 * Calculates estimated retention R_i(t) = exp(-Δt / S_i)
 * Returns a value in [0, 1], or null if unseen.
 */
export function calculateRetention(
  lastReviewedAt: number | null,
  stabilityHours: number,
  currentTime: number = Date.now()
): number | null {
  if (!lastReviewedAt || stabilityHours <= 0) return null;
  const elapsedHours = Math.max(0, (currentTime - lastReviewedAt) / (1000 * 60 * 60));
  return Math.exp(-elapsedHours / stabilityHours);
}

/**
 * Calculates interval until retention drops to target r:
 * interval = -S_i * ln(r)
 */
export function calculateDueIntervalHours(
  stabilityHours: number,
  targetRetention: number = DEFAULT_CONFIG.targetRetention
): number {
  if (targetRetention <= 0 || targetRetention >= 1) {
    targetRetention = 0.85;
  }
  const factor = -Math.log(targetRetention);
  return Math.max(0.25, stabilityHours * factor);
}

/**
 * Updates question state after an answer attempt
 */
export function updateQuestionState(
  currentState: QuestionLearningState | undefined,
  questionId: string,
  selectedOption: 'A' | 'B' | 'C' | 'D',
  isCorrect: boolean,
  currentTime: number = Date.now(),
  config: SchedulerConfig = DEFAULT_CONFIG
): QuestionLearningState {
  const previousState: QuestionLearningState = currentState || {
    questionId,
    reps: 0,
    lapses: 0,
    stability: config.initialStabilityHours,
    lastReviewedAt: null,
    nextDueAt: null,
    history: []
  };

  const newHistory = [
    ...previousState.history,
    { timestamp: currentTime, selectedOption, isCorrect }
  ];

  let newStability: number;
  let newLapses = previousState.lapses;
  let newReps = previousState.reps + 1;

  if (isCorrect) {
    if (previousState.lastReviewedAt === null) {
      // First attempt correct
      newStability = config.initialStabilityHours;
    } else {
      // Subsequent correct review
      newStability = Math.min(
        config.maxStabilityHours,
        previousState.stability * config.correctGrowthMultiplier
      );
    }
  } else {
    // Lapse (incorrect answer)
    newLapses += 1;
    newStability = Math.max(
      config.minStabilityHours,
      previousState.stability * config.lapseDecayMultiplier
    );
  }

  const intervalHours = calculateDueIntervalHours(newStability, config.targetRetention);
  const nextDueAt = currentTime + intervalHours * 3600 * 1000;

  return {
    questionId,
    reps: newReps,
    lapses: newLapses,
    stability: newStability,
    lastReviewedAt: currentTime,
    nextDueAt,
    history: newHistory
  };
}

export interface SelectorContext {
  learningStates: Record<string, QuestionLearningState>;
  recentQuestionIds: string[]; // FIFO buffer of recently answered question IDs
  sessionMistakeQueue: { questionId: string; questionsSinceLapse: number }[];
  themeAttemptCounts: Record<string, number>;
  totalSessionAttempts: number;
  currentTime?: number;
  config?: SchedulerConfig;
  rapidIntakeEnabled?: boolean;
  criticalRetentionThreshold?: number; // default 0.70
}

export interface SelectableQuestion {
  id: string;
  primaryTheme: string;
  academicYear: string;
}

/**
 * Hybrid adaptive question selector
 */
export function selectNextQuestion<T extends SelectableQuestion>(
  pool: T[],
  context: SelectorContext
): T | null {
  if (!pool || pool.length === 0) return null;
  if (pool.length === 1) return pool[0];

  const now = context.currentTime ?? Date.now();
  const config = context.config ?? DEFAULT_CONFIG;
  const recentExclusionWindow = Math.min(4, Math.max(1, pool.length - 2));
  const recentSet = new Set(context.recentQuestionIds.slice(-recentExclusionWindow));

  // Check session mistake queue for relearning items ready to be re-tested
  const readyRelearning = context.sessionMistakeQueue.find(
    item =>
      item.questionsSinceLapse >= config.relearningInterveningQuestions &&
      pool.some(q => q.id === item.questionId) &&
      !recentSet.has(item.questionId)
  );

  if (readyRelearning) {
    const match = pool.find(q => q.id === readyRelearning.questionId);
    if (match) return match;
  }

  // Rapid Intake Mode: Accelerate unseen questions while mathematically protecting retention
  if (context.rapidIntakeEnabled) {
    const criticalThreshold = context.criticalRetentionThreshold ?? 0.70;

    // 1. Review Guard: Check if any reviewed question in the pool is critically overdue (R < threshold)
    const criticallyOverdueCandidates: { question: T; retention: number }[] = [];
    for (const q of pool) {
      if (recentSet.has(q.id) && pool.length > recentExclusionWindow) continue;
      const s = context.learningStates[q.id];
      if (s && s.lastReviewedAt !== null && s.nextDueAt !== null && now >= s.nextDueAt) {
        const ret = calculateRetention(s.lastReviewedAt, s.stability, now) ?? 1.0;
        if (ret < criticalThreshold) {
          criticallyOverdueCandidates.push({ question: q, retention: ret });
        }
      }
    }

    if (criticallyOverdueCandidates.length > 0) {
      // Prioritize the card with the lowest retention to guard against severe forgetting
      criticallyOverdueCandidates.sort((a, b) => a.retention - b.retention);
      return criticallyOverdueCandidates[0].question;
    }

    // 2. Unseen Acceleration: Pick from remaining unseen questions with balanced theme exploration
    const unseenCandidates = pool.filter(q => {
      const s = context.learningStates[q.id];
      return !s || s.lastReviewedAt === null;
    });

    if (unseenCandidates.length > 0) {
      const nonRecentUnseen = unseenCandidates.filter(q => !recentSet.has(q.id));
      const targetUnseenPool = nonRecentUnseen.length > 0 ? nonRecentUnseen : unseenCandidates;

      const totalThemeAttempts = Object.values(context.themeAttemptCounts).reduce((a, b) => a + b, 0);
      const scoredUnseen: { question: T; weight: number }[] = [];

      for (const q of targetUnseenPool) {
        const themeAttempts = context.themeAttemptCounts[q.primaryTheme] || 0;
        const themeRatio = totalThemeAttempts > 0 ? themeAttempts / totalThemeAttempts : 0;
        const weight = 10.0 + Math.max(0, (0.25 - themeRatio) * 20);
        scoredUnseen.push({ question: q, weight });
      }

      const totalWeight = scoredUnseen.reduce((sum, item) => sum + item.weight, 0);
      let rand = Math.random() * totalWeight;
      for (const item of scoredUnseen) {
        rand -= item.weight;
        if (rand <= 0) return item.question;
      }
      return scoredUnseen[scoredUnseen.length - 1].question;
    }
    // If no unseen questions remain in pool, continue to standard adaptive distribution
  }

  // Calculate weights for candidates
  const scoredCandidates: { question: T; weight: number }[] = [];

  // Find theme exploration statistics
  const totalThemeAttempts = Object.values(context.themeAttemptCounts).reduce((a, b) => a + b, 0);

  for (const q of pool) {
    // Don't immediately repeat recently shown questions if there are other candidates
    if (recentSet.has(q.id) && pool.length > recentExclusionWindow) {
      continue;
    }

    const state = context.learningStates[q.id];
    let weight = 1.0;

    if (!state || state.lastReviewedAt === null) {
      // Unseen question: steady introduction weight
      weight = 8.0;
      // Under-practised theme bonus
      const themeAttempts = context.themeAttemptCounts[q.primaryTheme] || 0;
      const themeRatio = totalThemeAttempts > 0 ? themeAttempts / totalThemeAttempts : 0;
      weight += Math.max(0, (0.25 - themeRatio) * 16);
    } else {
      const retention = calculateRetention(state.lastReviewedAt, state.stability, now) ?? 1.0;
      const isOverdue = state.nextDueAt !== null && now >= state.nextDueAt;

      if (isOverdue) {
        // High priority for overdue cards, increasing as retention falls
        weight = 12.0 + (1.0 - retention) * 20.0;
      } else if (retention < config.targetRetention) {
        // Near due
        weight = 7.0 + (config.targetRetention - retention) * 15.0;
      } else {
        // Already well-retained; low weight, but not zero so small pools don't stall
        weight = Math.max(0.5, (1.0 - retention) * 3.0);
      }

      // Add lapse weight for questions the user struggled with in the past
      if (state.lapses > 0) {
        weight += Math.min(8.0, state.lapses * 2.5);
      }
    }

    scoredCandidates.push({ question: q, weight: Math.max(0.1, weight) });
  }

  // Fallback if all candidates were excluded by recentSet
  if (scoredCandidates.length === 0) {
    const fallbackQ = pool.find(q => q.id !== context.recentQuestionIds[context.recentQuestionIds.length - 1]) || pool[0];
    return fallbackQ;
  }

  // Weighted random selection
  const totalWeight = scoredCandidates.reduce((sum, item) => sum + item.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const item of scoredCandidates) {
    randomVal -= item.weight;
    if (randomVal <= 0) {
      return item.question;
    }
  }

  return scoredCandidates[scoredCandidates.length - 1].question;
}
