import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Tag, Eye } from 'lucide-react';
import { apiFetch, formatDate } from '../utils/api';
import { ImageLightbox } from '../components/ImageLightbox';

export const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Weddings', 'Traditional Events', 'Engagements', 'Birthdays', 'Studio Photography'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch('/gallery');
        if (data.success) {
          setGallery(data.gallery || []);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" /> High Resolution Visual Archive
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            CHINNI DIGITALS Photography Showcase
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Browse our captured wedding rituals, joyful birthdays, traditional half-saree ceremonies, and studio portraits. Click any photo for full-resolution view.
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

        {/* Masonry-Style Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-zinc-950 border border-white/10 hover:border-red-500/60 shadow-xl cursor-pointer transition-all duration-300"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                    {photo.category}
                  </span>
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-heading font-bold text-white text-base truncate">{photo.title}</h3>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{formatDate(photo.shootDate || photo.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <ImageLightbox
          image={activePhoto}
          onClose={() => setActivePhoto(null)}
          onPrev={() => {
            const idx = filteredGallery.findIndex(p => p.id === activePhoto.id);
            if (idx > 0) setActivePhoto(filteredGallery[idx - 1]);
          }}
          onNext={() => {
            const idx = filteredGallery.findIndex(p => p.id === activePhoto.id);
            if (idx < filteredGallery.length - 1) setActivePhoto(filteredGallery[idx + 1]);
          }}
          hasPrev={filteredGallery.findIndex(p => p.id === activePhoto.id) > 0}
          hasNext={filteredGallery.findIndex(p => p.id === activePhoto.id) < filteredGallery.length - 1}
        />
      )}
    </div>
  );
};
