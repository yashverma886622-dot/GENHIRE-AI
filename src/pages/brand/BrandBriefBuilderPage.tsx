import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';

export const BrandBriefBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // AI Prompt Input
  const [aiPrompt, setAiPrompt] = useState<string>(
    'I need a premium futuristic fashion advertisement for Instagram targeting Gen Z. It should be cinematic, vertical and suitable for commercial use.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<'ai' | 'fallback' | null>(null);

  // Structured Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('Video Ad');
  const [stylesStr, setStylesStr] = useState('Cinematic, Luxury, Futuristic');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [platform, setPlatform] = useState('Instagram');
  const [commercialUse, setCommercialUse] = useState(true);
  const [territory, setTerritory] = useState('India & South Asia');
  const [usageTerm, setUsageTerm] = useState('12 Months Digital Rights');
  const [exclusivity, setExclusivity] = useState('Category Exclusive (Apparel)');
  const [outputOwnership, setOutputOwnership] = useState('Full Master Asset Buyout with Source Prompts');
  const [preferredToolsStr, setPreferredToolsStr] = useState('Runway Gen-3 Alpha, Midjourney v6, Flux.1 Pro');
  const [creatorRequirementsStr, setCreatorRequirementsStr] = useState(
    'Proven portfolio in AI fashion or luxury video\nDemonstrated 9:16 vertical video capability\nDelivery of high-bitrate master MP4'
  );
  const [budget, setBudget] = useState<number>(35000);
  const [deadline, setDeadline] = useState('2026-11-20');
  const [revisionRounds, setRevisionRounds] = useState<number>(2);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await api.buildBriefWithAi(aiPrompt);
      const data = res.brief;
      setTitle(data.title);
      setDescription(data.description);
      setContentType(data.contentType);
      setStylesStr(data.styles.join(', '));
      setAspectRatio(data.aspectRatio);
      setPlatform(data.platform);
      setCommercialUse(data.commercialUse);
      setPreferredToolsStr(data.preferredTools.join(', '));
      setCreatorRequirementsStr(data.creatorRequirements.join('\n'));
      setBudget(data.suggestedBudget);
      setGenerationSource(res.isAiGenerated ? 'ai' : 'fallback');
    } catch (err: unknown) {
      console.warn('AI brief generation error:', err);
      setErrorMessage('Could not generate brief with AI. Please fill the structured fields manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !contentType || !budget || !deadline) {
      setErrorMessage('Please fill all mandatory fields (Title, Description, Content Type, Budget, Deadline).');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const styles = stylesStr.split(',').map(s => s.trim()).filter(Boolean);
      const preferredTools = preferredToolsStr.split(',').map(s => s.trim()).filter(Boolean);
      const creatorRequirements = creatorRequirementsStr.split('\n').map(s => s.trim()).filter(Boolean);

      const res = await api.createBrief({
        title,
        description,
        contentType,
        styles,
        aspectRatio,
        platform,
        commercialUse,
        commercialUseDetails: {
          territory,
          usageTerm,
          exclusivity,
          outputOwnership,
        },
        preferredTools,
        creatorRequirements,
        budget: Number(budget),
        deadline,
        revisionRounds: Number(revisionRounds),
        status: 'active',
      });

      // Navigate to the brief's matching view
      navigate(`/brand/briefs/${res.brief._id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save creative brief';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/brand/briefs"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Campaign Briefs
          </Link>
        </div>

        {/* AI Brief Assistant Box */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-md shadow-purple-900/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">AI-Assisted Brief Builder</h2>
                <p className="text-xs text-slate-500">
                  Describe what you want to create in natural language. Gemini converts it into structured campaign fields.
                </p>
              </div>
            </div>

            {generationSource === 'ai' && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>AI Generated</span>
              </span>
            )}
            {generationSource === 'fallback' && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Deterministic Specification
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              What are you looking to create?
            </label>
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. I need a premium futuristic fashion advertisement for Instagram targeting Gen Z. It should be cinematic, vertical and suitable for commercial use."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={isGenerating || !aiPrompt.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Structuring Campaign...' : 'Generate Structured Brief'}</span>
            </button>
          </div>
        </div>

        {/* Structured Form Area */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">Campaign Specifications & Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and adjust fields before publishing to the marketplace.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveBrief} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Festive High-Fashion Reel — Futuristic Urban Luxe"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Campaign Scope & Creative Vision
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed deliverables description..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Content Type, Aspect Ratio, Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Video Ad">Video Ad</option>
                  <option value="Fashion Film">Fashion Film</option>
                  <option value="Product Commercial">Product Commercial</option>
                  <option value="Brand Film">Brand Film</option>
                  <option value="Animation">Animation</option>
                  <option value="Travel Video">Travel Video</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="9:16">9:16 (Vertical Reel / Story / Ad)</option>
                  <option value="16:9">16:9 (Cinematic Widescreen / YouTube)</option>
                  <option value="1:1">1:1 (Square Feed)</option>
                  <option value="4:5">4:5 (Portrait Feed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Primary Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Digital OOH">Digital OOH</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
            </div>

            {/* Styles & Preferred Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Styles (comma-separated)
                </label>
                <input
                  type="text"
                  value={stylesStr}
                  onChange={(e) => setStylesStr(e.target.value)}
                  placeholder="Cinematic, Luxury, Futuristic"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Preferred AI Toolchains
                </label>
                <input
                  type="text"
                  value={preferredToolsStr}
                  onChange={(e) => setPreferredToolsStr(e.target.value)}
                  placeholder="Runway Gen-3 Alpha, Midjourney v6"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Commercial Licensing Terms */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Commercial Licensing & Ownership
                  </span>
                </div>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commercialUse}
                    onChange={(e) => setCommercialUse(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Commercial Use Mandatory</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Licensed Territory
                  </label>
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    placeholder="India & South Asia"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Usage Term
                  </label>
                  <input
                    type="text"
                    value={usageTerm}
                    onChange={(e) => setUsageTerm(e.target.value)}
                    placeholder="12 Months Digital Rights"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Exclusivity
                  </label>
                  <input
                    type="text"
                    value={exclusivity}
                    onChange={(e) => setExclusivity(e.target.value)}
                    placeholder="Category Exclusive"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Output Ownership
                  </label>
                  <input
                    type="text"
                    value={outputOwnership}
                    onChange={(e) => setOutputOwnership(e.target.value)}
                    placeholder="Full Master Buyout with Prompts"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Creator Requirements */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Creator Qualification Criteria (1 per line)
              </label>
              <textarea
                rows={3}
                value={creatorRequirementsStr}
                onChange={(e) => setCreatorRequirementsStr(e.target.value)}
                placeholder="Specific creator experience requirements..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Budget, Deadline, Revision Rounds */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Budget (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    min={5000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Included Revision Rounds
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={revisionRounds}
                  onChange={(e) => setRevisionRounds(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-2"
              >
                <span>{isSaving ? 'Publishing Brief...' : 'Publish Brief & Find Matching Creators'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
