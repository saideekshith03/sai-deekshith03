import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Eye, Sparkles, X, Calendar } from 'lucide-react';
import { apiFetch, formatDate } from '../../utils/api';

export const AdminGalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const initialForm = {
    title: '',
    category: 'Weddings',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    shootDate: new Date().toISOString().split('T')[0],
    eventType: 'Wedding',
    featured: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const query = categoryFilter === 'All' ? '/gallery' : `/gallery?category=${categoryFilter}`;
      const res = await apiFetch(query);
      if (res.success) {
        setGallery(res.gallery || []);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [categoryFilter]);

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/gallery', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setModalOpen(false);
      setFormData(initialForm);
      fetchGallery();
    } catch (err) {
      alert(err.message || 'Failed to add photo');
    }
  };

  const handleDeletePhoto = async (photo) => {
    if (!window.confirm(`Delete photo "${photo.title}"?`)) return;
    try {
      await apiFetch(`/gallery/${photo.id}`, { method: 'DELETE' });
      fetchGallery();
    } catch (err) {
      alert(err.message || 'Failed to delete photo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Manage Photo Gallery
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Add new high-definition photographs, organize categories, and feature on homepage.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photograph</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {['All', 'Weddings', 'Traditional Events', 'Engagements', 'Birthdays', 'Studio Photography'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-red-600 text-white font-bold'
                : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((photo) => (
          <div
            key={photo.id}
            className="group relative rounded-2xl overflow-hidden aspect-square bg-zinc-950 border border-white/10 shadow-xl"
          >
            <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
            
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white font-bold">
              {photo.category}
            </div>

            {photo.featured && (
              <div className="absolute top-2 right-2 p-1 rounded-full bg-amber-500 text-black">
                <Sparkles className="w-3 h-3" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <div className="font-bold text-white text-xs truncate">{photo.title}</div>
              <div className="text-[10px] text-zinc-400 font-mono">{formatDate(photo.shootDate)}</div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDeletePhoto(photo)}
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-black text-lg text-white">Add Photograph to Gallery</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Photo Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Sacred Muhurtham Moments"
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
                  <option value="Engagements">Engagements</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Studio Photography">Studio Photography</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Shoot Date</label>
                <input
                  type="date"
                  value={formData.shootDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, shootDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded bg-zinc-900 text-red-600"
                />
                <label htmlFor="featCheck" className="text-zinc-300 cursor-pointer">
                  Feature on Homepage Gallery Section
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
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
