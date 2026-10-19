import React, { useState, useEffect } from 'react';
import { Film, Plus, Trash2, Edit2, Play, Sparkles, X } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export const AdminVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const initialForm = {
    title: '',
    description: '',
    category: 'Weddings',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    isFeatured: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch('/videos');
      if (res.success) {
        setVideos(res.videos || []);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenAdd = () => {
    setEditingVideo(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVideo(v);
    setFormData({
      title: v.title || '',
      description: v.description || '',
      category: v.category || 'Weddings',
      videoUrl: v.videoUrl || '',
      thumbnailUrl: v.thumbnailUrl || '',
      isFeatured: !!v.isFeatured
    });
    setModalOpen(true);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await apiFetch(`/videos/${editingVideo.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/videos', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      alert(err.message || 'Failed to save video');
    }
  };

  const handleToggleFeatured = async (v) => {
    try {
      await apiFetch(`/videos/${v.id}/feature`, { method: 'PATCH' });
      fetchVideos();
    } catch (err) {
      alert(err.message || 'Failed to toggle featured status');
    }
  };

  const handleDeleteVideo = async (v) => {
    if (!window.confirm(`Are you sure you want to delete video "${v.title}"?`)) return;
    try {
      await apiFetch(`/videos/${v.id}`, { method: 'DELETE' });
      fetchVideos();
    } catch (err) {
      alert(err.message || 'Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Manage Videos & Cinematic Reels
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Publish wedding teasers, studio tour videos, and set homepage featured videos.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div
            key={v.id}
            className="rounded-3xl p-6 bg-zinc-950 border border-white/10 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 text-white">
                  {v.category}
                </div>
                {v.isFeatured && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500 text-black font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </div>
                )}
              </div>

              <h3 className="font-heading font-bold text-base text-white mb-1 line-clamp-1">{v.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{v.description}</p>
              <div className="text-[11px] font-mono text-zinc-500 truncate">{v.videoUrl}</div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleToggleFeatured(v)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  v.isFeatured
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {v.isFeatured ? '★ Featured on Home' : 'Set as Featured'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                  title="Edit Video"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVideo(v)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400"
                  title="Delete Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-black text-xl text-white">
                {editingVideo ? 'Edit Video Details' : 'Publish Video Reel'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Video Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="Weddings">Weddings</option>
                  <option value="Traditional Events">Traditional Events</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Studio Photography">Studio Photography</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Video URL (YouTube Embed or MP4) *</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded bg-zinc-900 text-red-600"
                />
                <label htmlFor="featuredCheck" className="text-zinc-300 cursor-pointer">
                  Feature on Homepage Showcase
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-950 cursor-pointer"
                >
                  {editingVideo ? 'Update Video' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
