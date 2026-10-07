import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import { PortfolioItem, CreatorProfile } from '../../types/index.ts';
import {
  Plus,
  Trash2,
  Edit,
  Film,
  Play,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { VideoPlayer } from '../../components/VideoPlayer.tsx';

export const CreatorPortfolioManagePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('Video Ad');
  const [assetType, setAssetType] = useState<'video' | 'image'>('video');
  const [assetUrl, setAssetUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [toolsStr, setToolsStr] = useState('Runway Gen-3 Alpha, Midjourney v6');
  const [modelsStr, setModelsStr] = useState('Runway Gen-3 Alpha Turbo');
  const [stylesStr, setStylesStr] = useState('Cinematic, Luxury');
  const [workflowStr, setWorkflowStr] = useState('1. Midjourney base prompt\n2. Runway Gen-3 motion\n3. Color grade');
  const [commercialUse, setCommercialUse] = useState(true);
  const [tagsStr, setTagsStr] = useState('Commercial, High Definition, 4K');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const res = await api.getCreators();
      const myProfile = res.creators.find(c => c.userId === user?._id) || res.creators[0];
      setCreator(myProfile);
      if (myProfile) {
        const detailRes = await api.getCreatorById(myProfile._id);
        setItems(detailRes.portfolio);
      }
    } catch (err) {
      console.error('Error fetching creator portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setContentType('Video Ad');
    setAssetType('video');
    setAssetUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setThumbnailUrl('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80');
    setAspectRatio('9:16');
    setToolsStr('Runway Gen-3 Alpha, Midjourney v6');
    setModelsStr('Runway Gen-3 Alpha Turbo');
    setStylesStr('Cinematic, Luxury');
    setWorkflowStr('1. Midjourney base prompt\n2. Runway Gen-3 motion\n3. Master grade');
    setCommercialUse(true);
    setTagsStr('Fashion, Commercial, Vertical');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setContentType(item.contentType);
    setAssetType(item.assetType);
    setAssetUrl(item.assetUrl);
    setThumbnailUrl(item.thumbnailUrl);
    setAspectRatio(item.aspectRatio);
    setToolsStr(item.toolsUsed.join(', '));
    setModelsStr(item.modelsUsed.join(', '));
    setStylesStr(item.styles.join(', '));
    setWorkflowStr(item.workflow.join('\n'));
    setCommercialUse(item.commercialUse);
    setTagsStr(item.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      await api.deletePortfolioItem(id);
      setItems(items.filter(i => i._id !== id));
      setFeedbackMsg('Portfolio item deleted.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;

    setIsSubmitting(true);
    try {
      const toolsUsed = toolsStr.split(',').map(s => s.trim()).filter(Boolean);
      const modelsUsed = modelsStr.split(',').map(s => s.trim()).filter(Boolean);
      const styles = stylesStr.split(',').map(s => s.trim()).filter(Boolean);
      const workflow = workflowStr.split('\n').map(s => s.trim()).filter(Boolean);
      const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        title,
        description,
        contentType,
        assetType,
        assetUrl,
        thumbnailUrl: thumbnailUrl || assetUrl,
        aspectRatio,
        toolsUsed,
        modelsUsed,
        styles,
        workflow,
        commercialUse,
        tags,
      };

      if (editingItem) {
        const res = await api.updatePortfolioItem(editingItem._id, payload);
        setItems(items.map(i => (i._id === editingItem._id ? res.item : i)));
        setFeedbackMsg('Portfolio item updated.');
      } else {
        const res = await api.addPortfolioItem(creator._id, payload);
        setItems([res.item, ...items]);
        setFeedbackMsg('New portfolio item published!');
      }

      setIsModalOpen(false);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: unknown) {
      alert('Failed to save portfolio item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading portfolio items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/creator/dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Dashboard
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Portfolio Media</span>
          </button>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h1 className="text-xl font-black text-slate-900">Manage AI Portfolio Media</h1>
              <p className="text-xs text-slate-500">
                Showcase playable HTML5 MP4 videos and high-resolution visuals to brands.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {items.length} Projects Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center space-x-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.assetType === 'video'
                            ? 'bg-red-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {item.assetType.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                        {item.aspectRatio}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.toolsUsed.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.contentType}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      title="Edit item"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Portfolio Item' : 'Upload New AI Portfolio Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Asset Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Asset Media Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAssetType('video')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-1.5 ${
                      assetType === 'video'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Real Playable Video (MP4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssetType('image')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center space-x-1.5 ${
                      assetType === 'image'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>High-Res AI Image</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Neon Silk — Autumn Haute Couture Spec Commercial"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the concept, visual mechanics, and client application..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Vertical Mobile)</option>
                    <option value="1:1">1:1 (Square Feed)</option>
                    <option value="4:5">4:5 (Portrait Feed)</option>
                  </select>
                </div>
              </div>

              {/* Media URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {assetType === 'video' ? 'Direct Browser-Playable MP4 Video URL' : 'Image Asset URL'}
                </label>
                <input
                  type="url"
                  required
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  placeholder="https://...file.mp4"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Thumbnail / Poster Image URL
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Live Preview Tester */}
              {assetType === 'video' && assetUrl && (
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold uppercase text-slate-600 block mb-2">
                    Live HTML5 Playback Test:
                  </span>
                  <div className="max-w-[320px] mx-auto bg-black rounded-lg overflow-hidden">
                    <VideoPlayer src={assetUrl} aspectRatio={aspectRatio} />
                  </div>
                </div>
              )}

              {/* AI Tools & Models */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    AI Tools Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={toolsStr}
                    onChange={(e) => setToolsStr(e.target.value)}
                    placeholder="Runway Gen-3 Alpha, Midjourney v6"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    AI Models Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={modelsStr}
                    onChange={(e) => setModelsStr(e.target.value)}
                    placeholder="Runway Gen-3 Alpha Turbo, Flux Schnell"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Production Workflow Steps (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={workflowStr}
                  onChange={(e) => setWorkflowStr(e.target.value)}
                  placeholder="1. Concept art&#10;2. Motion synthesis&#10;3. Upscaling"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modalCommReady"
                  checked={commercialUse}
                  onChange={(e) => setCommercialUse(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="modalCommReady" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Available for Commercial Use
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Publish Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
