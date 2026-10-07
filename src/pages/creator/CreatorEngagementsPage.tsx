import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Engagement, EngagementStage } from '../../types/index.ts';
import {
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Send,
  Upload,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { VideoPlayer } from '../../components/VideoPlayer.tsx';

export const CreatorEngagementsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEng, setSelectedEng] = useState<Engagement | null>(null);

  // Proposal form state
  const [pitch, setPitch] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('5 business days');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Deliverable form state
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);

  const fetchEngagements = async () => {
    try {
      const res = await api.getEngagements();
      setEngagements(res.engagements);
      if (res.engagements.length > 0 && !selectedEng) {
        setSelectedEng(res.engagements[0]);
      } else if (selectedEng) {
        const updated = res.engagements.find(e => e._id === selectedEng._id);
        if (updated) setSelectedEng(updated);
      }
    } catch (err) {
      console.error('Failed to load engagements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagements();
  }, [user]);

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEng) return;
    setIsSubmittingProposal(true);
    try {
      const res = await api.advanceEngagement(selectedEng._id, {
        stage: 'proposal',
        pitch,
        proposedTimeline,
      });
      setSelectedEng(res.engagement);
      fetchEngagements();
      setPitch('');
    } catch (err) {
      alert('Failed to submit proposal.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleSendDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEng || !deliverableUrl) return;
    setIsSubmittingDelivery(true);
    try {
      const res = await api.advanceEngagement(selectedEng._id, {
        stage: 'review',
        note: `Submitted final master media asset for client review: "${deliverableNotes || 'No notes'}"`,
        deliverable: {
          assetUrl: deliverableUrl,
          assetType: 'video',
          submissionNotes: deliverableNotes,
          submittedAt: new Date().toISOString(),
        },
      });
      setSelectedEng(res.engagement);
      fetchEngagements();
      setDeliverableUrl('');
      setDeliverableNotes('');
    } catch (err) {
      alert('Failed to submit deliverable.');
    } finally {
      setIsSubmittingDelivery(false);
    }
  };

  const getStageColor = (stage: EngagementStage) => {
    switch (stage) {
      case 'invited':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'proposal':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'in_production':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'review':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading creator engagements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/creator/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Campaign Engagements & Production</h1>
          <p className="text-xs text-slate-500">
            Respond to brand invitations, provide production milestones, and deliver master video assets.
          </p>
        </div>

        {engagements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Active Engagements</h3>
            <p className="text-xs text-slate-400 mt-1">
              You will be notified when brands invite you based on your portfolio matches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Engagements List */}
            <div className="space-y-3">
              {engagements.map((eng) => (
                <div
                  key={eng._id}
                  onClick={() => setSelectedEng(eng)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedEng?._id === eng._id
                      ? 'bg-blue-50/50 border-blue-600 shadow-sm ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStageColor(
                        eng.stage
                      )}`}
                    >
                      {eng.stage.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      ₹{eng.budget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {eng.briefTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Client: <strong className="text-slate-700">{eng.brandName}</strong>
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Selected Engagement Workspace */}
            {selectedEng && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${getStageColor(
                            selectedEng.stage
                          )}`}
                        >
                          Stage: {selectedEng.stage.replace('_', ' ')}
                        </span>
                        {selectedEng.revisionCount > 0 && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                            Revisions: {selectedEng.revisionCount} / {selectedEng.maxRevisions}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-1">
                        {selectedEng.briefTitle}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Brand: <strong>{selectedEng.brandName}</strong> • Agreed Target: {selectedEng.agreedDeadline}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">Milestone Amount</span>
                      <span className="text-xl font-black text-blue-600">
                        ₹{selectedEng.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Stage-Specific Action Box */}
                  {selectedEng.stage === 'invited' && (
                    <div className="p-5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-800">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Action Required: Submit Your Creative Proposal</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        You have received a direct brief invitation from {selectedEng.brandName}. Detail your production plan and camera vector strategy to initiate production.
                      </p>

                      <form onSubmit={handleSendProposal} className="space-y-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                            Production Roadmap / Pitch
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={pitch}
                            onChange={(e) => setPitch(e.target.value)}
                            placeholder="I will synthesize a 3-act sequence: Act 1 macro reveal, Act 2 volumetric stride, Act 3 branded freeze using Runway Gen-3 Alpha..."
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                            Estimated Turnaround
                          </label>
                          <input
                            type="text"
                            value={proposedTimeline}
                            onChange={(e) => setProposedTimeline(e.target.value)}
                            placeholder="e.g. 5 business days for first cut"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingProposal}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmittingProposal ? 'Submitting...' : 'Submit Proposal to Brand'}</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {selectedEng.stage === 'proposal' && (
                    <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-purple-900">
                      <span className="font-bold">Proposal Under Review:</span> Waiting for {selectedEng.brandName} to approve the proposal and initialize production escrow.
                    </div>
                  )}

                  {selectedEng.stage === 'in_production' && (
                    <div className="p-5 bg-orange-50/60 rounded-xl border border-orange-200 space-y-3">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-900">
                        <Upload className="w-4 h-4 text-orange-600" />
                        <span>In Production: Deliver Master Video Asset</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Generate and render the master media cut. Submit the direct browser-playable MP4 URL for client review.
                      </p>

                      <form onSubmit={handleSendDeliverable} className="space-y-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                            Master Media Asset URL (Browser-playable MP4)
                          </label>
                          <input
                            type="url"
                            required
                            value={deliverableUrl}
                            onChange={(e) => setDeliverableUrl(e.target.value)}
                            placeholder="https://...master_render.mp4"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                            Submission Notes / Color Grade Info
                          </label>
                          <textarea
                            rows={2}
                            value={deliverableNotes}
                            onChange={(e) => setDeliverableNotes(e.target.value)}
                            placeholder="Rendered at 4K 60fps with DaVinci color grading and ElevenLabs audio mastering..."
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingDelivery}
                          className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isSubmittingDelivery ? 'Uploading...' : 'Submit Deliverable for Review'}</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {selectedEng.stage === 'review' && (
                    <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 text-xs text-red-900 space-y-2">
                      <span className="font-bold">Deliverable Submitted for Client Review:</span>
                      <p className="text-slate-600">
                        {selectedEng.brandName} is currently reviewing your master render. They can approve delivery or request a revision round.
                      </p>
                    </div>
                  )}

                  {selectedEng.stage === 'delivered' && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Engagement Completed & Delivered! Full payout released.</span>
                    </div>
                  )}

                  {/* Active Deliverable Player if present */}
                  {selectedEng.deliverables?.assetUrl && (
                    <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Current Master Asset Submission:
                      </span>
                      <VideoPlayer
                        src={selectedEng.deliverables.assetUrl}
                        aspectRatio="16:9"
                      />
                      {selectedEng.deliverables.submissionNotes && (
                        <p className="text-xs text-slate-400 mt-2">
                          Notes: {selectedEng.deliverables.submissionNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Activity Timeline */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Activity & Revision History
                    </h3>
                    <div className="space-y-3">
                      {selectedEng.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start space-x-3 text-xs">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">{event.actor}</div>
                            <div className="text-slate-600">{event.note || `Advanced to ${event.stage}`}</div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(event.timestamp).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
