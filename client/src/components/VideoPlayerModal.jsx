import React, { useEffect } from 'react';
import { X, Film, Sparkles } from 'lucide-react';

export const VideoPlayerModal = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  // Helper to extract or format embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const id = urlParams.get('v');
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(video.videoUrl);
  const isEmbed = embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com');

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-zinc-900/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Responsive Video Container */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
          {isEmbed ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-4 w-full px-2 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-600/80 text-white font-semibold uppercase">
              {video.category || 'Cinematic Film'}
            </span>
            {video.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Featured Showcase
              </span>
            )}
          </div>
          <h3 className="font-heading text-xl font-bold text-white tracking-wide">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
