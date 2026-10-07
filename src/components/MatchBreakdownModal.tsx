import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Calculator } from 'lucide-react';
import { MatchScoreBreakdown, CreatorProfile } from '../types/index.ts';

interface MatchBreakdownModalProps {
  creator: CreatorProfile;
  breakdown: MatchScoreBreakdown;
  onClose: () => void;
  onInvite?: () => void;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  creator,
  breakdown,
  onClose,
  onInvite,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Match Score Breakdown: {creator.name}
              </h3>
              <p className="text-xs text-slate-500">
                Deterministic algorithmic fit based on creative brief parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Total Score Badge */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                Overall Compatibility
              </span>
              <div className="text-3xl font-extrabold text-blue-600 mt-0.5">
                {breakdown.totalScore}%
                <span className="text-sm font-normal text-slate-600 ml-1.5">
                  ({breakdown.totalScore}/100 points)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-blue-700 border border-blue-200 shadow-sm">
                Deterministic Rating
              </span>
            </div>
          </div>

          {/* Component Score Progress Bars */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Weighted Component Scoring
            </h4>
            <div className="space-y-3">
              {/* Content Type */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Content Type Match (Weight: 30)</span>
                  <span className="font-bold text-slate-900">{breakdown.contentTypeScore} / 30</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.contentTypeScore / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Format / Aspect Ratio */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Format & Aspect Ratio (Weight: 15)</span>
                  <span className="font-bold text-slate-900">{breakdown.aspectRatioScore} / 15</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-600 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.aspectRatioScore / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Style */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Style Synergy (Weight: 15)</span>
                  <span className="font-bold text-slate-900">{breakdown.styleScore} / 15</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.styleScore / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tools */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>AI Toolchain Alignment (Weight: 10)</span>
                  <span className="font-bold text-slate-900">{breakdown.toolsScore} / 10</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.toolsScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Commercial License */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Commercial License Ready (Weight: 15)</span>
                  <span className="font-bold text-slate-900">{breakdown.commercialLicenseScore} / 15</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.commercialLicenseScore / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Budget Efficiency (Weight: 10)</span>
                  <span className="font-bold text-slate-900">{breakdown.budgetScore} / 10</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.budgetScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Verification */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Platform Verification Signals (Weight: 5)</span>
                  <span className="font-bold text-slate-900">{breakdown.verificationScore} / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all"
                    style={{ width: `${(breakdown.verificationScore / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Reasons Checklist */}
          <div className="space-y-4">
            {/* Positive (✓) */}
            {breakdown.positiveReasons.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Positive Qualifications
                </h5>
                <ul className="space-y-1.5">
                  {breakdown.positiveReasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 bg-emerald-50/60 border border-emerald-100 px-3 py-1.5 rounded-lg"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Partial (△) */}
            {breakdown.partialReasons.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
                  Partial or Adjusted Attributes
                </h5>
                <ul className="space-y-1.5">
                  {breakdown.partialReasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 bg-amber-50/60 border border-amber-100 px-3 py-1.5 rounded-lg"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mismatch (✕) */}
            {breakdown.mismatchReasons.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center">
                  <XCircle className="w-4 h-4 mr-1.5 text-red-500" />
                  Specification Differences
                </h5>
                <ul className="space-y-1.5">
                  {breakdown.mismatchReasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 bg-red-50/60 border border-red-100 px-3 py-1.5 rounded-lg"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close Breakdown
          </button>
          {onInvite && (
            <button
              onClick={onInvite}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Invite This Creator
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
