import React, { useState } from 'react';
import { ChemicalText } from './ChemicalText';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ElementInfo {
  sym: string;
  num: number;
  name: string;
  group: number;
  period: number;
  config: string;
  commonOx: string;
}

const FIRST_ROW_TRANSITION: ElementInfo[] = [
  { sym: 'Sc', num: 21, name: 'Scandium', group: 3, period: 4, config: '[Ar] 3d1 4s2', commonOx: '+3 (d0)' },
  { sym: 'Ti', num: 22, name: 'Titanium', group: 4, period: 4, config: '[Ar] 3d2 4s2', commonOx: '+4 (d0), +3 (d1), +2 (d2)' },
  { sym: 'V', num: 23, name: 'Vanadium', group: 5, period: 4, config: '[Ar] 3d3 4s2', commonOx: '+5 (d0), +4 (d1), +3 (d2), +2 (d3)' },
  { sym: 'Cr', num: 24, name: 'Chromium', group: 6, period: 4, config: '[Ar] 3d5 4s1', commonOx: '+6 (d0), +3 (d3), +2 (d4)' },
  { sym: 'Mn', num: 25, name: 'Manganese', group: 7, period: 4, config: '[Ar] 3d5 4s2', commonOx: '+7 (d0), +4 (d3), +3 (d4), +2 (d5)' },
  { sym: 'Fe', num: 26, name: 'Iron', group: 8, period: 4, config: '[Ar] 3d6 4s2', commonOx: '+3 (d5), +2 (d6), 0 (d8)' },
  { sym: 'Co', num: 27, name: 'Cobalt', group: 9, period: 4, config: '[Ar] 3d7 4s2', commonOx: '+3 (d6), +2 (d7)' },
  { sym: 'Ni', num: 28, name: 'Nickel', group: 10, period: 4, config: '[Ar] 3d8 4s2', commonOx: '+2 (d8), +4 (d6), 0 (d10)' },
  { sym: 'Cu', num: 29, name: 'Copper', group: 11, period: 4, config: '[Ar] 3d10 4s1', commonOx: '+2 (d9), +1 (d10)' },
  { sym: 'Zn', num: 30, name: 'Zinc', group: 12, period: 4, config: '[Ar] 3d10 4s2', commonOx: '+2 (d10)' }
];

const HEAVIER_METALS: ElementInfo[] = [
  { sym: 'Rh', num: 45, name: 'Rhodium', group: 9, period: 5, config: '[Kr] 4d8 5s1', commonOx: '+3 (d6), +1 (d8)' },
  { sym: 'Pd', num: 46, name: 'Palladium', group: 10, period: 5, config: '[Kr] 4d10', commonOx: '+2 (d8), +4 (d6)' },
  { sym: 'Ir', num: 77, name: 'Iridium', group: 9, period: 6, config: '[Xe] 4f14 5d7 6s2', commonOx: '+3 (d6), +4 (d5), +1 (d8)' },
  { sym: 'Pt', num: 78, name: 'Platinum', group: 10, period: 6, config: '[Xe] 4f14 5d9 6s1', commonOx: '+2 (d8), +4 (d6)' }
];

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({ isOpen, onClose }) => {
  const [selectedEl, setSelectedEl] = useState<ElementInfo | null>(FIRST_ROW_TRANSITION[5]); // Default Fe

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Periodic Table and Transition Metals Reference"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-sky-100">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚛️</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Inorganic Transition Metals Reference
              </h2>
              <p className="text-sm text-slate-500">
                Atomic numbers, valence configurations, and common d-electron counts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            aria-label="Close Reference Modal"
          >
            ✕
          </button>
        </div>

        {/* 3d First Row Selector */}
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            First-Row Transition Metals (3d)
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {FIRST_ROW_TRANSITION.map(el => (
              <button
                key={el.sym}
                onClick={() => setSelectedEl(el)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                  selectedEl?.sym === el.sym
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                    : 'bg-sky-50/70 hover:bg-sky-100 border-sky-100 text-slate-800'
                }`}
              >
                <span className="text-[10px] opacity-75">{el.num}</span>
                <span className="text-base font-bold">{el.sym}</span>
                <span className="text-[9px] truncate w-full">{el.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Heavier Key Metals (Pt, Pd, Ir, Rh) */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Key Heavier Platinum Group Metals (4d / 5d)
          </div>
          <div className="grid grid-cols-4 gap-2">
            {HEAVIER_METALS.map(el => (
              <button
                key={el.sym}
                onClick={() => setSelectedEl(el)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                  selectedEl?.sym === el.sym
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                    : 'bg-indigo-50/70 hover:bg-indigo-100 border-indigo-100 text-slate-800'
                }`}
              >
                <span className="text-[10px] opacity-75">{el.num}</span>
                <span className="text-base font-bold">{el.sym}</span>
                <span className="text-[9px] truncate w-full">{el.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Element Detail Card */}
        {selectedEl && (
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 rounded-2xl p-5 border border-sky-100 mb-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-sky-200 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-500">{selectedEl.num}</span>
                <span className="text-2xl font-black text-sky-800">{selectedEl.sym}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedEl.name}</h3>
                <div className="text-xs text-slate-600">
                  Group {selectedEl.group} • Period {selectedEl.period} • Ground State:{' '}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded-sm border border-slate-200">
                    <ChemicalText text={selectedEl.config} />
                  </code>
                </div>
              </div>
            </div>
            <div className="bg-white/90 rounded-xl p-3 border border-sky-100 text-sm">
              <div className="text-xs font-semibold text-sky-700 mb-1">
                Common Oxidation States & d-Configurations in Coordination Complexes:
              </div>
              <div className="text-slate-800 font-medium">
                <ChemicalText text={selectedEl.commonOx} />
              </div>
            </div>
          </div>
        )}

        {/* Quick Spectrochemical Reminder */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="font-semibold text-slate-800">Spectrochemical Series (Ligand Field Strength):</div>
          <div className="font-mono text-slate-700 break-words leading-relaxed">
            I⁻ &lt; Br⁻ &lt; S²⁻ &lt; SCN⁻ (S) &lt; Cl⁻ &lt; NO₃⁻ &lt; F⁻ &lt; OH⁻ &lt; C₂O₄²⁻ &lt; H₂O &lt; NCS⁻ (N) &lt; py ≈ NH₃ &lt; en &lt; bipy &lt; phen &lt; NO₂⁻ &lt; PPh₃ &lt; CN⁻ ≈ CO
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Weak field (π-donors, halides) → smaller Δo (high-spin). Strong field (π-acceptors, CO, CN⁻) → larger Δo (low-spin).
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl shadow-xs transition"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
