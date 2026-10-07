import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  Play,
  ShieldCheck,
  Cpu,
  Layers,
  Film,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { CreatorProfile, PortfolioItem } from '../types/index.ts';
import { api } from '../services/api.ts';
import { CreatorCard } from '../components/CreatorCard.tsx';
import { PortfolioModal } from '../components/PortfolioModal.tsx';
import { VideoPlayer } from '../components/VideoPlayer.tsx';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<PortfolioItem[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creatorsRes, creatorDetailsRes] = await Promise.all([
          api.getCreators(),
          api.getCreatorById('creator_1'), // Fetch Creator 1 with portfolio
        ]);
        setCreators(creatorsRes.creators.slice(0, 6));

        // Get video portfolios from multiple creators
        const creator2Details = await api.getCreatorById('creator_2');
        const creator4Details = await api.getCreatorById('creator_4');

        const combinedVideos = [
          ...creatorDetailsRes.portfolio.filter(p => p.assetType === 'video'),
          ...creator2Details.portfolio.filter(p => p.assetType === 'video'),
          ...creator4Details.portfolio.filter(p => p.assetType === 'video'),
        ].slice(0, 3);

        setFeaturedVideos(combinedVideos);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-100 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-Native Creative Talent Marketplace for India</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Find the Right <span className="text-blue-600">AI Creator</span> for Your Next Campaign
              <span className="text-red-500">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop guessing prompt styles. Discover vetted directors by their actual AI toolchains, models used, aspect ratios, and <strong className="text-slate-800 font-semibold">real playable video portfolios</strong>.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 max-w-2xl mx-auto p-2 bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Try 'AI Fashion Film 9:16', 'Runway EV commercial', or 'Sensory Coffee'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>Search Creators</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-2">
              <span className="text-slate-400 font-medium">Popular:</span>
              <button
                onClick={() => navigate('/discover?specialization=Fashion')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-full font-medium transition-colors"
              >
                👗 AI Fashion Film
              </button>
              <button
                onClick={() => navigate('/discover?tool=Runway+Gen-3+Alpha')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-full font-medium transition-colors"
              >
                ⚡ Runway Gen-3 Alpha
              </button>
              <button
                onClick={() => navigate('/discover?aspectRatio=9:16')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 border border-slate-200 rounded-full font-medium transition-colors"
              >
                📱 9:16 Vertical Video
              </button>
              <button
                onClick={() => navigate('/discover?specialization=Food+%26+Beverage')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 rounded-full font-medium transition-colors"
              >
                ☕ Sensory Macro Commercials
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Metric Highlights */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">10+ Verified</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Generative AI Directors in India</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">22+ Production</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Playable Video & Visual Items</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100% Guaranteed</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Commercial Use Clearance</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">₹18,000 - ₹50,000</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">Transparent INR Pricing per Brief</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURE: REAL PLAYABLE VIDEO PORTFOLIO SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              <Film className="w-4 h-4" />
              <span>Real Playable Video Media</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Live AI Video Showreels
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              No static mockups. Experience production-grade generative commercials playing right in your browser.
            </p>
          </div>
          <Link
            to="/discover"
            className="mt-4 md:mt-0 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Explore All 20+ Portfolios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVideos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-blue-400 transition-all"
            >
              <div className="p-3 bg-slate-950">
                {/* HTML5 Video Player */}
                <VideoPlayer
                  src={video.assetUrl}
                  poster={video.thumbnailUrl}
                  aspectRatio={video.aspectRatio}
                  title={video.title}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {video.contentType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {video.aspectRatio} Format
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {video.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {video.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPortfolio(video)}
                  className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Play className="w-3.5 h-3.5 fill-blue-600" />
                  <span>View Pipeline & Full Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY GENHIRE IS DIFFERENT (AI-First Marketplace Differentiation) */}
      <section className="py-16 bg-[#F8FAFC] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Built for How AI Creators Actually Work
            </h2>
            <p className="text-sm text-slate-600">
              Generic freelance marketplaces treat AI creation like a keyword. GenHire makes generative pipelines, model checkpoints, and aspect ratios first-class marketplace data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                First-Class AI Toolchain Data
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Filter directly by Runway Gen-3 Alpha, Midjourney v6.1, Flux.1 Pro, Kling 1.5, or custom ComfyUI LoRAs. Know exactly which tools power your assets before engaging.
              </p>
              <div className="flex flex-wrap gap-1 text-[11px] text-blue-700 font-semibold">
                <span>✓ Tool Verification</span> • <span>✓ Temporal Consistency</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                AI-Assisted Brief Builder
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Turn plain ideas into production-ready creative briefs using Gemini AI. Structured with Indian INR budgets, multi-round revisions, and custom commercial rights buyouts.
              </p>
              <div className="flex flex-wrap gap-1 text-[11px] text-purple-700 font-semibold">
                <span>✓ Instant JSON Specs</span> • <span>✓ Full Editability</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Deterministic 100-Pt Matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                No black-box recommendations. Clear weighted scoring across Content Type (30), Aspect Ratio (15), Style (15), Tools (10), License (15), and Budget (10).
              </p>
              <div className="flex flex-wrap gap-1 text-[11px] text-emerald-700 font-semibold">
                <span>✓ Explainable Reasons</span> • <span>✓ Budget Fit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CREATORS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Top Ranked AI Creators
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Based in Mumbai, Bengaluru, Delhi NCR, Hyderabad, and Chennai.
            </p>
          </div>
          <Link
            to="/discover"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All Creators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator._id} creator={creator} />
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Commission Your Next AI Video Campaign?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Create an AI-assisted brief in 30 seconds and receive deterministic matches with certified Indian generative video directors.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/brand/briefs/new"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-blue-700 text-sm font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
            >
              Launch AI Brief Builder
            </Link>
            <Link
              to="/discover"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-700 text-white border border-blue-500 text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors"
            >
              Browse All Creators
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Viewer Modal */}
      {selectedPortfolio && (
        <PortfolioModal
          item={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
          onInvite={() => {
            setSelectedPortfolio(null);
            navigate('/brand/briefs/new');
          }}
        />
      )}
    </div>
  );
};
