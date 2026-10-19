import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Phone, MessageCircle, Calendar, Menu, X, Shield, Sparkles, Tag, Film, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Packages & Pricing', path: '/packages' },
    { name: 'Special Offers', path: '/offers', badge: 'Hot' },
    { name: 'Photo Gallery', path: '/gallery' },
    { name: 'Videos & Reels', path: '/videos' },
    { name: 'About Studio', path: '/about' },
    { name: 'Track Booking', path: '/booking-status' },
    { name: 'Contact', path: '/contact' }
  ];

  const phone1 = settings?.phone1 || '9396931802';
  const phone2 = settings?.phone2 || '7337440060';
  const whatsappNum = settings?.whatsapp || '9396931802';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Notification Announcement Bar */}
      {settings?.announcementBanner && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-black text-red-100 text-xs py-1.5 px-4 border-b border-red-800/40 text-center flex items-center justify-center gap-2 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate max-w-3xl">{settings.announcementBanner}</span>
          <Link to="/offers" className="underline text-amber-300 hover:text-white shrink-0 ml-1 font-semibold text-[11px]">
            Claim Offer &rarr;
          </Link>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-900 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <Camera className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-black"></div>
            </div>
            <div>
              <div className="font-heading font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                <span>CHINNI</span>
                <span className="text-red-500 font-extrabold">DIGITALS</span>
              </div>
              <div className="text-[10px] tracking-widest uppercase font-mono text-zinc-400 -mt-1 hidden sm:block">
                Photo & Cine Studio
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.slice(0, 7).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10 border border-red-500/50 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-bold uppercase tracking-wider animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs (Call, Book Now, Admin) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Call Dropdown / Direct Link */}
            <a
              href={`tel:${phone1}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-300 bg-zinc-900 border border-white/10 hover:text-white hover:border-red-500/50 transition-colors"
              title="Call Studio"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{phone1}</span>
            </a>

            {/* Direct WhatsApp */}
            <a
              href={`https://wa.me/91${whatsappNum}?text=Hello%20Chinni%20Digitals,%20I%20would%20like%20to%20enquire%20about%20photography%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-600/30 hover:bg-emerald-900/50 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>

            {/* Book Now Button */}
            <Link
              to="/book"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold text-sm shadow-md shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Event</span>
            </Link>

            {/* Owner Admin link */}
            <Link
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              className={`p-2 rounded-xl border transition-all ${
                isAuthenticated
                  ? 'bg-red-950/60 border-red-600 text-red-400'
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-red-500/50'
              }`}
              title={isAuthenticated ? "Owner Dashboard" : "Owner Login"}
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/book"
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950/95 border-b border-white/10 px-4 pt-4 pb-6 space-y-3 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-red-600/20 text-white border-l-4 border-red-500'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge ? (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded-full font-bold">
                        {link.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Contact Quick Actions */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">
                Quick Studio Contact:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${phone1}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-bold text-white hover:border-red-500"
                >
                  <Phone className="w-3.5 h-3.5 text-red-500" /> {phone1}
                </a>
                <a
                  href={`tel:${phone2}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs font-bold text-white hover:border-red-500"
                >
                  <Phone className="w-3.5 h-3.5 text-red-500" /> {phone2}
                </a>
              </div>

              <a
                href={`https://wa.me/91${whatsappNum}?text=Hello%20Chinni%20Digitals,%20I%20would%20like%20to%20enquire%20about%20your%20photography%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>

              <Link
                to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400 hover:text-white"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" /> {isAuthenticated ? 'Open Owner Dashboard' : 'Owner Admin Login'}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
