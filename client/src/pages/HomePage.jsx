import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, Video, Sparkles, Award, ArrowRight, Play, CheckCircle2, 
  Tag, Calendar, Phone, MessageCircle, Star, ShieldCheck, Heart, 
  Aperture, Zap, ChevronRight, Eye, Film, Edit3
} from 'lucide-react';
import { CameraViewfinder } from '../components/CameraViewfinder';
import { FilmStripMarquee } from '../components/FilmStripMarquee';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { ImageLightbox } from '../components/ImageLightbox';
import { apiFetch, formatRupee } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const [currentLens, setCurrentLens] = useState('50mm');
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const phone1 = settings?.phone1 || '9396931802';
  const phone2 = settings?.phone2 || '7337440060';
  const whatsappNum = settings?.whatsapp || '9396931802';

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        const [srvRes, pkgRes, offRes, vidRes, galRes, tstRes] = await Promise.all([
          apiFetch('/services'),
          apiFetch('/packages'),
          apiFetch('/offers'),
          apiFetch('/videos?featured=true'),
          apiFetch('/gallery?featured=true'),
          apiFetch('/testimonials')
        ]);

        if (srvRes.success) setServices(srvRes.services || []);
        if (pkgRes.success) setPackages(pkgRes.packages || []);
        if (offRes.success) setOffers(offRes.offers || []);
        if (vidRes.success) setVideos(vidRes.videos || []);
        if (galRes.success) setGallery(galRes.gallery || []);
        if (tstRes.success) setTestimonials(tstRes.testimonials || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Lens background styling effect based on selected virtual lens
  const getLensBackgroundEffect = () => {
    switch (currentLens) {
      case '24mm':
        return 'scale-100 brightness-110 contrast-105';
      case '50mm':
        return 'scale-105 brightness-100 contrast-110';
      case '85mm':
        return 'scale-115 brightness-95 contrast-125 saturate-110';
      case 'cine':
        return 'scale-110 brightness-90 contrast-130 saturate-120 sepia-[0.15]';
      default:
        return 'scale-100';
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0C] text-slate-100 overflow-x-hidden pt-24 sm:pt-28">
      {/* ========================================================
          HERO SECTION: Animated Camera Theme & Cinematic Lighting
         ======================================================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pb-16 overflow-hidden">
        {/* Dynamic Background Image with Live Camera Lens Zoom Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className={`w-full h-full bg-cover bg-center transition-all duration-1000 ease-out ${getLensBackgroundEffect()}`}
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')`,
            }}
          />
          {/* Cinematic Vignette and Dark Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/80 to-black/75"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.15)_0,rgba(0,0,0,0.85)_75%)]"></div>
          
          {/* Subtle Ambient Red Glow Orbs */}
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-red-600/20 blur-[120px] pointer-events-none animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Studio Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-600/40 text-red-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-red-950/50 backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{settings?.heroBadge || 'Award-Winning Photo & Cine Studio'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          </div>

          {/* Main Hero Title */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white drop-shadow-2xl leading-[1.08]">
            CHINNI <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">DIGITALS</span>
          </h1>

          {/* Tagline & Subtitle */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <p className="font-heading text-lg sm:text-2xl md:text-3xl text-zinc-200 font-semibold tracking-wide drop-shadow">
              "{settings?.tagline || 'Capturing Your Precious Moments Forever'}"
            </p>
            <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              {settings?.subtitle || 'Professional Photography & Cinematic Videography for Every Special Occasion in Andhra Pradesh & Beyond.'}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-base shadow-xl shadow-red-600/40 hover:shadow-red-600/60 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Your Event</span>
            </Link>

            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/20 text-white font-semibold text-base hover:bg-zinc-800 hover:border-red-500/50 transition-all duration-200 shadow-lg"
            >
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Explore Packages</span>
            </Link>

            <Link
              to="/offers"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-200 font-semibold text-base hover:bg-red-900/40 transition-all duration-200 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-red-400" />
              <span>View Latest Offers</span>
            </Link>
          </div>

          {/* Studio Experience Showcase (Google Review, Events Covered, Happy Families removed, Experience set to 10+ Years) */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-black/60 border border-red-500/30 backdrop-blur-md shadow-2xl shadow-red-950/40 hover:border-red-500/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="font-heading font-black text-2xl text-white tracking-tight">10+ Years</div>
                <div className="text-[11px] text-zinc-400 font-medium">Professional Studio Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Camera Viewfinder HUD Simulation */}
        <div className="relative z-10 w-full mt-12">
          <CameraViewfinder
            currentLens={currentLens}
            onLensChange={(lensId) => setCurrentLens(lensId)}
          />
        </div>
      </section>

      {/* ========================================================
          35MM FILM STRIP MARQUEE: Living Cinematic Reel
         ======================================================== */}
      <FilmStripMarquee />

      {/* ========================================================
          ACTIVE OFFERS & DISCOUNTS SPOTLIGHT
         ======================================================== */}
      {offers.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Limited Time Savings
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white">
                Exclusive Studio Offers & Discounts
              </h2>
            </div>
            <Link
              to="/offers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>View All Active Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.slice(0, 3).map((offer) => (
              <div
                key={offer.id}
                className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Banner Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={offer.bannerImage}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-red-600 text-white font-heading font-black text-sm shadow-lg shadow-red-950 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{offer.discountPercentage}% OFF</span>
                  </div>

                  {offer.expiryDate && (
                    <div className="absolute bottom-3 left-3 text-[11px] font-mono font-medium text-amber-300 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      Expires: {offer.expiryDate}
                    </div>
                  )}
                </div>

                {/* Offer Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-red-400 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Pricing row */}
                  <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-zinc-500">Offer Price</div>
                      <div className="font-heading text-2xl font-black text-white">
                        {formatRupee(offer.discountedPrice)}
                      </div>
                    </div>
                    {offer.originalPrice > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Regular</div>
                        <div className="text-sm font-medium text-zinc-500 line-through">
                          {formatRupee(offer.originalPrice)}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/book"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <span>Claim This Offer</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          SERVICES SHOWCASE: 14 Studio Services
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" /> Complete Creative Range
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Our Photography & Videography Services
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            From auspicious Telugu muhurthams to high-energy birthday bashes and baby milestones, our dedicated team captures every sacred and joyful frame.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.slice(0, 8).map((service) => (
            <div
              key={service.id}
              className="group rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-red-500/50 transition-all duration-300 flex flex-col hover:-translate-y-1 shadow-xl"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black/75 text-zinc-300 border border-white/10">
                  {service.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] text-zinc-500">
                    Starting from <span className="font-heading text-sm font-bold text-white">{formatRupee(service.priceStarting)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    <Link
                      to="/book"
                      className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs text-center transition-colors"
                    >
                      Book Now
                    </Link>
                    <Link
                      to="/services"
                      className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs text-center transition-colors border border-white/10"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-900 border border-white/20 text-white font-bold text-sm hover:border-red-500 transition-all shadow-lg"
          >
            <span>View All 14 Studio Services</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          PACKAGES & PRICING: Live Owner-Published Event Packages
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" /> Transparent Pricing
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Event Packages & Pricing
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            All prices and inclusions are live and managed directly by studio owner. No hidden fees or surprise costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.slice(0, 3).map((pkg) => (
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
                  Most Popular Choice
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="uppercase text-red-400 font-bold">{pkg.category}</span>
                  <span>{pkg.duration}</span>
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
                    <span><strong>{pkg.photographersCount}</strong> Candid/Traditional Photographer(s)</span>
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
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to={`/book?packageId=${pkg.id}&packageName=${encodeURIComponent(pkg.name)}`}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/40'
                      : 'bg-zinc-900 border border-white/20 hover:border-red-500 text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Package</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={isAuthenticated ? `/admin/packages?edit=${pkg.id}` : `/admin/login?redirect=${encodeURIComponent(`/admin/packages?edit=${pkg.id}`)}`}
                    className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-amber-500/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Package (Admin)</span>
                  </Link>
                </div>

                <Link
                  to="/quotation"
                  className="block text-center text-[11px] text-zinc-400 hover:text-white transition-colors underline"
                >
                  Need Custom Adjustments? Request Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-900 border border-white/20 text-white font-bold text-sm hover:border-red-500 transition-all shadow-lg"
          >
            <span>Explore All Event Pricing Packages</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          PROMOTIONAL VIDEOS SHOWCASE
         ======================================================== */}
      {videos.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Film className="w-3.5 h-3.5 text-amber-400" /> 4K Ultra HD Cinema
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white">
                Cinematic Wedding Teasers & Reels
              </h2>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>Watch All Published Videos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((video) => (
              <div
                key={video.id}
                className="group rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-xl flex flex-col"
              >
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

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 pt-2 cursor-pointer"
                  >
                    <span>Play Video</span>
                    <Play className="w-3 h-3 fill-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          PHOTOGRAPHY GALLERY HIGHLIGHTS
         ======================================================== */}
      {gallery.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Camera className="w-3.5 h-3.5 text-red-400" /> Visual Masterpieces
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-white">
                Studio Photography Highlights
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>Explore Full Photo Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.slice(0, 8).map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-zinc-900 border border-white/10 hover:border-red-500/50 cursor-pointer shadow-lg"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <div className="text-xs font-bold text-white truncate">{photo.title}</div>
                  <div className="text-[10px] text-red-400 font-mono uppercase">{photo.category}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          CLIENT TESTIMONIALS & REVIEWS
         ======================================================== */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> Client Love
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-white">
              Words From Happy Families
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl p-6 bg-zinc-950 border border-white/10 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                    "{t.reviewText}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={t.imageUrl}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="font-heading font-bold text-sm text-white">{t.clientName}</div>
                    <div className="text-[11px] text-zinc-500">{t.eventType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          QUICK BOOKING CTA BANNER
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-red-950 via-zinc-900 to-black border border-red-900/50 shadow-2xl text-center space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-300 text-xs font-mono uppercase font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" /> Auspicious Muhurtham Dates Filling Fast
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white max-w-3xl mx-auto">
            Reserve Your Event Slot with CHINNI DIGITALS Today
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Avoid last-minute date clashes. Lock in your wedding, engagement, or birthday photography date with our guaranteed price lock and online slot confirmation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-base shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Online Now</span>
            </Link>

            <a
              href={`https://wa.me/91${whatsappNum}?text=Hello%20Chinni%20Digitals,%20I%20want%20to%20check%20availability%20for%20my%20function.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp: +91 {whatsappNum}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightboxes and Modals */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {activePhoto && (
        <ImageLightbox
          image={activePhoto}
          onClose={() => setActivePhoto(null)}
          onPrev={() => {
            const idx = gallery.findIndex(p => p.id === activePhoto.id);
            if (idx > 0) setActivePhoto(gallery[idx - 1]);
          }}
          onNext={() => {
            const idx = gallery.findIndex(p => p.id === activePhoto.id);
            if (idx < gallery.length - 1) setActivePhoto(gallery[idx + 1]);
          }}
          hasPrev={gallery.findIndex(p => p.id === activePhoto.id) > 0}
          hasNext={gallery.findIndex(p => p.id === activePhoto.id) < gallery.length - 1}
        />
      )}
    </div>
  );
};
