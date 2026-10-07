import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Brief, Engagement, CreatorProfile } from '../../types/index.ts';
import {
  Sparkles,
  FileText,
  Briefcase,
  Users,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { CreatorCard } from '../../components/CreatorCard.tsx';

export const BrandDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [briefsRes, engagementsRes, creatorsRes] = await Promise.all([
          api.getBriefs(),
          api.getEngagements(),
          api.getCreators(),
        ]);
        setBriefs(briefsRes.briefs);
        setEngagements(engagementsRes.engagements);
        setCreators(creatorsRes.creators.slice(0, 3));
      } catch (err) {
        console.error('Failed to load brand dashboard data:', err);
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
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading Brand Command Center...</p>
      </div>
    );
  }

  const activeBriefs = briefs.filter(b => b.status === 'active');
  const draftBriefs = briefs.filter(b => b.status === 'draft');
  const activeEngagements = engagements.filter(e => e.stage !== 'delivered');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Brand Studio: {user?.name}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Agency / Brand
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Commission generative video campaigns with deterministic creator matching and commercial clearances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/brand/briefs/new"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Brief Builder</span>
            </Link>
            <Link
              to="/discover"
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Creators</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Active Briefs</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600">{activeBriefs.length}</div>
            <span className="text-[11px] text-slate-500">Currently accepting creators</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Draft Briefs</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-600">{draftBriefs.length}</div>
            <span className="text-[11px] text-slate-500">Saved specifications</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Active Engagements</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-orange-600">{activeEngagements.length}</div>
            <span className="text-[11px] text-slate-500">In production & review</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Verified Creators</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">10+</div>
            <span className="text-[11px] text-slate-500">Available across India</span>
          </div>
        </div>

        {/* Active Briefs Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campaign Creative Briefs</h2>
              <p className="text-xs text-slate-500">Click a brief to find ranked creators and evaluate score breakdowns</p>
            </div>
            <Link
              to="/brand/briefs"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View All Briefs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {briefs.map((brief) => (
              <div
                key={brief._id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{brief.title}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {brief.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      {brief.aspectRatio}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {brief.description}
                  </p>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center space-x-3">
                    <span>Budget: <strong>₹{brief.budget.toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Deadline: {brief.deadline}</span>
                    <span>•</span>
                    <span>Type: {brief.contentType}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <Link
                    to={`/brand/briefs/${brief._id}`}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <span>Find Creators</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Creators */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recommended Indian AI Directors</h2>
              <p className="text-xs text-slate-500">Verified for prompt precision, temporal consistency, and master color grading</p>
            </div>
            <Link
              to="/discover"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map((c) => (
              <CreatorCard key={c._id} creator={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
