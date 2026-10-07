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
  RotateCcw,
  Check,
  AlertCircle,
  X,
  Play,
  Film,
  MessageSquare,
} from 'lucide-react';
import { VideoPlayer } from '../../components/VideoPlayer.tsx';

export const BrandEngagementsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [selectedEng, setSelectedEng] = useState<Engagement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Revision modal state
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

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
      console.error('Failed to load brand engagements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagements();
  }, [user]);

  const handleApproveProposal = async () => {
    if (!selectedEng) return;
    setIsAdvancing(true);
    try {
      const res = await api.advanceEngagement(selectedEng._id, {
        stage: 'in_production',
        note: 'Brand approved proposal and funded milestone escrow.',
      });
      setSelectedEng(res.engagement);
      fetchEngagements();
    } catch (err) {
      alert('Failed to approve proposal.');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleAcceptDelivery = async () => {
    if (!selectedEng) return;
    if (!window.confirm('Accept delivered assets and complete this project?')) return;
    setIsAdvancing(true);
    try {
      const res = await api.advanceEngagement(selectedEng._id, {
        stage: 'delivered',
        note: 'Brand accepted delivered master assets. Full commercial buyout active.',
      });
      setSelectedEng(res.engagement);
      fetchEngagements();
    } catch (err) {
      alert('Failed to accept delivery.');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEng || !revisionFeedback.trim()) return;
    setIsRequestingRevision(true);
    try {
      const res = await api.reviseEngagement(selectedEng._id, revisionFeedback.trim());
      setSelectedEng(res.engagement);
      fetchEngagements();
      setIsRevisionModalOpen(false);
      setRevisionFeedback('');
    } catch (err) {
      alert('Failed to request revision.');
    } finally {
      setIsRequestingRevision(false);
    }
  };

  const getStageBadge = (stage: EngagementStage) => {
    switch (stage) {
      case 'invited':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Invited</span>;
      case 'proposal':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Proposal</span>;
      case 'in_production':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">In Production</span>;
      case 'review':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">Review</span>;
      case 'delivered':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Delivered</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading campaign engagements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/brand/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Campaign Engagements Management</h1>
          <p className="text-xs text-slate-500">
            Track your commissioned AI video projects from invitation through final delivery.
          </p>
        </div>

        {engagements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Active Engagements</h3>
            <p className="text-xs text-slate-400 mt-1">
              Invite creators from your briefs or discover marketplace talent to start commissions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
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
                    {getStageBadge(eng.stage)}
                    <span className="text-xs font-bold text-slate-900">
                      ₹{eng.budget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {eng.briefTitle}
                  </h3>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                    <img
                      src={eng.creatorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(eng.creatorName)}`}
                      alt={eng.creatorName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{eng.creatorName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Workspace Area */}
            {selectedEng && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        {getStageBadge(selectedEng.stage)}
                        {selectedEng.revisionCount > 0 && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                            Revisions: {selectedEng.revisionCount} / {selectedEng.maxRevisions}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-1">
                        {selectedEng.briefTitle}
                      </h2>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <span>Creator: <strong className="text-slate-700">{selectedEng.creatorName}</strong></span>
                        <span>•</span>
                        <span>Deadline: {selectedEng.agreedDeadline}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">Milestone Amount</span>
                      <span className="text-xl font-black text-blue-600">
                        ₹{selectedEng.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Proposal Review Action */}
                  {selectedEng.stage === 'proposal' && (
                    <div className="p-5 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                        <span>Creator Proposal Ready for Approval</span>
                      </div>
                      {selectedEng.proposalDetails && (
                        <div className="text-xs text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-purple-100">
                          <p><strong>Pitch:</strong> {selectedEng.proposalDetails.pitch}</p>
                          <p><strong>Proposed Timeline:</strong> {selectedEng.proposalDetails.proposedTimeline}</p>
                        </div>
                      )}
                      <button
                        onClick={handleApproveProposal}
                        disabled={isAdvancing}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAdvancing ? 'Approving...' : 'Approve Proposal & Start Production'}</span>
                      </button>
                    </div>
                  )}

                  {/* In Production status */}
                  {selectedEng.stage === 'in_production' && (
                    <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 text-xs text-orange-900">
                      <span className="font-bold">In Production:</span> {selectedEng.creatorName} is actively synthesizing your video cut and temporal stabilization passes.
                    </div>
                  )}

                  {/* Review Deliverables Action */}
                  {selectedEng.stage === 'review' && selectedEng.deliverables?.assetUrl && (
                    <div className="p-5 bg-red-50/60 rounded-xl border border-red-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-red-900">
                          <Film className="w-4 h-4 text-red-600" />
                          <span>Delivered Media Cut Ready for Review</span>
                        </div>
                        <span className="text-[11px] font-semibold text-red-700">
                          Review Window Active
                        </span>
                      </div>

                      {/* REAL PLAYABLE VIDEO FOR DELIVERABLE */}
                      <div className="bg-black rounded-xl overflow-hidden shadow-md">
                        <VideoPlayer
                          src={selectedEng.deliverables.assetUrl}
                          aspectRatio="16:9"
                          title="Delivered Campaign Video"
                        />
                      </div>

                      {selectedEng.deliverables.submissionNotes && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-red-100">
                          <strong>Creator Notes:</strong> {selectedEng.deliverables.submissionNotes}
                        </p>
                      )}

                      <div className="flex items-center space-x-3 pt-2">
                        <button
                          onClick={handleAcceptDelivery}
                          disabled={isAdvancing}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isAdvancing ? 'Completing...' : 'Approve & Accept Final Delivery'}</span>
                        </button>

                        <button
                          onClick={() => setIsRevisionModalOpen(true)}
                          disabled={selectedEng.revisionCount >= selectedEng.maxRevisions}
                          className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 border border-red-300 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>
                            Request Revision ({selectedEng.maxRevisions - selectedEng.revisionCount} left)
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Delivered status */}
                  {selectedEng.stage === 'delivered' && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Engagement Completed! Full commercial ownership transferred to brand.</span>
                    </div>
                  )}

                  {/* Activity Timeline */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Engagement Timeline & Audit Trail
                    </h3>
                    <div className="space-y-3">
                      {selectedEng.timeline.map((event, idx) => (
                        <div key={idx} className="flex items-start space-x-3 text-xs">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">{event.actor}</div>
                            <div className="text-slate-600">{event.note || `Stage updated to ${event.stage}`}</div>
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

      {/* Revision Request Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Request Campaign Revision</h3>
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Specific Revision Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="e.g. Please adjust the rim lighting on the product reveal and increase camera speed in the second sequence..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequestingRevision}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  {isRequestingRevision ? 'Submitting...' : 'Submit Revision Round'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
