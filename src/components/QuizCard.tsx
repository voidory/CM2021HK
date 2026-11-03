import React, { useEffect, useState } from 'react';
import { Question } from '../data/questions';
import { ChemicalText } from './ChemicalText';

interface QuizCardProps {
  question: Question;
  selectedOption: ('A' | 'B' | 'C' | 'D') | null;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  onNextQuestion: () => void;
  isAnswerSubmitted: boolean;
  activePoolCount: number;
  unseenInPoolCount: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  onNextQuestion,
  isAnswerSubmitted,
  activePoolCount,
  unseenInPoolCount
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Keyboard navigation: 1-4 for options, Space/Enter/N for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input, textarea, or select
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;
      if (document.querySelector('[role="dialog"]')) return; // modal is open

      if (!isAnswerSubmitted) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') {
          e.preventDefault();
          onSelectOption('A');
        } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
          e.preventDefault();
          onSelectOption('B');
        } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
          e.preventDefault();
          onSelectOption('C');
        } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
          e.preventDefault();
          onSelectOption('D');
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'n') {
          e.preventDefault();
          onNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerSubmitted, onSelectOption, onNextQuestion]);

  const optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const isCorrect = selectedOption ? question.acceptedAnswers.includes(selectedOption) : false;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Question Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_16px_40px_rgba(100,150,200,0.12)] border border-sky-100 p-6 sm:p-9 transition-all">
        {/* Header Metadata Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-sky-50 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-sky-100/80 text-sky-900 font-bold tracking-wide">
              {question.academicYear} • Q{question.originalQNum}
            </span>
            <span className="text-slate-400 font-medium">Page {question.page}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
              {question.primaryTheme}
            </span>
            <span className="text-[11px] text-slate-400">
              Pool: {activePoolCount} ({unseenInPoolCount} unseen)
            </span>
          </div>
        </div>

        {/* Question Text */}
        <ChemicalText
          as="div"
          text={question.questionText}
          className="text-slate-800 text-lg sm:text-xl font-medium leading-relaxed mb-6 whitespace-pre-line"
        />

        {/* Visual Asset if Present (e.g. AY21_22 Q16) */}
        {question.visualAsset && (
          <div className="mb-6 p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => setIsZoomOpen(true)}>
              <img
                src={question.visualAsset}
                alt={`Figure for ${question.academicYear} Q${question.originalQNum}`}
                className="max-h-56 object-contain rounded-xl shadow-xs transition transform group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-2 right-2 bg-slate-900/60 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                🔍 Click to Enlarge
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              Original paper depiction (AY21/22 Q16)
            </span>
          </div>
        )}

        {/* Answer Options Grid */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
          {optionKeys.map((key, index) => {
            const text = question.options[key];
            const isSelected = selectedOption === key;
            const isAccepted = question.acceptedAnswers.includes(key);

            let buttonStyle = 'bg-sky-50/40 hover:bg-sky-100/70 border-sky-100/90 text-slate-800 hover:border-sky-300';
            let badgeStyle = 'bg-white text-slate-600 border border-sky-200';
            let indicatorText: React.ReactNode = null;

            if (isAnswerSubmitted) {
              if (isAccepted) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium shadow-xs';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                indicatorText = (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                    ✓ Accepted Answer
                  </span>
                );
              } else if (isSelected && !isAccepted) {
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
                indicatorText = (
                  <span className="flex items-center gap-1 text-rose-700 font-bold text-xs">
                    ✗ Your Selection
                  </span>
                );
              } else {
                buttonStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-sky-100 border-sky-400 text-sky-950 shadow-xs';
              badgeStyle = 'bg-sky-600 text-white border-sky-600';
            }

            return (
              <button
                key={key}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => onSelectOption(key)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 focus:outline-hidden focus:ring-2 focus:ring-sky-400 ${buttonStyle} ${
                  isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                }`}
                aria-label={`Option ${key}: ${text}`}
              >
                <div
                  className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm shadow-2xs ${badgeStyle}`}
                >
                  {key}
                </div>
                <div className="flex-1 pt-0.5">
                  <ChemicalText
                    as="div"
                    text={text}
                    className="text-sm sm:text-base leading-relaxed break-words"
                  />
                  {indicatorText && <div className="mt-1">{indicatorText}</div>}
                </div>
                <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded-md bg-white/70 border border-slate-200 shrink-0 hidden sm:inline">
                  [{index + 1}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Post-Submission Feedback Banner & Explanation */}
        {isAnswerSubmitted && (
          <div className="space-y-4 pt-4 border-t border-sky-100">
            {/* Status Header */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{isCorrect ? '🌟' : '💡'}</span>
                <div>
                  <div className="font-bold text-base">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  <div className="text-xs opacity-90">
                    Authority Answer: <strong>{question.acceptedAnswers.join(' or ')}</strong>
                  </div>
                </div>
              </div>

              {/* Next Question Primary Action */}
              <button
                onClick={onNextQuestion}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <span className="text-xs opacity-80 hidden sm:inline">[Space/Enter]</span>
                <span>→</span>
              </button>
            </div>

            {/* Parenthesised Alternative Key Highlight */}
            {question.isAlternativeKey && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <strong>Official Alternative Key:</strong> The supplied answer key lists alternatives{' '}
                  <code className="font-bold bg-white px-1.5 py-0.5 rounded border border-amber-300">
                    ({question.acceptedAnswers.join('/')})
                  </code>
                  . Either option is accepted as correct.
                </div>
              </div>
            )}

            {/* Notes or Discrepancy Flag */}
            {question.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed">
                <strong>Source Authority Note: </strong>
                <ChemicalText text={question.notes} />
              </div>
            )}

            {/* Chemically Accurate Explanation */}
            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 text-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📖</span>
                  <span>Chemical Principle & Explanation</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-sky-100">
                  Pre-compiled
                </span>
              </div>
              <ChemicalText
                as="p"
                text={question.explanation}
                className="text-sm leading-relaxed text-slate-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Enlarge Image Modal */}
      {isZoomOpen && question.visualAsset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged Diagram View"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              aria-label="Close zoomed diagram"
            >
              ✕
            </button>
            <img
              src={question.visualAsset}
              alt="Enlarged diagram"
              className="max-h-[75vh] w-auto object-contain rounded-xl"
            />
            <div className="text-xs text-slate-500 mt-4">
              {question.academicYear} • Question {question.originalQNum} (Page {question.page})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
