import React, { useState, useEffect } from 'react';
import { Film, Play, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

export const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Weddings', 'Traditional Events', 'Birthdays', 'Studio Photography'];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch('/videos');
        if (data.success) {
          setVideos(data.videos || []);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5 text-amber-400" /> 4K Ultra HD & Anamorphic Cinema
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Cinematic Highlights, Teasers & Reels
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Experience our film-like storytelling, drone aerial perspectives, and heartfelt color-graded wedding movies.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950 font-bold'
                  : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-red-500/50 shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video overflow-hidden cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/80 text-white">
                    {video.category}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 hover:border-red-500 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Cinematic Reel</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
};
