import React, { useState } from 'react';
import {
  DynamicIsomerProfile,
  IsomerSpatialConfig,
  getIsomer3DConfig
} from '../utils/isomerEngine';
import { Isomer3DCanvas } from './Isomer3DCanvas';
import { ChemicalText } from './ChemicalText';

interface IsomerExplainerProps {
  profile: DynamicIsomerProfile;
}

export const IsomerExplainer: React.FC<IsomerExplainerProps> = ({ profile }) => {
  const [selectedIsomerIndex, setSelectedIsomerIndex] = useState(0);
  const [showSymmetryDetails, setShowSymmetryDetails] = useState(false);

  const activeIsomer: IsomerSpatialConfig =
    profile.isomers[selectedIsomerIndex] || profile.isomers[0];

  const active3DConfig = getIsomer3DConfig(activeIsomer, profile.geometry);

  return (
    <div className="rounded-2xl border border-sky-200 bg-white shadow-xs overflow-hidden transition-all">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-sky-100/90 to-indigo-100/70 px-4 py-3 border-b border-sky-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🔬</span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
              <span>Isomer Counting Sketchbook</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-sky-700 border border-sky-200">
                {profile.geometry} ({profile.archetype})
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className="px-2.5 py-0.5 rounded-md bg-white/90 text-sky-950 border border-sky-300 shadow-2xs">
            Count: {profile.totalStereoisomers} {profile.totalStereoisomers === 1 ? 'isomer' : 'isomers'}
          </span>
          {profile.opticalPairs > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {profile.opticalPairs} chiral pair{profile.opticalPairs > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4">
        {/* Sketchbook Insight & Prompt */}
        <div className="space-y-2">
          <div className="text-xs text-slate-800 bg-sky-50/70 p-3 rounded-xl border border-sky-100 leading-relaxed">
            <span className="text-sky-800 font-bold block mb-1">📐 Geometric Counting Insight:</span>
            <ChemicalText text={profile.sketchbookInsight} />
          </div>

          {profile.sketchbookHint && (
            <div className="text-xs text-indigo-950 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100/80 flex items-start gap-2">
              <span className="text-indigo-600 font-bold shrink-0">💡 Exam Thinking Prompt:</span>
              <ChemicalText text={profile.sketchbookHint} className="leading-relaxed" />
            </div>
          )}
        </div>

        {/* Configuration Tabs */}
        {profile.isomers.length > 1 && (
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
              Select Configuration:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.isomers.map((isomer, idx) => {
                const isSelected = idx === selectedIsomerIndex;
                return (
                  <button
                    key={isomer.id}
                    type="button"
                    onClick={() => setSelectedIsomerIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs border border-sky-700'
                        : 'bg-slate-100 hover:bg-sky-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{isomer.badge}</span>
                    {isomer.isChiral && (
                      <span className="text-[10px] px-1 py-0.2 rounded-full bg-indigo-400 text-white font-mono">
                        chiral
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual Diagram and Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80">
          {/* Interactive 3D ChemDraw Canvas from voidory/isomers */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-sky-100 shadow-2xs">
            <Isomer3DCanvas
              geom={active3DConfig.geom}
              labels={active3DConfig.labels}
              edges={active3DConfig.edges}
              centralAtom={active3DConfig.centralAtom}
              isChiral={activeIsomer.isChiral}
              name={activeIsomer.name}
              badge={activeIsomer.badge}
              className="w-full"
            />
            <div className="mt-2 text-center">
              <span className="text-[11px] text-slate-500 font-mono font-medium">
                {activeIsomer.transPair}
              </span>
            </div>
          </div>

          {/* Properties & Count Breakdown */}
          <div className="md:col-span-6 space-y-2 text-xs">
            <div>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>{activeIsomer.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeIsomer.isChiral
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {activeIsomer.isChiral ? 'Chiral (Enantiomeric)' : 'Achiral (Superimposable)'}
                </span>
              </div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {activeIsomer.description}
              </p>
            </div>

            {/* Symmetry & Point Group */}
            <div className="p-2 rounded-xl bg-white border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Point Group:</span>
                <span className="font-mono font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded">
                  {activeIsomer.pointGroup}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {activeIsomer.symmetryElements}
              </span>
            </div>

            {/* Total Derivation Math Pill */}
            <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-start gap-1.5">
              <span className="text-emerald-700 font-bold shrink-0">∑ Count Formula:</span>
              <span className="font-semibold text-[11px] leading-tight">
                {profile.formulaDerivation}
              </span>
            </div>
          </div>
        </div>

        {/* Linkage breakdown if applicable */}
        {profile.linkageAnalysis && (
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <span>🔗 Linkage Multiplier ({profile.linkageAnalysis.ambidentateLigand}):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {profile.linkageAnalysis.modes.map((mode, i) => (
                <div
                  key={i}
                  className="bg-white/80 p-2 rounded-lg border border-amber-200/60"
                >
                  <div className="font-semibold text-amber-900">{mode.iupacName}</div>
                  <div className="text-[11px] text-slate-600">{mode.note}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-amber-800 pt-1 font-medium">
              Linkage Permutations: {profile.linkageAnalysis.totalCombinationsFormula}
            </div>
          </div>
        )}

        {/* Symmetry Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowSymmetryDetails(!showSymmetryDetails)}
            className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{showSymmetryDetails ? '▼ Hide' : '▶ Explore'} Symmetry & Chirality Details</span>
          </button>
          {showSymmetryDetails && (
            <div className="mt-2 p-3 rounded-xl bg-sky-50/80 border border-sky-100 text-slate-700 text-xs leading-relaxed">
              <strong>Chirality Criterion: </strong>
              {profile.symmetrySummary.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
