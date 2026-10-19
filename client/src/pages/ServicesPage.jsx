import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2, ArrowRight, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { apiFetch, formatRupee } from '../utils/api';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Weddings', 'Engagements', 'Birthdays', 'Traditional Events', 'Baby & Family', 'Cinematic Videos', 'Studio & Portraits'];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch('/services');
        if (data.success) {
          setServices(data.services || []);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" /> Full Spectrum Visual Solutions
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Studio Photography & Videography Services
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            From traditional rituals to high-definition 4K cinematography, explore our complete list of services managed directly by CHINNI DIGITALS.
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-black/80 text-zinc-300 border border-white/10">
                    {service.category}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-red-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {service.fullDesc || service.shortDesc}
                    </p>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {service.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-zinc-500">Starting from</div>
                    <div className="font-heading text-lg font-black text-white">
                      {formatRupee(service.priceStarting)}
                    </div>
                  </div>

                  <Link
                    to={`/book?eventType=${encodeURIComponent(service.title)}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950 transition-all cursor-pointer"
                  >
                    <span>Book Service</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
