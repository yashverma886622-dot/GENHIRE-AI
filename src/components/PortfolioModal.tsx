import React from 'react';
import { X, Play, ShieldCheck, Cpu, Layers, Tag, ExternalLink } from 'lucide-react';
import { PortfolioItem, CreatorProfile } from '../types/index.ts';
import { VideoPlayer } from './VideoPlayer.tsx';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  creator?: CreatorProfile | null;
  onClose: () => void;
  onInvite?: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  item,
  creator,
  onClose,
  onInvite,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                item.assetType === 'video'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
              }`}
            >
              {item.assetType === 'video' ? '🎬 Playable AI Video' : '🖼️ AI Visual Art'}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {item.aspectRatio} Aspect
            </span>
            {item.commercialUse && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Commercial Ready
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Media Player Area */}
          <div className="mb-6 bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            {item.assetType === 'video' ? (
              <div className="w-full flex justify-center py-2 bg-slate-950">
                <VideoPlayer
                  src={item.assetUrl}
                  poster={item.thumbnailUrl}
                  aspectRatio={item.aspectRatio}
                  title={item.title}
                />
              </div>
            ) : (
              <div className="w-full flex justify-center bg-slate-950 p-2">
                <img
                  src={item.assetUrl}
                  alt={item.title}
                  className="max-h-[500px] w-auto object-contain rounded-lg"
                  onError={(e) => {
                    // Graceful fallback image
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Creator Bar if provided */}
            {creator && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}`}
                    alt={creator.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{creator.name}</h4>
                    <p className="text-xs text-slate-500">{creator.headline} • {creator.location}</p>
                  </div>
                </div>
                {onInvite && (
                  <button
                    onClick={onInvite}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                  >
                    Invite for Brief
                  </button>
                )}
              </div>
            )}

            {/* AI Stack Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AI Tools */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  <Cpu className="w-4 h-4 mr-1.5 text-blue-600" />
                  AI Tools & Models
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.toolsUsed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md"
                    >
                      {tool}
                    </span>
                  ))}
                  {item.modelsUsed.map((model, idx) => (
                    <span
                      key={`m-${idx}`}
                      className="px-2.5 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-md"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Styles & Content Type */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  <Tag className="w-4 h-4 mr-1.5 text-cyan-600" />
                  Styles & Format
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-md">
                    {item.contentType}
                  </span>
                  {item.styles.map((style, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-md"
                    >
                      {style}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                    Ratio: {item.aspectRatio}
                  </span>
                </div>
              </div>
            </div>

            {/* Workflow steps */}
            {item.workflow && item.workflow.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  <Layers className="w-4 h-4 mr-1.5 text-blue-600" />
                  Production Workflow Pipeline
                </div>
                <ol className="space-y-2">
                  {item.workflow.map((step, idx) => (
                    <li key={idx} className="flex items-start text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-2 shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            GenHire AI-Native Portfolio Specification
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
