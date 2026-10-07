import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Video, Layers, ChevronRight, HelpCircle } from 'lucide-react';
import { CreatorProfile, MatchScoreBreakdown } from '../types/index.ts';
import { VerificationBadge } from './VerificationBadge.tsx';
import { MatchBreakdownModal } from './MatchBreakdownModal.tsx';

interface CreatorCardProps {
  creator: CreatorProfile;
  matchScore?: number;
  matchBreakdown?: MatchScoreBreakdown;
  onInvite?: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  matchScore,
  matchBreakdown,
  onInvite,
}) => {
  const [showMatchModal, setShowMatchModal] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // Helper for chip styling by tool name
  const getToolChipColor = (tool: string) => {
    const t = tool.toLowerCase();
    if (t.includes('runway')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (t.includes('midjourney')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (t.includes('flux')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (t.includes('kling')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    if (t.includes('luma')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const avatarSrc = imgError || !creator.avatar
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=2563EB&color=fff&size=128`
    : creator.avatar;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden group">
        <div>
          {/* Card Top Banner / Match Badge */}
          {typeof matchScore === 'number' && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-sm font-extrabold text-blue-700">
                  {matchScore}% Match
                </span>
              </div>
              {matchBreakdown && (
                <button
                  onClick={() => setShowMatchModal(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center underline decoration-blue-300 underline-offset-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 mr-1" />
                  Why they match
                </button>
              )}
            </div>
          )}

          <div className="p-5">
            {/* Creator Profile Header */}
            <div className="flex items-start space-x-3.5 mb-3.5">
              <img
                src={avatarSrc}
                alt={creator.name}
                onError={() => setImgError(true)}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {creator.name}
                  </h3>
                  <div className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                    {creator.rating.toFixed(2)}
                  </div>
                </div>

                <p className="text-xs font-semibold text-blue-600 mb-1">
                  {creator.specialization}
                </p>

                <div className="flex items-center text-xs text-slate-500 space-x-2">
                  <span className="flex items-center truncate">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                    {creator.location}
                  </span>
                  <span>•</span>
                  <span>{creator.projectsCompleted} projects</span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">
              {creator.headline}
            </p>

            {/* Trust / Verification Signals */}
            <div className="mb-3.5">
              <VerificationBadge verification={creator.verification} compact />
            </div>

            {/* AI Tools & Models Chips */}
            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {creator.tools.slice(0, 3).map((tool, idx) => (
                  <span
                    key={idx}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getToolChipColor(tool)}`}
                  >
                    {tool}
                  </span>
                ))}
                {creator.tools.length > 3 && (
                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    +{creator.tools.length - 3}
                  </span>
                )}
              </div>

              {/* Aspect Ratio Chips & Formats */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Ratios:</span>
                {creator.supportedAspectRatios.map((ratio, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-1.5 py-0.2 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded"
                  >
                    {ratio}
                  </span>
                ))}
                {creator.commercialUseReady && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded ml-auto">
                    Commercial Ready
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Starting from</span>
            <span className="text-base font-extrabold text-slate-900">
              ₹{creator.rateFrom.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onInvite && (
              <button
                onClick={onInvite}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Invite
              </button>
            )}
            <Link
              to={`/creators/${creator._id}`}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors inline-flex items-center"
            >
              <span>View Profile</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Match Breakdown Modal */}
      {showMatchModal && matchBreakdown && (
        <MatchBreakdownModal
          creator={creator}
          breakdown={matchBreakdown}
          onClose={() => setShowMatchModal(false)}
          onInvite={onInvite}
        />
      )}
    </>
  );
};
