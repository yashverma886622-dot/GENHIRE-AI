import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  ShieldCheck,
  Cpu,
  Layers,
  Film,
  Play,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  Send,
} from 'lucide-react';
import { CreatorProfile, PortfolioItem, Brief } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { VerificationBadge } from '../components/VerificationBadge.tsx';
import { PortfolioModal } from '../components/PortfolioModal.tsx';

export const CreatorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [brandBriefs, setBrandBriefs] = useState<Brief[]>([]);
  const [selectedBriefId, setSelectedBriefId] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState<string>('');
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await api.getCreatorById(id);
        setCreator(res.creator);
        setPortfolio(res.portfolio);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Creator not found';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorData();
  }, [id]);

  const handleOpenInvite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'brand') {
      alert('Only brand accounts can issue campaign brief invitations.');
      return;
    }

    try {
      const res = await api.getBriefs(user._id);
      setBrandBriefs(res.briefs);
      if (res.briefs.length > 0) {
        setSelectedBriefId(res.briefs[0]._id);
      }
      setShowInviteModal(true);
    } catch (err) {
      console.error('Failed to load briefs for invitation:', err);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBriefId || !creator) return;

    setIsInviting(true);
    try {
      await api.inviteCreator(selectedBriefId, creator._id, inviteMessage);
      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
        navigate('/brand/engagements');
      }, 1500);
    } catch (err) {
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading creator profile...</p>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Creator not found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'This creator profile is unavailable.'}</p>
        <Link
          to="/discover"
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg inline-flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/discover"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Creator Discovery
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-5">
              <img
                src={creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}`}
                alt={creator.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {creator.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {creator.specialization}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-600">
                  {creator.headline}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {creator.location}
                  </span>
                  <span className="flex items-center font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                    {creator.rating.toFixed(2)} rating
                  </span>
                  <span>{creator.projectsCompleted} projects completed</span>
                </div>
              </div>
            </div>

            {/* Starting Rate & Primary Invite CTA */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              <div className="text-left md:text-right mb-0 md:mb-3">
                <span className="text-xs text-slate-500 block">Starting Commission Rate</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{creator.rateFrom.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 block">per commercial campaign</span>
              </div>

              <button
                onClick={handleOpenInvite}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Briefcase className="w-4 h-4" />
                <span>Invite Creator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Creator Metadata & Pipeline */}
        <div className="space-y-6">
          {/* About Bio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              About the Creator
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {creator.bio}
            </p>
          </div>

          {/* Verification Trust Signals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Verified Platform Signals
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Prototype trust verification audited through direct production evidence submissions.
            </p>
            <VerificationBadge verification={creator.verification} />
          </div>

          {/* AI Tools & Models */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center text-xs font-bold uppercase text-slate-700 mb-2">
                <Cpu className="w-4 h-4 mr-1.5 text-blue-600" />
                Primary AI Toolchain
              </div>
              <div className="flex flex-wrap gap-1.5">
                {creator.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center text-xs font-bold uppercase text-slate-700 mb-2">
                <Sparkles className="w-4 h-4 mr-1.5 text-purple-600" />
                AI Models & Checkpoints
              </div>
              <div className="flex flex-wrap gap-1.5">
                {creator.models.map((model, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formats, Ratios & Commercial Rights */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Deliverables & License Readiness
            </h3>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Supported Aspect Ratios
              </span>
              <div className="flex flex-wrap gap-1.5">
                {creator.supportedAspectRatios.map((ratio, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-md"
                  >
                    {ratio}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Commercial License Readiness
              </span>
              {creator.commercialUseReady ? (
                <div className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600 shrink-0" />
                  <span>Certified Commercial-Use Ready</span>
                </div>
              ) : (
                <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                  Commercial licensing on custom request
                </div>
              )}
            </div>
          </div>

          {/* Detailed Production Workflow */}
          {creator.workflow && creator.workflow.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center text-xs font-bold uppercase text-slate-700 mb-3">
                <Layers className="w-4 h-4 mr-1.5 text-blue-600" />
                Production Workflow Breakdown
              </div>
              <ol className="space-y-3">
                {creator.workflow.map((step, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-2.5 shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Column: AI Portfolio Showcase (REAL PLAYABLE MEDIA) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <span>AI Media Portfolio</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {portfolio.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Click any portfolio card to launch the interactive high-definition media player.
              </p>
            </div>
          </div>

          {portfolio.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Film className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">No portfolio projects uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {portfolio.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedPortfolio(item)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  {/* Thumbnail / Video Badge */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Media Type Overlay */}
                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                          item.assetType === 'video'
                            ? 'bg-red-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {item.assetType === 'video' ? 'VIDEO' : 'IMAGE'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                        {item.aspectRatio}
                      </span>
                    </div>

                    {/* Play Icon on hover if video */}
                    {item.assetType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-blue-600 ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Portfolio Card Meta */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>{item.contentType}</span>
                        {item.commercialUse && (
                          <span className="text-emerald-600">✓ Commercial</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                      {item.toolsUsed.map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Media Viewer Modal */}
      {selectedPortfolio && (
        <PortfolioModal
          item={selectedPortfolio}
          creator={creator}
          onClose={() => setSelectedPortfolio(null)}
          onInvite={handleOpenInvite}
        />
      )}

      {/* Invite to Brief Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Invite {creator.name} to Campaign Brief
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Invitation Sent Successfully!</h4>
                <p className="text-xs text-slate-500">
                  Redirecting to your active engagements management dashboard...
                </p>
              </div>
            ) : brandBriefs.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-sm text-slate-600">
                  You don't have any active creative briefs yet.
                </p>
                <Link
                  to="/brand/briefs/new"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg inline-block"
                >
                  Create Brief with AI Builder
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendInvitation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Select Campaign Brief
                  </label>
                  <select
                    value={selectedBriefId}
                    onChange={(e) => setSelectedBriefId(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    {brandBriefs.map((brief) => (
                      <option key={brief._id} value={brief._id}>
                        {brief.title} (₹{brief.budget.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Custom Invitation Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="We loved your video showcase in AI fashion films and want to commission a 9:16 vertical video..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInviting ? 'Sending...' : 'Send Campaign Invitation'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
