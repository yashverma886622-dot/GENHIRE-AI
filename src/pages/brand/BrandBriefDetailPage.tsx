import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Brief, MatchedCreator } from '../../types/index.ts';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { CreatorCard } from '../../components/CreatorCard.tsx';
import { MatchBreakdownModal } from '../../components/MatchBreakdownModal.tsx';

export const BrandBriefDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [brief, setBrief] = useState<Brief | null>(null);
  const [matches, setMatches] = useState<MatchedCreator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'details'>('matches');

  // Invitation state
  const [invitingCreator, setInvitingCreator] = useState<MatchedCreator | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    const fetchBriefAndMatches = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [briefRes, matchesRes] = await Promise.all([
          api.getBriefById(id),
          api.getBriefMatches(id),
        ]);
        setBrief(briefRes.brief);
        setMatches(matchesRes.matches);
      } catch (err) {
        console.error('Error fetching brief matches:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBriefAndMatches();
  }, [id]);

  const handleInviteCreator = async (matched: MatchedCreator) => {
    if (!brief) return;
    setIsSendingInvite(true);
    try {
      await api.inviteCreator(
        brief._id,
        matched.creator._id,
        `Invited based on ${matched.matchScore}% deterministic match score on brief "${brief.title}"`
      );
      setInviteSuccess(matched.creator.name);
      setTimeout(() => {
        setInviteSuccess(null);
        navigate('/brand/engagements');
      }, 1500);
    } catch (err) {
      alert('Failed to send invitation.');
    } finally {
      setIsSendingInvite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Computing creator match scores...</p>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900">Brief not found</h2>
        <Link to="/brand/briefs" className="text-xs text-blue-600 underline mt-2 block">
          Back to Briefs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/brand/briefs"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to All Briefs
          </Link>
        </div>

        {/* Brief Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {brief.status}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {brief.contentType}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {brief.aspectRatio} Format
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {brief.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {brief.description}
            </p>
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <span className="text-xs text-slate-400 block">Allocated Budget</span>
            <span className="text-2xl font-black text-blue-600">
              ₹{brief.budget.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 block">Target: {brief.deadline}</span>
          </div>
        </div>

        {/* Success Alert */}
        {inviteSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Invitation Sent to {inviteSuccess}!</span>
              <p className="text-emerald-700 mt-0.5">Redirecting to active engagements tracker...</p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center space-x-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ranked Matching Creators ({matches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
              activeTab === 'details'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Brief Specifications & Commercial Terms</span>
          </button>
        </div>

        {/* TAB 1: MATCHED CREATORS (Deterministic 100-Point Ranking) */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Deterministic Match Calculation
                </h3>
                <p className="text-xs text-blue-700 mt-0.5">
                  Scores calculated from Content Type (30), Aspect Ratio (15), Style (15), Tools (10), Commercial License (15), Budget (10), and Verification (5).
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-blue-700 border border-blue-200 shrink-0">
                100-Point Max Scale
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((matched) => (
                <CreatorCard
                  key={matched.creator._id}
                  creator={matched.creator}
                  matchScore={matched.matchScore}
                  matchBreakdown={matched.breakdown}
                  onInvite={() => handleInviteCreator(matched)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SPECIFICATIONS */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Creative Scope & Brief Description
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {brief.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">
                  Format & Target Platform
                </span>
                <div className="text-xs text-slate-800">
                  <p>Content Type: <strong>{brief.contentType}</strong></p>
                  <p>Aspect Ratio: <strong>{brief.aspectRatio}</strong></p>
                  <p>Platform: <strong>{brief.platform}</strong></p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">
                  Styles & Preferred Tools
                </span>
                <div className="text-xs text-slate-800">
                  <p>Styles: <strong>{brief.styles.join(', ')}</strong></p>
                  <p>Preferred Tools: <strong>{brief.preferredTools.join(', ') || 'Any high-end generative pipeline'}</strong></p>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Commercial Usage & Output Ownership</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Territory:</span>
                  <strong>{brief.commercialUseDetails.territory}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Term:</span>
                  <strong>{brief.commercialUseDetails.usageTerm}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Exclusivity:</span>
                  <strong>{brief.commercialUseDetails.exclusivity}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ownership:</span>
                  <strong>{brief.commercialUseDetails.outputOwnership}</strong>
                </div>
              </div>
            </div>

            {/* Qualification Criteria */}
            {brief.creatorRequirements.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Creator Qualification Criteria
                </h3>
                <ul className="space-y-1.5">
                  {brief.creatorRequirements.map((req, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
