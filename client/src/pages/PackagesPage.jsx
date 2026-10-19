import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Tag, Calendar, Sparkles, ArrowRight, ShieldCheck, Edit3 } from 'lucide-react';
import { apiFetch, formatRupee } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const PackagesPage = () => {
  const { isAuthenticated } = useAuth();
  const [packages, setPackages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Weddings', 'Traditional Events', 'Birthdays', 'Engagements', 'Baby & Family'];

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch('/packages');
        if (data.success) {
          setPackages(data.packages || []);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = selectedCategory === 'All'
    ? packages
    : packages.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" /> Transparent & Published Pricing
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Event Photography Packages & Pricing
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Choose from our all-inclusive packages or craft a bespoke package for your special occasion.
          </p>
        </div>

        {/* Studio Owner Quick Access Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:px-6 rounded-2xl bg-zinc-950/80 border border-amber-500/30 text-xs text-zinc-300 backdrop-blur-md shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <div>
              <span className="font-semibold text-white">Studio Owner Quick Access: </span>
              <span className="text-zinc-400">Directly edit prices, descriptions, and inclusions for any package.</span>
            </div>
          </div>
          <Link
            to={isAuthenticated ? "/admin/packages" : `/admin/login?redirect=${encodeURIComponent('/admin/packages')}`}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage All in Admin Portal &rarr;</span>
          </Link>
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

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.isPopular
                  ? 'bg-gradient-to-b from-red-950/60 via-zinc-950 to-black border-2 border-red-500 shadow-2xl shadow-red-950/50 scale-[1.02]'
                  : 'bg-zinc-950 border border-white/10 hover:border-white/25 shadow-xl'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-mono text-xs font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular Package
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="uppercase text-red-400 font-bold">{pkg.category}</span>
                  <div className="flex items-center gap-2">
                    <span>{pkg.duration}</span>
                    <Link
                      to={isAuthenticated ? `/admin/packages?edit=${pkg.id}` : `/admin/login?redirect=${encodeURIComponent(`/admin/packages?edit=${pkg.id}`)}`}
                      title="Edit this package in Admin Portal"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-black text-white mb-2">{pkg.name}</h3>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{pkg.description}</p>

                {/* Price Display */}
                <div className="py-4 px-5 rounded-2xl bg-black/60 border border-white/5 mb-6">
                  <div className="text-xs text-zinc-400 font-medium">Package Investment</div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-heading font-black text-3xl sm:text-4xl text-white">
                      {formatRupee(pkg.price)}
                    </span>
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <span className="text-sm text-zinc-500 line-through">
                        {formatRupee(pkg.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Inclusions Checklist */}
                <div className="space-y-3 mb-8 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>{pkg.photographersCount}</strong> Candid & Traditional Photographer(s)</span>
                  </div>
                  {pkg.videographersCount > 0 && (
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{pkg.videographersCount}</strong> 4K Cinematographer(s)</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pkg.albumDetails}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pkg.editedPhotosCount}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pkg.cinematicVideoDetails}</span>
                  </div>

                  {pkg.additionalFeatures && pkg.additionalFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to={`/book?packageId=${pkg.id}&packageName=${encodeURIComponent(pkg.name)}`}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/40'
                      : 'bg-zinc-900 border border-white/20 hover:border-red-500 text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Package</span>
                </Link>

                <Link
                  to={isAuthenticated ? `/admin/packages?edit=${pkg.id}` : `/admin/login?redirect=${encodeURIComponent(`/admin/packages?edit=${pkg.id}`)}`}
                  className="w-full py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Package (Admin)</span>
                </Link>

                <Link
                  to="/quotation"
                  className="block text-center text-[11px] text-zinc-400 hover:text-white transition-colors underline"
                >
                  Request Custom Quote for This Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Quotation Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-white">Need a Custom Multi-Day Wedding or Event Quote?</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              We specialize in custom destination packages, multiple muhurthams, outdoor drone coverage, and customized album upgrades.
            </p>
          </div>
          <Link
            to="/quotation"
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shrink-0 shadow-lg shadow-amber-950 transition-all flex items-center gap-2"
          >
            <span>Request Personalized Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
