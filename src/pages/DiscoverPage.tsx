import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Film,
  Layers,
} from 'lucide-react';
import { CreatorProfile } from '../types/index.ts';
import { api } from '../services/api.ts';
import { CreatorCard } from '../components/CreatorCard.tsx';

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Filter state synchronized with URL search params
  const search = searchParams.get('search') || '';
  const specialization = searchParams.get('specialization') || '';
  const tool = searchParams.get('tool') || '';
  const model = searchParams.get('model') || '';
  const contentType = searchParams.get('contentType') || '';
  const style = searchParams.get('style') || '';
  const aspectRatio = searchParams.get('aspectRatio') || '';
  const commercialUse = searchParams.get('commercialUse') || '';
  const verified = searchParams.get('verified') || '';
  const sort = searchParams.get('sort') || 'best_match';

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const relaxRequirements = () => {
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchFilteredCreators = async () => {
      setIsLoading(true);
      try {
        const queryParams: Record<string, string> = {};
        if (search) queryParams.search = search;
        if (specialization) queryParams.specialization = specialization;
        if (tool) queryParams.tool = tool;
        if (model) queryParams.model = model;
        if (contentType) queryParams.contentType = contentType;
        if (style) queryParams.style = style;
        if (aspectRatio) queryParams.aspectRatio = aspectRatio;
        if (commercialUse) queryParams.commercialUse = commercialUse;
        if (verified) queryParams.verified = verified;
        if (sort) queryParams.sort = sort;

        const res = await api.getCreators(queryParams);
        setCreators(res.creators);
      } catch (err) {
        console.error('Error fetching creators:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredCreators();
  }, [searchParams]);

  const activeFilterCount = [
    specialization,
    tool,
    model,
    contentType,
    style,
    aspectRatio,
    commercialUse === 'true',
    verified === 'true',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Discover AI Content Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified Indian generative video directors and visual artists by their actual toolchains, workflows, and playable media.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by creator name, tool (Runway, Midjourney), specialization, or city..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="py-2 pl-2.5 pr-8 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="best_match">Best Match / High Rating</option>
                <option value="rating">Rating (Highest First)</option>
                <option value="projects">Projects Completed</option>
                <option value="rate_asc">Rate: Low to High (₹)</option>
                <option value="rate_desc">Rate: High to Low (₹)</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Filter Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel (Desktop & Mobile Drawer) */}
          <div
            className={`lg:block ${
              showMobileFilters ? 'block' : 'hidden'
            } bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 self-start`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Filter Capabilities</h3>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear ({activeFilterCount})</span>
                </button>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => updateFilter('specialization', e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="">All Specializations</option>
                <option value="Fashion">Fashion & Haute Couture</option>
                <option value="Automotive">Automotive & EV</option>
                <option value="Cinematic VFX">Cinematic VFX & Sci-Fi</option>
                <option value="Streetwear">Streetwear & Gen Z</option>
                <option value="Food & Beverage">Food & Beverage (Sensory)</option>
                <option value="Beauty & Luxury">Beauty, Perfume & Luxury</option>
                <option value="Sports">Sports & Human Kinetics</option>
                <option value="Travel">Travel & Culture Documentary</option>
                <option value="Character & Animation">Character Mascot & Anime</option>
                <option value="Architecture">Architecture & Spatial AI</option>
              </select>
            </div>

            {/* AI Tool */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                AI Video & Visual Tool
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Runway Gen-3 Alpha',
                  'Midjourney v6',
                  'Flux.1 Pro',
                  'Kling AI',
                  'Luma Dream Machine',
                  'ComfyUI',
                ].map((t) => {
                  const isSelected = tool.toLowerCase() === t.toLowerCase();
                  return (
                    <button
                      key={t}
                      onClick={() => updateFilter('tool', isSelected ? '' : t)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Content Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Video Ad',
                  'Fashion Film',
                  'Product Commercial',
                  'Brand Film',
                  'Animation',
                ].map((ct) => {
                  const isSelected = contentType.toLowerCase() === ct.toLowerCase();
                  return (
                    <button
                      key={ct}
                      onClick={() => updateFilter('contentType', isSelected ? '' : ct)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ct}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Supported Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['9:16', '16:9', '1:1', '4:5'].map((ratio) => {
                  const isSelected = aspectRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      onClick={() => updateFilter('aspectRatio', isSelected ? '' : ratio)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ratio}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Aesthetic Style
              </label>
              <select
                value={style}
                onChange={(e) => updateFilter('style', e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="">All Styles</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Luxury">Luxury & Haute</option>
                <option value="Futuristic">Futuristic & Cyber</option>
                <option value="Gen Z / Glitch">Gen Z / Glitch</option>
                <option value="Sensory">Sensory & Artisanal</option>
                <option value="Hyper-realistic">Hyper-realistic</option>
                <option value="Minimalist">Minimalist</option>
              </select>
            </div>

            {/* Checkbox toggles: Commercial Use & Verification */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={commercialUse === 'true'}
                  onChange={(e) => updateFilter('commercialUse', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Commercial-Use Certified Only
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verified === 'true'}
                  onChange={(e) => updateFilter('verified', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-700 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  Platform Verified Signals
                </span>
              </label>
            </div>
          </div>

          {/* Creators Listing Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-slate-500 mt-3">
                  Matching AI creators across database...
                </p>
              </div>
            ) : creators.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500">
                    Showing <span className="text-slate-900">{creators.length}</span> creators
                  </span>
                  {activeFilterCount > 0 && (
                    <div className="flex items-center space-x-1.5 text-xs text-blue-600">
                      <span>Filters applied: {activeFilterCount}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creators.map((creator) => (
                    <CreatorCard key={creator._id} creator={creator} />
                  ))}
                </div>
              </div>
            ) : (
              /* EMPTY SEARCH RESULTS (Requirement 20) */
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No creators match these requirements.
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We couldn't find any creators matching your current combination of tool, specialization, and format filters. Try relaxing one or more parameters.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={relaxRequirements}
                    className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                  >
                    Relax Requirements
                  </button>
                  <button
                    onClick={() => {
                      updateFilter('specialization', '');
                      updateFilter('tool', '');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Show Closest Matches
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
