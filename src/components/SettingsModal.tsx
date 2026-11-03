import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRetention: number;
  onTargetRetentionChange: (r: number) => void;
  animationsEnabled: boolean;
  onAnimationsToggle: (enabled: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  targetRetention,
  onTargetRetentionChange,
  animationsEnabled,
  onAnimationsToggle
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings and Adaptive Scheduling Parameters"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-sky-100">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Settings & Adaptive Model
              </h2>
              <p className="text-sm text-slate-500">
                Spaced-repetition parameters and visual preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            aria-label="Close Settings Modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Target Retention Slider */}
          <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-100">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="retention-slider" className="font-semibold text-slate-800 text-sm">
                Target Retention Rate (r)
              </label>
              <span className="text-base font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200">
                {(targetRetention * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Calculates due intervals via formula: <code>due interval = -S_i × ln(r)</code>.
              Default is 0.85 (85% estimated recall probability at review time).
            </p>
            <input
              id="retention-slider"
              type="range"
              min="0.70"
              max="0.95"
              step="0.01"
              value={targetRetention}
              onChange={e => onTargetRetentionChange(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>70% (Longer intervals)</span>
              <span>85% (Default balanced)</span>
              <span>95% (Frequent reviews)</span>
            </div>
          </div>

          {/* Visual Animation Preferences */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800 text-sm">Cloud Animations & Effects</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Gentle background cloud drifting and click effects (respects prefers-reduced-motion)
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={e => onAnimationsToggle(e.target.checked)}
                className="sr-only peer"
                aria-label="Toggle cloud animations"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Spaced-Repetition Model Documentation */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-3">
            <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <span>🧠</span>
              <span>Spaced-Repetition Model Specification</span>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <p>
                <strong>Estimated Retention Model:</strong> <code>R_i(t) = exp(-Δt / S_i)</code>
                <br />
                Where <code>Δt</code> is elapsed time in hours since last review, and <code>S_i</code> is memory stability in hours. This is an estimated retention heuristic, not a guaranteed biological certainty.
              </p>
              <p>
                <strong>Initial Stability:</strong> <code>S_0 = 24 hours</code> for newly seen items answered correctly.
              </p>
              <p>
                <strong>Correct Review Growth:</strong> <code>S_new = S_old × 2.2</code> (capped at 8,760 hours / 1 year).
              </p>
              <p>
                <strong>Lapse Penalty:</strong> <code>S_new = max(4.0, S_old × 0.35)</code> on incorrect answer, resetting the item for rapid review.
              </p>
              <p>
                <strong>Short-Session Relearning Queue:</strong> Missed questions are held in a local session queue and retested after 3 intervening questions to consolidate memory before ending the session.
              </p>
              <p>
                <strong>Hybrid Selector:</strong> Prioritises overdue items, steadily introduces unseen items with an under-practised theme bonus, and blocks immediate repeats within a 4-question window.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl shadow-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
