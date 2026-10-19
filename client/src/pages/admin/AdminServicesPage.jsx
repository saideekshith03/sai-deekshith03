import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit2, CheckCircle2, Eye, EyeOff, X } from 'lucide-react';
import { apiFetch, formatRupee } from '../../utils/api';

export const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const initialForm = {
    title: '',
    category: 'Weddings',
    shortDesc: '',
    fullDesc: '',
    priceStarting: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    features: '4K Ultra HD\nExperienced Crew\nInstant Highlight Teaser'
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch('/services?all=true');
      if (res.success) {
        setServices(res.services || []);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      title: srv.title || '',
      category: srv.category || 'Weddings',
      shortDesc: srv.shortDesc || '',
      fullDesc: srv.fullDesc || '',
      priceStarting: srv.priceStarting || 0,
      imageUrl: srv.imageUrl || '',
      features: Array.isArray(srv.features) ? srv.features.join('\n') : (srv.features || '')
    });
    setModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features.split('\n').map(f => f.trim()).filter(Boolean)
      };

      if (editingService) {
        await apiFetch(`/services/${editingService.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/services', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (srv) => {
    if (!window.confirm(`Delete service "${srv.title}"?`)) return;
    try {
      await apiFetch(`/services/${srv.id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Manage Studio Services
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Add, update starting prices, and edit service descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl p-6 bg-zinc-950 border border-white/10 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-3">
                <img src={srv.imageUrl} alt={srv.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 text-white font-bold">
                  {srv.category}
                </div>
              </div>

              <h3 className="font-heading font-bold text-lg text-white mb-1">{srv.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{srv.shortDesc}</p>

              <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 mb-3">
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Starting Price</div>
                <div className="font-heading font-black text-xl text-white">
                  {formatRupee(srv.priceStarting)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-mono">
                {srv.features?.length || 0} features
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(srv)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400"
                  title="Delete Service"
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
          <div className="max-w-lg w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-black text-xl text-white">
                {editingService ? 'Edit Service' : 'Add Studio Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    <option value="Baby & Family">Baby & Family</option>
                    <option value="Cinematic Videos">Cinematic Videos</option>
                    <option value="Studio & Portraits">Studio & Portraits</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.priceStarting}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceStarting: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Short Summary</label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Full Description</label>
                <textarea
                  rows="2"
                  value={formData.fullDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullDesc: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Features Checklist (One per line)</label>
                <textarea
                  rows="2"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Service Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
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
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
