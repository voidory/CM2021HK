import React from 'react';
import { ALL_THEMES } from '../data/questions';

interface HeaderProps {
  onOpenProgress: () => void;
  onOpenAudit: () => void;
  onOpenPeriodicTable: () => void;
  onOpenSettings: () => void;
  onDownloadHtml: () => void;
  activeYearFilter: string;
  onYearFilterChange: (year: string) => void;
  activeThemeFilter: string;
  onThemeFilterChange: (theme: string) => void;
  attemptedCount: number;
  totalQuestions: number;
  dueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProgress,
  onOpenAudit,
  onOpenPeriodicTable,
  onOpenSettings,
  onDownloadHtml,
  activeYearFilter,
  onYearFilterChange,
  activeThemeFilter,
  onThemeFilterChange,
  attemptedCount,
  totalQuestions,
  dueCount
}) => {
  const years = ['ALL', 'AY25/26', 'AY24/25', 'AY23/24', 'AY22/23', 'AY21/22'];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-sky-100/80 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <span className="text-3xl filter drop-shadow-xs select-none">☁️</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent">
                  CloudChem
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  CM2021 Adaptive
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Inorganic Chemistry Mid-Term Question Authority
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Progress Button */}
            <button
              onClick={onOpenProgress}
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold border border-sky-200 transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>📊</span>
              <span>Progress</span>
              <span className="px-1.5 py-0.2 bg-sky-200/70 text-sky-900 rounded-md text-[10px]">
                {attemptedCount}/{totalQuestions}
              </span>
              {dueCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 font-bold rounded-md text-[10px]">
                  {dueCount} due
                </span>
              )}
            </button>

            {/* Audit Button */}
            <button
              onClick={onOpenAudit}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition flex items-center gap-1"
              title="View Source Material & Authority Audit"
            >
              <span>📋</span>
              <span className="hidden md:inline">Audit</span>
            </button>

            {/* Periodic Table */}
            <button
              onClick={onOpenPeriodicTable}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition flex items-center gap-1"
              title="Periodic Table & 3d Metal Orbitals"
            >
              <span>⚛️</span>
              <span className="hidden md:inline">Elements</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition flex items-center gap-1"
              title="Spaced Repetition Settings"
            >
              <span>⚙️</span>
            </button>

            {/* Download Standalone HTML */}
            <button
              onClick={onDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold transition shadow-xs flex items-center gap-1"
              title="Download 100% offline self-contained HTML file"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Download HTML</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-sky-100/60 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wide mr-1">
              Paper:
            </span>
            {years.map(y => (
              <button
                key={y}
                onClick={() => onYearFilterChange(y)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeYearFilter === y
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wide">
              Theme:
            </span>
            <select
              value={activeThemeFilter}
              onChange={e => onThemeFilterChange(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-sky-300 focus:outline-hidden"
              aria-label="Filter by primary theme"
            >
              <option value="ALL">All Themes (130 Questions)</option>
              {ALL_THEMES.map(theme => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
