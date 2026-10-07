import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Film,
  Briefcase,
  Star,
  PlusCircle,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { CreatorProfile, Engagement, PortfolioItem } from '../../types/index.ts';
import { api } from '../../services/api.ts';

export const CreatorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [creatorsRes, engagementsRes] = await Promise.all([
          api.getCreators(),
          api.getEngagements(),
        ]);

        const myProfile = creatorsRes.creators.find(c => c.userId === user?._id) || creatorsRes.creators[0];
        setProfile(myProfile);

        if (myProfile) {
          const detailRes = await api.getCreatorById(myProfile._id);
          setPortfolio(detailRes.portfolio);
        }

        setEngagements(engagementsRes.engagements);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading Creator Workspace...</p>
      </div>
    );
  }

  const activeEngagements = engagements.filter(e => e.stage !== 'delivered');
  const videoPortfoliosCount = portfolio.filter(p => p.assetType === 'video').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Creator')}`}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Welcome back, {user?.name}!
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Creator Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile?.headline || 'Managing your generative media assets and brand commissions'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/creator/portfolio"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Portfolio Media</span>
            </Link>
            <Link
              to="/creator/profile"
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Active Briefs</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600">{activeEngagements.length}</div>
            <span className="text-[11px] text-slate-500">In production or review</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Video Portfolios</span>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{videoPortfoliosCount}</div>
            <span className="text-[11px] text-slate-500">Playable HTML5 MP4s</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Creator Rating</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{profile?.rating.toFixed(2) || '5.0'}</div>
            <span className="text-[11px] text-slate-500">Client review average</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Completed Projects</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">{profile?.projectsCompleted || 34}</div>
            <span className="text-[11px] text-slate-500">Commercial deliveries</span>
          </div>
        </div>

        {/* Engagements Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campaign Invitations & Engagements</h2>
              <p className="text-xs text-slate-500">Track incoming brand briefs and advance deliverables</p>
            </div>
            <Link
              to="/creator/engagements"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Manage Engagements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {engagements.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No campaign invitations at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {engagements.slice(0, 3).map((eng) => (
                <div
                  key={eng._id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{eng.briefTitle}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {eng.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Brand: <strong className="text-slate-700">{eng.brandName}</strong> • Milestone: ₹{eng.budget.toLocaleString('en-IN')} • Deadline: {eng.agreedDeadline}
                    </p>
                  </div>

                  <Link
                    to="/creator/engagements"
                    className="px-3.5 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 self-start sm:self-center"
                  >
                    View Status
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Showcase Quick View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your AI Media Portfolio Showcase</h2>
              <p className="text-xs text-slate-500">Currently showing {portfolio.length} media assets</p>
            </div>
            <Link
              to="/creator/portfolio"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Manage Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portfolio.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
                    {item.assetType.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>{item.contentType}</span>
                  <span>{item.aspectRatio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
