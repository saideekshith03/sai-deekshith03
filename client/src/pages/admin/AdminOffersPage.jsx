import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Eye, EyeOff, Zap, Play, X, Calendar, CheckCircle2 } from 'lucide-react';
import { apiFetch, formatRupee } from '../../utils/api';

export const AdminOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [tab, setTab] = useState('all'); // 'all', 'active', 'scheduled', 'expired', 'draft'
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const initialForm = {
    title: '',
    description: '',
    originalPrice: 50000,
    discountedPrice: 40000,
    discountPercentage: 20,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    bannerImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    videoUrl: '',
    applicableCategories: 'Weddings, Traditional Events',
    isPublished: true
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch(`/offers?all=true&tab=${tab}`);
      if (res.success) {
        setOffers(res.offers || []);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [tab]);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      originalPrice: offer.originalPrice || 0,
      discountedPrice: offer.discountedPrice || 0,
      discountPercentage: offer.discountPercentage || 0,
      startDate: offer.startDate || '',
      expiryDate: offer.expiryDate || '',
      bannerImage: offer.bannerImage || '',
      videoUrl: offer.videoUrl || '',
      applicableCategories: Array.isArray(offer.applicableCategories) ? offer.applicableCategories.join(', ') : (offer.applicableCategories || ''),
      isPublished: offer.isPublished
    });
    setModalOpen(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await apiFetch(`/offers/${editingOffer.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/offers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setModalOpen(false);
      fetchOffers();
    } catch (err) {
      alert(err.message || 'Failed to save offer');
    }
  };

  const handleTogglePublish = async (offer) => {
    try {
      await apiFetch(`/offers/${offer.id}/publish`, { method: 'PATCH' });
      fetchOffers();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteOffer = async (offer) => {
    if (!window.confirm(`Are you sure you want to delete offer "${offer.title}"?`)) return;
    try {
      await apiFetch(`/offers/${offer.id}`, { method: 'DELETE' });
      fetchOffers();
    } catch (err) {
      alert(err.message || 'Failed to delete offer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Manage Offers & Discounts
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create limited-time promotions, wedding season discounts, and attach promotional videos.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Offer</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {['all', 'active', 'scheduled', 'expired', 'draft'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              tab === t
                ? 'bg-red-600 text-white font-bold'
                : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {t} Offers
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`rounded-3xl p-6 bg-zinc-950 border transition-all shadow-xl flex flex-col justify-between ${
              offer.status === 'active' ? 'border-white/10' : 'border-zinc-800 opacity-65'
            }`}
          >
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <img
                  src={offer.bannerImage}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-600 text-white font-heading font-black text-xs flex items-center gap-1 shadow">
                  <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{offer.discountPercentage}% OFF</span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 text-amber-300">
                  Status: {offer.status}
                </div>
              </div>

              <h3 className="font-heading font-bold text-base text-white mb-1">{offer.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{offer.description}</p>

              <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 mb-3">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-heading font-black text-xl text-white">
                    {formatRupee(offer.discountedPrice)}
                  </span>
                  {offer.originalPrice > 0 && (
                    <span className="text-zinc-500 line-through">
                      {formatRupee(offer.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Expires: {offer.expiryDate || 'No Expiry Set'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(offer)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {offer.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{offer.isPublished ? 'Draft' : 'Publish'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(offer)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                  title="Edit Offer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteOffer(offer)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400"
                  title="Delete Offer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Offer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-heading font-black text-xl text-white">
                {editingOffer ? 'Edit Special Offer' : 'Create Special Offer'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Wedding Season Special: Flat 20% OFF"
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

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => {
                      const orig = Number(e.target.value);
                      const disc = formData.discountedPrice;
                      const percent = orig > 0 && disc > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;
                      setFormData(prev => ({ ...prev, originalPrice: orig, discountPercentage: percent }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountedPrice}
                    onChange={(e) => {
                      const disc = Number(e.target.value);
                      const orig = formData.originalPrice;
                      const percent = orig > 0 && disc > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;
                      setFormData(prev => ({ ...prev, discountedPrice: disc, discountPercentage: percent }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 text-red-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Expiry Date (Auto Archive)</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, bannerImage: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Promo Video URL (Optional)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/embed/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-zinc-400">Applicable Categories (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.applicableCategories}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicableCategories: e.target.value }))}
                  placeholder="Weddings, Traditional Events"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
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
                  {editingOffer ? 'Save Offer' : 'Publish Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
