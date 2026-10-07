import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { Brief } from '../../types/index.ts';
import {
  FileText,
  Plus,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const BrandBriefsListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);

  const fetchBriefs = async () => {
    try {
      const res = await api.getBriefs();
      setBriefs(res.briefs);
    } catch (err) {
      console.error('Failed to load briefs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brief?')) return;
    try {
      await api.deleteBrief(id);
      setBriefs(briefs.filter(b => b._id !== id));
      setDeleteMsg('Brief deleted successfully.');
      setTimeout(() => setDeleteMsg(null), 3000);
    } catch (err) {
      alert('Failed to delete brief.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading campaign briefs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Campaign Creative Briefs</h1>
            <p className="text-xs text-slate-500">
              Manage campaign scopes, output ownership details, and evaluate matched creators.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/brand/briefs/new"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Brief Builder</span>
            </Link>
          </div>
        </div>

        {deleteMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{deleteMsg}</span>
          </div>
        )}

        {/* Briefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {briefs.map((brief) => (
            <div
              key={brief._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {brief.status}
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    ₹{brief.budget.toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {brief.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {brief.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div>
                    <span className="text-slate-400 block">Content Type</span>
                    <span className="font-bold text-slate-800">{brief.contentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Aspect Ratio</span>
                    <span className="font-bold text-slate-800">{brief.aspectRatio}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Platform</span>
                    <span className="font-bold text-slate-800">{brief.platform}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Target Deadline</span>
                    <span className="font-bold text-slate-800">{brief.deadline}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {brief.styles.map((style, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200"
                    >
                      {style}
                    </span>
                  ))}
                  {brief.commercialUse && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ Commercial Use
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleDelete(brief._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete brief"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to={`/brand/briefs/${brief._id}`}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
                >
                  <span>Find Creators & Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
