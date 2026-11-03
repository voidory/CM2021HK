import React, { useRef, useState } from 'react';
import { ALL_THEMES, QUESTIONS, Question } from '../data/questions';
import { ChemicalText } from './ChemicalText';
import { QuestionLearningState, calculateRetention, DEFAULT_CONFIG } from '../utils/scheduler';
import {
  isLocalStorageAvailable,
  exportProgressToJson,
  validateImportedData,
  StoredAppData
} from '../utils/storage';

interface ProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
  learningStates: Record<string, QuestionLearningState>;
  sessionAttempts: number;
  sessionCorrect: number;
  onSelectQuestion: (question: Question) => void;
  onImportData: (data: StoredAppData) => void;
  onResetData: () => void;
  targetRetention: number;
  animationsEnabled: boolean;
  activeYearFilter: string;
  activeThemeFilter: string;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  isOpen,
  onClose,
  learningStates,
  sessionAttempts,
  sessionCorrect,
  onSelectQuestion,
  onImportData,
  onResetData,
  targetRetention,
  animationsEnabled,
  activeYearFilter,
  activeThemeFilter
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const storageAvailable = isLocalStorageAvailable();
  const totalVerified = QUESTIONS.length; // 130
  const now = Date.now();

  // Metric calculations
  const attemptedQuestionIds = Object.keys(learningStates).filter(
    id => learningStates[id].history.length > 0
  );
  const uniqueAttemptedCount = attemptedQuestionIds.length;
  const coveragePercentage = totalVerified > 0 ? (uniqueAttemptedCount / totalVerified) * 100 : 0;

  // First-attempt accuracy: denominator is uniqueAttemptedCount
  let firstAttemptCorrectCount = 0;
  let totalGradedAttempts = 0;
  let totalGradedCorrect = 0;
  let totalRetentionSum = 0;
  let retentionCount = 0;
  let dueCount = 0;

  for (const id of attemptedQuestionIds) {
    const s = learningStates[id];
    if (s.history.length > 0) {
      if (s.history[0].isCorrect) {
        firstAttemptCorrectCount++;
      }
      for (const h of s.history) {
        totalGradedAttempts++;
        if (h.isCorrect) totalGradedCorrect++;
      }
    }

    if (s.lastReviewedAt) {
      const ret = calculateRetention(s.lastReviewedAt, s.stability, now);
      if (ret !== null) {
        totalRetentionSum += ret;
        retentionCount++;
      }
    }

    if (s.nextDueAt && now >= s.nextDueAt) {
      dueCount++;
    }
  }

  const firstAttemptAccuracy =
    uniqueAttemptedCount > 0 ? (firstAttemptCorrectCount / uniqueAttemptedCount) * 100 : 0;
  const overallAccuracy =
    totalGradedAttempts > 0 ? (totalGradedCorrect / totalGradedAttempts) * 100 : 0;
  const averageEstimatedRetention =
    retentionCount > 0 ? (totalRetentionSum / retentionCount) * 100 : null;
  const sessionAccuracy =
    sessionAttempts > 0 ? (sessionCorrect / sessionAttempts) * 100 : 0;

  // Theme breakdown
  const themeStats = ALL_THEMES.map(theme => {
    const themeQuestions = QUESTIONS.filter(q => q.primaryTheme === theme);
    const themeTotal = themeQuestions.length;
    let attempted = 0;
    let correctAttempts = 0;
    let totalAttempts = 0;

    for (const q of themeQuestions) {
      const s = learningStates[q.id];
      if (s && s.history.length > 0) {
        attempted++;
        for (const h of s.history) {
          totalAttempts++;
          if (h.isCorrect) correctAttempts++;
        }
      }
    }

    const themeAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const themeCoverage = themeTotal > 0 ? (attempted / themeTotal) * 100 : 0;

    return {
      theme,
      themeTotal,
      attempted,
      themeCoverage,
      correctAttempts,
      totalAttempts,
      themeAccuracy
    };
  });

  // Recently missed questions
  const recentlyMissed: { question: Question; state: QuestionLearningState }[] = [];
  for (const q of QUESTIONS) {
    const s = learningStates[q.id];
    if (s && s.history.length > 0) {
      const last = s.history[s.history.length - 1];
      if (!last.isCorrect) {
        recentlyMissed.push({ question: q, state: s });
      }
    }
  }

  // Sort by last attempt timestamp desc
  recentlyMissed.sort((a, b) => {
    const tA = a.state.history[a.state.history.length - 1]?.timestamp || 0;
    const tB = b.state.history[b.state.history.length - 1]?.timestamp || 0;
    return tB - tA;
  });

  const handleExport = () => {
    const stored: StoredAppData = {
      schemaVersion: '1.0',
      learningStates,
      settings: {
        targetRetention,
        animationsEnabled,
        activeYearFilter,
        activeThemeFilter
      }
    };
    const jsonStr = exportProgressToJson(stored);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudchem_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        const res = validateImportedData(parsed);
        if (res.valid && res.data) {
          onImportData(res.data);
          alert('Progress imported successfully!');
        } else {
          setImportError(res.error || 'Failed to validate progress file.');
        }
      } catch (err: any) {
        setImportError('Invalid JSON file format: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Progress & Analytics Panel"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-sky-100">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Progress & Mastery Statistics
              </h2>
              <p className="text-sm text-slate-500">
                Transparent learning metrics and spaced-repetition retention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            aria-label="Close Progress Panel"
          >
            ✕
          </button>
        </div>

        {/* LocalStorage Availability Warning */}
        {!storageAvailable && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <strong>Browser Storage Unavailable:</strong> Your browser has disabled local storage.
              Progress will be saved in memory for this session only unless you export your data to JSON.
            </div>
          </div>
        )}

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 text-center">
            <div className="text-xs font-semibold text-sky-700">Unique Coverage</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {coveragePercentage.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {uniqueAttemptedCount} / {totalVerified} verified Qs
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
            <div className="text-xs font-semibold text-emerald-700">1st-Attempt Accuracy</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {firstAttemptAccuracy.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {firstAttemptCorrectCount} / {uniqueAttemptedCount || 1} unique items
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 text-center">
            <div className="text-xs font-semibold text-indigo-700">Overall Accuracy</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {overallAccuracy.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {totalGradedCorrect} / {totalGradedAttempts || 1} total reviews
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 text-center">
            <div className="text-xs font-semibold text-purple-700">Current Session</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {sessionAccuracy.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {sessionCorrect} / {sessionAttempts} session attempts
            </div>
          </div>
        </div>

        {/* Spaced Repetition Due and Retention Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Due Reviews
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Questions ready for review according to stability decay:
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-700 px-3">{dueCount}</div>
          </div>

          <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                Estimated Retention (Model Estimate)
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Average predicted recall probability (R = e^(-Δt/S)):
              </div>
            </div>
            <div className="text-2xl font-extrabold text-sky-800 px-3">
              {averageEstimatedRetention !== null
                ? `${averageEstimatedRetention.toFixed(1)}%`
                : 'Unseen'}
            </div>
          </div>
        </div>

        {/* Theme Breakdown Table */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>🏷️</span>
            <span>Performance & Coverage by Primary Theme</span>
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Primary Theme</th>
                  <th className="py-2.5 px-3 text-center">Coverage (Attempted / Total)</th>
                  <th className="py-2.5 px-3 text-center">Accuracy (Correct / Attempts)</th>
                  <th className="py-2.5 px-3 text-right">Mastery Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {themeStats.map(t => (
                  <tr key={t.theme} className="hover:bg-sky-50/40">
                    <td className="py-2.5 px-3 font-medium text-slate-800">{t.theme}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">
                      {t.attempted} / {t.themeTotal} ({t.themeCoverage.toFixed(0)}%)
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                      {t.totalAttempts > 0
                        ? `${t.themeAccuracy.toFixed(1)}% (${t.correctAttempts}/${t.totalAttempts})`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right w-36">
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all"
                          style={{ width: `${t.themeCoverage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Missed Questions */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>Recently Missed Questions ({recentlyMissed.length})</span>
          </h3>
          {recentlyMissed.length === 0 ? (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-2xl border border-emerald-100">
              No recent lapses! You have answered all active questions correctly on their most recent review.
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {recentlyMissed.slice(0, 8).map(({ question, state }) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs hover:bg-rose-100/50 transition"
                >
                  <div className="truncate pr-3">
                    <span className="font-bold text-rose-900 mr-2">
                      {question.academicYear} Q{question.originalQNum}
                    </span>
                    <ChemicalText text={question.questionText} className="text-slate-600 truncate inline-block max-w-[400px]" />
                  </div>
                  <button
                    onClick={() => {
                      onSelectQuestion(question);
                      onClose();
                    }}
                    className="shrink-0 px-3 py-1 bg-white hover:bg-rose-600 hover:text-white text-rose-700 font-semibold rounded-lg border border-rose-200 transition shadow-2xs"
                  >
                    Practice Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import/Export & Reset Controls */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>Export Progress (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <span>📂</span>
              <span>Import Progress</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-medium">Reset all progress?</span>
                <button
                  onClick={() => {
                    onResetData();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline"
              >
                Reset Progress
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-xl shadow-xs transition"
            >
              Close
            </button>
          </div>
        </div>

        {importError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {importError}
          </div>
        )}
      </div>
    </div>
  );
};
