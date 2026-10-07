import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { CreatorProfile } from '../../types/index.ts';
import { Save, ArrowLeft, CheckCircle2, ShieldCheck, Layers, Cpu, AlertCircle } from 'lucide-react';

export const CreatorProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('Fashion');
  const [skillsStr, setSkillsStr] = useState('');
  const [toolsStr, setToolsStr] = useState('');
  const [modelsStr, setModelsStr] = useState('');
  const [contentTypesStr, setContentTypesStr] = useState('');
  const [stylesStr, setStylesStr] = useState('');
  const [supportedAspectRatios, setSupportedAspectRatios] = useState<string[]>(['16:9', '9:16']);
  const [commercialUseReady, setCommercialUseReady] = useState(true);
  const [rateFrom, setRateFrom] = useState<number>(25000);
  const [workflowStr, setWorkflowStr] = useState('');

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const res = await api.getCreators();
        const myProfile = res.creators.find(c => c.userId === user?._id) || res.creators[0];
        if (myProfile) {
          setHeadline(myProfile.headline || '');
          setLocation(myProfile.location || 'Mumbai, Maharashtra');
          setBio(myProfile.bio || '');
          setSpecialization(myProfile.specialization || 'Fashion');
          setSkillsStr(myProfile.skills.join(', '));
          setToolsStr(myProfile.tools.join(', '));
          setModelsStr(myProfile.models.join(', '));
          setContentTypesStr(myProfile.contentTypes.join(', '));
          setStylesStr(myProfile.styles.join(', '));
          setSupportedAspectRatios(myProfile.supportedAspectRatios || ['16:9', '9:16']);
          setCommercialUseReady(myProfile.commercialUseReady ?? true);
          setRateFrom(myProfile.rateFrom || 25000);
          setWorkflowStr((myProfile.workflow || []).join('\n'));
        }
      } catch (err) {
        console.error('Error fetching creator profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentProfile();
  }, [user]);

  const toggleRatio = (ratio: string) => {
    if (supportedAspectRatios.includes(ratio)) {
      setSupportedAspectRatios(supportedAspectRatios.filter(r => r !== ratio));
    } else {
      setSupportedAspectRatios([...supportedAspectRatios, ratio]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const tools = toolsStr.split(',').map(s => s.trim()).filter(Boolean);
      const models = modelsStr.split(',').map(s => s.trim()).filter(Boolean);
      const contentTypes = contentTypesStr.split(',').map(s => s.trim()).filter(Boolean);
      const styles = stylesStr.split(',').map(s => s.trim()).filter(Boolean);
      const workflow = workflowStr.split('\n').map(s => s.trim()).filter(Boolean);

      await api.updateCreatorProfile({
        headline,
        location,
        bio,
        specialization,
        skills,
        tools,
        models,
        contentTypes,
        styles,
        supportedAspectRatios,
        commercialUseReady,
        rateFrom: Number(rateFrom),
        workflow,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading profile editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/creator/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-black text-slate-900">
              Edit AI Creator Profile & Capabilities
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ensure your toolchains, supported ratios, and commercial terms are up to date for brand matching.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile updated successfully! New capabilities are active in marketplace discovery.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Headline & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. High-Impact AI Fashion Films & Luxury Commercials"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Location (City, State in India)
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                About & Creative Philosophy
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your generative visual background, brand clientele, and aesthetic approach..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Specialization & Starting Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Primary Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Fashion">Fashion & Haute Couture</option>
                  <option value="Automotive & Tech">Automotive & Tech</option>
                  <option value="Cinematic VFX">Cinematic VFX & Worldbuilding</option>
                  <option value="Streetwear & Gen Z">Streetwear & Gen Z</option>
                  <option value="Food & Beverage">Food & Beverage (Sensory)</option>
                  <option value="Beauty & Luxury">Beauty & Luxury</option>
                  <option value="Sports & Kinetics">Sports & Kinetics</option>
                  <option value="Travel & Culture">Travel & Culture</option>
                  <option value="Character & Animation">Character & Animation</option>
                  <option value="Architecture & Spaces">Architecture & Spaces</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Starting Rate (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    min={5000}
                    step={1000}
                    value={rateFrom}
                    onChange={(e) => setRateFrom(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Tools & Models */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  AI Tools (comma-separated)
                </label>
                <input
                  type="text"
                  value={toolsStr}
                  onChange={(e) => setToolsStr(e.target.value)}
                  placeholder="Runway Gen-3 Alpha, Midjourney v6, Flux.1 Pro"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  AI Models (comma-separated)
                </label>
                <input
                  type="text"
                  value={modelsStr}
                  onChange={(e) => setModelsStr(e.target.value)}
                  placeholder="Runway Gen-3 Alpha Turbo, Flux Schnell, Kling 1.5"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Content Types & Styles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Content Types (comma-separated)
                </label>
                <input
                  type="text"
                  value={contentTypesStr}
                  onChange={(e) => setContentTypesStr(e.target.value)}
                  placeholder="Video Ad, Fashion Film, Product Commercial"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Signature Styles (comma-separated)
                </label>
                <input
                  type="text"
                  value={stylesStr}
                  onChange={(e) => setStylesStr(e.target.value)}
                  placeholder="Cinematic, Luxury, Futuristic, Hyper-realistic"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Supported Aspect Ratios & Commercial Rights */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  Supported Aspect Ratios
                </label>
                <div className="flex flex-wrap gap-3">
                  {['16:9', '9:16', '1:1', '4:5'].map((ratio) => (
                    <label key={ratio} className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={supportedAspectRatios.includes(ratio)}
                        onChange={() => toggleRatio(ratio)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">{ratio}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commercialUseReady}
                    onChange={(e) => setCommercialUseReady(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Certified Ready for Brand Commercial-Use Licensing
                  </span>
                </label>
              </div>
            </div>

            {/* Production Workflow Pipeline */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Multi-Stage Production Workflow (1 step per line)
              </label>
              <textarea
                rows={4}
                value={workflowStr}
                onChange={(e) => setWorkflowStr(e.target.value)}
                placeholder="1. Concept moodboarding & style lock with Midjourney&#10;2. Camera motion pass in Runway Gen-3 Alpha&#10;3. Upscaling with Magnific AI&#10;4. DaVinci Resolve color grading"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
