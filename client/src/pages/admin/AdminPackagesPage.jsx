import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, CheckCircle2, X } from 'lucide-react';
import { apiFetch, formatRupee } from '../../utils/api';

export const AdminPackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const initialForm = {
    name: '',
    category: 'Weddings',
    price: 35000,
    originalPrice: 45000,
    duration: '1 Full Day',
    photographersCount: 1,
    videographersCount: 1,
    albumDetails: '1 Premium Canvera Style Photobook (30 Sheets)',
    editedPhotosCount: '200+ High-Res Photos',
    cinematicVideoDetails: 'Full HD Traditional Video + 2-min Teaser',
    additionalFeatures: 'Drone aerial shots included\n1 16x24 Glossy Wall Mount Frame',
    description: 'High-energy coverage of all precious rituals and family celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    isPopular: false
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch('/packages?all=true');
      if (res.success) {
        setPackages(res.packages || []);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const editParam = searchParams.get('edit');
  useEffect(() => {
    if (editParam && packages.length > 0) {
      const pkgToEdit = packages.find(p => String(p.id) === String(editParam));
      if (pkgToEdit) {
        handleOpenEdit(pkgToEdit);
      }
    }
  }, [editParam, packages]);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPackage(null);
    if (searchParams.get('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || '',
      category: pkg.category || 'Weddings',
      price: pkg.price || 0,
      originalPrice: pkg.originalPrice || '',
      duration: pkg.duration || '',
      photographersCount: pkg.photographersCount || 1,
      videographersCount: pkg.videographersCount || 0,
      albumDetails: pkg.albumDetails || '',
      editedPhotosCount: pkg.editedPhotosCount || '',
      cinematicVideoDetails: pkg.cinematicVideoDetails || '',
      additionalFeatures: Array.isArray(pkg.additionalFeatures) ? pkg.additionalFeatures.join('\n') : (pkg.additionalFeatures || ''),
      description: pkg.description || '',
      imageUrl: pkg.imageUrl || '',
      isPopular: !!pkg.isPopular
    });
    setModalOpen(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        await apiFetch(`/packages/${editingPackage.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/packages', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      handleCloseModal();
      fetchPackages();
    } catch (err) {
      alert(err.message || 'Failed to save package');
    }
  };

  const handleTogglePublish = async (pkg) => {
    try {
      await apiFetch(`/packages/${pkg.id}/publish`, { method: 'PATCH' });
      fetchPackages();
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const handleDeletePackage = async (pkg) => {
    if (!window.confirm(`Are you sure you want to delete package "${pkg.name}"?`)) return;
    try {
      await apiFetch(`/packages/${pkg.id}`, { method: 'DELETE' });
      fetchPackages();
    } catch (err) {
      alert(err.message || 'Failed to delete package');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Manage Event Packages & Pricing
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create, edit, change prices, and toggle published packages. Changes reflect instantly on website.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Package Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-3xl p-6 bg-zinc-950 border transition-all shadow-xl flex flex-col justify-between ${
              pkg.isPublished ? 'border-white/10' : 'border-dashed border-zinc-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span className="text-red-400 uppercase font-bold">{pkg.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  pkg.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {pkg.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-white mb-1">{pkg.name}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{pkg.description}</p>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1 mb-4">
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Current Published Price</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-black text-2xl text-white">
                    {formatRupee(pkg.price)}
                  </span>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <span className="text-xs text-zinc-500 line-through">
                      {formatRupee(pkg.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs text-zinc-300 mb-4">
                <div className="text-[11px] text-zinc-400">Duration: <strong>{pkg.duration}</strong></div>
                <div className="text-[11px] text-zinc-400">Team: <strong>{pkg.photographersCount} Photo, {pkg.videographersCount} Cine</strong></div>
              </div>
            </div>

            {/* Controls */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTogglePublish(pkg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  pkg.isPublished
                    ? 'bg-zinc-900 text-zinc-300 hover:text-white'
                    : 'bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600'
                }`}
              >
                {pkg.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{pkg.isPublished ? 'Unpublish' : 'Publish'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                  title="Edit Package"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg)}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950/80 text-zinc-500 hover:text-red-400"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-heading font-black text-xl text-white">
                {editingPackage ? 'Edit Event Package' : 'Create New Event Package'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Royal Telugu Wedding Cinematic Package"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Event Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Traditional Events">Traditional Events</option>
                    <option value="Birthdays">Birthdays</option>
                    <option value="Engagements">Engagements</option>
                    <option value="Baby & Family">Baby & Family</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Duration *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 1 Full Day (Muhurtham & Reception)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Published Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Original Price (₹) (Optional strikethrough)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Photographers Count</label>
                  <input
                    type="number"
                    value={formData.photographersCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, photographersCount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-zinc-400">Videographers Count</label>
                  <input
                    type="number"
                    value={formData.videographersCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, videographersCount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Photo Album Details</label>
                  <input
                    type="text"
                    value={formData.albumDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, albumDetails: e.target.value }))}
                    placeholder="e.g. 1 Luxury Acrylic Cover Album (40 Sheets / 200 Photos)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Edited Photographs Included</label>
                  <input
                    type="text"
                    value={formData.editedPhotosCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, editedPhotosCount: e.target.value }))}
                    placeholder="e.g. 250+ Retouched Master Photos + Soft Copies on Pendrive"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Cinematic Video Options</label>
                  <input
                    type="text"
                    value={formData.cinematicVideoDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, cinematicVideoDetails: e.target.value }))}
                    placeholder="e.g. 4K Cinematic Teaser + Traditional Video + Drone"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Additional Inclusions (One per line)</label>
                  <textarea
                    rows="2"
                    value={formData.additionalFeatures}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalFeatures: e.target.value }))}
                    placeholder="Pre-wedding shoot included&#10;1 16x24 Frame"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Package Description</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-mono uppercase text-zinc-400">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="rounded bg-zinc-900 border-white/10 text-red-600 focus:ring-0"
                  />
                  <label htmlFor="isPopular" className="text-zinc-300 cursor-pointer">
                    Highlight as "Most Popular Choice" badge
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-950 cursor-pointer"
                >
                  {editingPackage ? 'Save Changes' : 'Publish Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
