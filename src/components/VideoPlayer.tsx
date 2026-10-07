import React, { useState } from 'react';
import { AlertCircle, Film, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  aspectRatio?: string; // "16:9" | "9:16" | "1:1" | "4:5"
  title?: string;
  className?: string;
  onFallbackAction?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  aspectRatio = '16:9',
  title,
  className = '',
  onFallbackAction,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Aspect ratio mapping to responsive Tailwind CSS classes
  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '9:16':
        return 'aspect-[9/16] max-w-[340px] mx-auto';
      case '1:1':
        return 'aspect-square max-w-[500px] mx-auto';
      case '4:5':
        return 'aspect-[4/5] max-w-[420px] mx-auto';
      case '16:9':
      default:
        return 'aspect-video w-full';
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900 border border-slate-200 shadow-sm ${getAspectRatioClass(aspectRatio)} ${className}`}>
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50 border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-900 mb-1">
            Video preview unavailable
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mb-4">
            Unable to stream media from external source. The video file format or network host may be temporarily unreachable.
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 inline-flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry Load
            </button>
            {onFallbackAction && (
              <button
                onClick={onFallbackAction}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                View Project Details
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <video
            src={src}
            poster={poster}
            controls
            preload="metadata"
            playsInline
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="w-full h-full object-contain bg-black"
            aria-label={title || 'AI Portfolio Video'}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 pointer-events-none">
              <div className="flex items-center space-x-2 text-white text-xs bg-slate-800/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Film className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Loading video stream...</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
