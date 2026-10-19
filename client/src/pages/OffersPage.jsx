import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Calendar, Play, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { apiFetch, formatRupee } from '../utils/api';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

export const OffersPage = () => {
  const [activeOffers, setActiveOffers] = useState([]);
  const [expiredOffers, setExpiredOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        // Request all offers so we can separate active from archived
        const data = await apiFetch('/offers?all=true');
        if (data.success && data.offers) {
          const active = data.offers.filter(o => o.status === 'active' && o.isPublished);
          const archived = data.offers.filter(o => o.status === 'expired' || !o.isPublished);
          setActiveOffers(active);
          setExpiredOffers(archived);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const displayedOffers = activeTab === 'active' ? activeOffers : expiredOffers;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Save Big On Your Special Moments
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Special Offers & Seasonal Discounts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enjoy exclusive festival discounts, early-bird wedding packages, and birthday promotions. Expired offers are automatically archived.
          </p>
        </div>

        {/* Tab Toggle: Active Deals vs Past Archives */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Active Offers ({activeOffers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'archived'
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'bg-zinc-900/60 border border-white/5 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Clock className="w-4 h-4 text-zinc-400" />
            <span>Archived / Expired Offers ({expiredOffers.length})</span>
          </button>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedOffers.map((offer) => (
            <div
              key={offer.id}
              className={`rounded-3xl overflow-hidden bg-zinc-950 border transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                activeTab === 'active'
                  ? 'border-white/10 hover:border-red-500/50'
                  : 'border-zinc-800 opacity-75'
              }`}
            >
              <div>
                {/* Banner & Promo Video */}
                <div className="relative h-64 overflow-hidden group">
                  <img
                    src={offer.bannerImage}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>

                  {/* Discount percentage tag */}
                  <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-heading font-black text-sm shadow-xl flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>{offer.discountPercentage}% OFF</span>
                  </div>

                  {/* Attached Promo Video trigger */}
                  {offer.videoUrl && (
                    <button
                      onClick={() => setSelectedVideo({ title: offer.title, videoUrl: offer.videoUrl, category: 'Offer Promo' })}
                      className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch Promo Video</span>
                    </button>
                  )}

                  {/* Expiry Badge */}
                  <div className="absolute bottom-4 left-4 text-xs font-mono font-medium text-amber-300 bg-black/80 px-3 py-1 rounded-lg backdrop-blur-md">
                    {offer.status === 'expired' ? (
                      <span className="text-red-400">Offer Expired</span>
                    ) : (
                      <span>Valid until: {offer.expiryDate || 'Limited Period'}</span>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {offer.applicableCategories?.map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-white/10 text-zinc-300">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-heading font-black text-2xl text-white">
                      {offer.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Investment & CTA */}
              <div className="p-6 sm:p-8 pt-0">
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-zinc-400">Offer Price</div>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <span className="font-heading font-black text-3xl text-white">
                        {formatRupee(offer.discountedPrice)}
                      </span>
                      {offer.originalPrice > 0 && (
                        <span className="text-sm text-zinc-500 line-through">
                          {formatRupee(offer.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeTab === 'active' ? (
                    <Link
                      to="/book"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Grab This Offer</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-xs font-mono text-zinc-500 uppercase">
                      Archived Offer
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedOffers.length === 0 && (
          <div className="text-center py-16 text-zinc-500 text-sm">
            No offers currently in this category.
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};
