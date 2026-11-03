/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QUESTIONS, Question, ThemeName } from './data/questions';
import {
  QuestionLearningState,
  updateQuestionState,
  selectNextQuestion,
  DEFAULT_CONFIG,
  SchedulerConfig
} from './utils/scheduler';
import {
  loadStoredData,
  saveStoredData,
  StoredAppData
} from './utils/storage';
import { CloudBackground } from './components/CloudBackground';
import { Header } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { ProgressPanel } from './components/ProgressPanel';
import { SourceAuditModal } from './components/SourceAuditModal';
import { PeriodicTableModal } from './components/PeriodicTableModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Stored state
  const [learningStates, setLearningStates] = useState<Record<string, QuestionLearningState>>({});
  const [targetRetention, setTargetRetention] = useState<number>(DEFAULT_CONFIG.targetRetention);
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [activeYearFilter, setActiveYearFilter] = useState<string>('ALL');
  const [activeThemeFilter, setActiveThemeFilter] = useState<string>('ALL');

  // Session state
  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([]);
  const [sessionMistakeQueue, setSessionMistakeQueue] = useState<
    { questionId: string; questionsSinceLapse: number }[]
  >([]);
  const [sessionAttempts, setSessionAttempts] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);

  // Active quiz state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<('A' | 'B' | 'C' | 'D') | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Modals state
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);
  const [isPeriodicOpen, setIsPeriodicOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const stored = loadStoredData();
    if (stored) {
      setLearningStates(stored.learningStates || {});
      if (stored.settings) {
        setTargetRetention(stored.settings.targetRetention ?? DEFAULT_CONFIG.targetRetention);
        setAnimationsEnabled(stored.settings.animationsEnabled ?? true);
        setActiveYearFilter(stored.settings.activeYearFilter ?? 'ALL');
        setActiveThemeFilter(stored.settings.activeThemeFilter ?? 'ALL');
      }
    }
  }, []);

  // Filtered pool based on current year/theme selections
  const filteredPool = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (activeYearFilter !== 'ALL' && q.academicYear !== activeYearFilter) return false;
      if (activeThemeFilter !== 'ALL' && q.primaryTheme !== activeThemeFilter) return false;
      return true;
    });
  }, [activeYearFilter, activeThemeFilter]);

  // Theme attempt counts for exploration bonus
  const themeAttemptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const s = learningStates[q.id];
      if (s && s.history.length > 0) {
        counts[q.primaryTheme] = (counts[q.primaryTheme] || 0) + s.history.length;
      }
    }
    return counts;
  }, [learningStates]);

  // Scheduler config
  const schedulerConfig = useMemo<SchedulerConfig>(() => {
    return {
      ...DEFAULT_CONFIG,
      targetRetention
    };
  }, [targetRetention]);

  // Pick next question
  const pickAndSetQuestion = useCallback(
    (pool: Question[] = filteredPool) => {
      const targetPool = pool.length > 0 ? pool : QUESTIONS;
      const nextQ = selectNextQuestion(targetPool, {
        learningStates,
        recentQuestionIds,
        sessionMistakeQueue,
        themeAttemptCounts,
        totalSessionAttempts: sessionAttempts,
        config: schedulerConfig
      });

      if (nextQ) {
        setCurrentQuestion(nextQ);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
      }
    },
    [filteredPool, learningStates, recentQuestionIds, sessionMistakeQueue, themeAttemptCounts, sessionAttempts, schedulerConfig]
  );

  // Initialize first question immediately on mount
  useEffect(() => {
    if (!currentQuestion) {
      pickAndSetQuestion();
    }
  }, [currentQuestion, pickAndSetQuestion]);

  // Handle option selection & immediate grading
  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted || !currentQuestion) return;

    const isCorrect = currentQuestion.acceptedAnswers.includes(option);
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const now = Date.now();
    setSessionAttempts(prev => prev + 1);
    if (isCorrect) {
      setSessionCorrect(prev => prev + 1);
    }

    // Update learning state
    const previousState = learningStates[currentQuestion.id];
    const newState = updateQuestionState(
      previousState,
      currentQuestion.id,
      option,
      isCorrect,
      now,
      schedulerConfig
    );

    const updatedStates = {
      ...learningStates,
      [currentQuestion.id]: newState
    };
    setLearningStates(updatedStates);

    // Update recent IDs FIFO
    setRecentQuestionIds(prev => [...prev.slice(-10), currentQuestion.id]);

    // Update session mistake queue
    setSessionMistakeQueue(prev => {
      const nextQueue = prev
        .map(item => ({
          ...item,
          questionsSinceLapse: item.questionsSinceLapse + 1
        }))
        .filter(item => item.questionId !== currentQuestion.id || !isCorrect);

      if (!isCorrect) {
        nextQueue.push({
          questionId: currentQuestion.id,
          questionsSinceLapse: 0
        });
      }
      return nextQueue;
    });

    // Save to localStorage
    const toSave: StoredAppData = {
      schemaVersion: '1.0',
      learningStates: updatedStates,
      settings: {
        targetRetention,
        animationsEnabled,
        activeYearFilter,
        activeThemeFilter
      }
    };
    saveStoredData(toSave);
  };

  const handleNextQuestion = () => {
    pickAndSetQuestion();
  };

  const handleYearFilterChange = (year: string) => {
    setActiveYearFilter(year);
    const newPool = QUESTIONS.filter(q => {
      if (year !== 'ALL' && q.academicYear !== year) return false;
      if (activeThemeFilter !== 'ALL' && q.primaryTheme !== activeThemeFilter) return false;
      return true;
    });
    pickAndSetQuestion(newPool);
  };

  const handleThemeFilterChange = (theme: string) => {
    setActiveThemeFilter(theme);
    const newPool = QUESTIONS.filter(q => {
      if (activeYearFilter !== 'ALL' && q.academicYear !== activeYearFilter) return false;
      if (theme !== 'ALL' && q.primaryTheme !== theme) return false;
      return true;
    });
    pickAndSetQuestion(newPool);
  };

  const handleImportData = (imported: StoredAppData) => {
    setLearningStates(imported.learningStates);
    if (imported.settings) {
      setTargetRetention(imported.settings.targetRetention);
      setAnimationsEnabled(imported.settings.animationsEnabled);
      setActiveYearFilter(imported.settings.activeYearFilter);
      setActiveThemeFilter(imported.settings.activeThemeFilter);
    }
    saveStoredData(imported);
    pickAndSetQuestion();
  };

  const handleResetData = () => {
    const emptyStates: Record<string, QuestionLearningState> = {};
    setLearningStates(emptyStates);
    setRecentQuestionIds([]);
    setSessionMistakeQueue([]);
    setSessionAttempts(0);
    setSessionCorrect(0);

    const toSave: StoredAppData = {
      schemaVersion: '1.0',
      learningStates: emptyStates,
      settings: {
        targetRetention,
        animationsEnabled,
        activeYearFilter: 'ALL',
        activeThemeFilter: 'ALL'
      }
    };
    saveStoredData(toSave);
    pickAndSetQuestion(QUESTIONS);
  };

  const handleDownloadStandaloneHtml = () => {
    // Triggers download of chem-revision-app.html
    const a = document.createElement('a');
    a.href = '/chem-revision-app.html';
    a.download = 'chem-revision-app.html';
    a.click();
  };

  // Stats for header
  const attemptedCount = useMemo(() => {
    return Object.keys(learningStates).filter(id => learningStates[id].history.length > 0).length;
  }, [learningStates]);

  const dueCount = useMemo(() => {
    const now = Date.now();
    return Object.values(learningStates).filter(
      s => s.nextDueAt !== null && now >= s.nextDueAt
    ).length;
  }, [learningStates]);

  const unseenInPoolCount = useMemo(() => {
    return filteredPool.filter(
      q => !learningStates[q.id] || learningStates[q.id].history.length === 0
    ).length;
  }, [filteredPool, learningStates]);

  return (
    <div className={`min-h-screen flex flex-col ${!animationsEnabled ? 'reduced-motion' : ''}`}>
      <CloudBackground animationsEnabled={animationsEnabled} />

      <Header
        onOpenProgress={() => setIsProgressOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenPeriodicTable={() => setIsPeriodicOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onDownloadHtml={handleDownloadStandaloneHtml}
        activeYearFilter={activeYearFilter}
        onYearFilterChange={handleYearFilterChange}
        activeThemeFilter={activeThemeFilter}
        onThemeFilterChange={handleThemeFilterChange}
        attemptedCount={attemptedCount}
        totalQuestions={QUESTIONS.length}
        dueCount={dueCount}
      />

      <main className="flex-1 flex items-center justify-center py-4">
        {currentQuestion ? (
          <QuizCard
            question={currentQuestion}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            onNextQuestion={handleNextQuestion}
            isAnswerSubmitted={isAnswerSubmitted}
            activePoolCount={filteredPool.length}
            unseenInPoolCount={unseenInPoolCount}
          />
        ) : (
          <div className="text-center p-8 bg-white/90 rounded-3xl shadow-sm border border-sky-100 max-w-md mx-auto">
            <span className="text-4xl">☁️</span>
            <h3 className="text-lg font-bold text-slate-800 mt-2">No Questions Match Current Filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try selecting "ALL" papers or "All Themes" to broaden your practice pool.
            </p>
            <button
              onClick={() => {
                setActiveYearFilter('ALL');
                setActiveThemeFilter('ALL');
                pickAndSetQuestion(QUESTIONS);
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-xl shadow-xs transition"
            >
              Reset Filters to All (130 Questions)
            </button>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="py-3 text-center text-xs text-slate-400">
        CloudChem CM2021 Inorganic Revision • Sole Answer Authority: ANS.pdf • 130 Verified Exam Questions
      </footer>

      {/* Modals */}
      <ProgressPanel
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        learningStates={learningStates}
        sessionAttempts={sessionAttempts}
        sessionCorrect={sessionCorrect}
        onSelectQuestion={(q: Question) => {
          setCurrentQuestion(q);
          setSelectedOption(null);
          setIsAnswerSubmitted(false);
        }}
        onImportData={handleImportData}
        onResetData={handleResetData}
        targetRetention={targetRetention}
        animationsEnabled={animationsEnabled}
        activeYearFilter={activeYearFilter}
        activeThemeFilter={activeThemeFilter}
      />

      <SourceAuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />

      <PeriodicTableModal isOpen={isPeriodicOpen} onClose={() => setIsPeriodicOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        targetRetention={targetRetention}
        onTargetRetentionChange={(r: number) => {
          setTargetRetention(r);
          saveStoredData({
            schemaVersion: '1.0',
            learningStates,
            settings: {
              targetRetention: r,
              animationsEnabled,
              activeYearFilter,
              activeThemeFilter
            }
          });
        }}
        animationsEnabled={animationsEnabled}
        onAnimationsToggle={(enabled: boolean) => {
          setAnimationsEnabled(enabled);
          saveStoredData({
            schemaVersion: '1.0',
            learningStates,
            settings: {
              targetRetention,
              animationsEnabled: enabled,
              activeYearFilter,
              activeThemeFilter
            }
          });
        }}
      />
    </div>
  );
}
