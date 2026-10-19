import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Phone, MessageCircle, Mail, MapPin, Clock, Shield, Award, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer = () => {
  const { settings } = useSettings();

  const phone1 = settings?.phone1 || '9396931802';
  const phone2 = settings?.phone2 || '7337440060';
  const whatsappNum = settings?.whatsapp || '9396931802';
  const address = settings?.address || 'Main Road, Digital Plaza, Andhra Pradesh, India';
  const workingHours = settings?.workingHours || '9:00 AM – 9:30 PM (All 7 Days Open)';

  return (
    <footer className="bg-black border-t border-white/10 text-zinc-400 text-sm relative z-10 pt-16 pb-8">
      {/* Top Footer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-red-950/70 via-zinc-900 to-black border border-red-900/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 font-mono text-xs uppercase tracking-wider font-semibold">
              <Award className="w-3.5 h-3.5" /> Book Your Auspicious Dates Early
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to Capture Your Special Moments?
            </h3>
            <p className="text-zinc-300 text-sm max-w-xl">
              Talk directly with Chinni Digitals experts for weddings, engagements, traditional ceremonies, and birthday celebrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${phone1}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-white/20 text-white font-semibold text-sm hover:border-red-500 transition-colors shadow"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Call: {phone1}</span>
            </a>

            <a
              href={`https://wa.me/91${whatsappNum}?text=Hello%20Chinni%20Digitals,%20I%20would%20like%20to%20enquire%20about%20your%20photography%20packages.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-950"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-600/30"
            >
              <Camera className="w-4 h-4" />
              <span>Book Online</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* Col 1: Studio Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/40">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-heading font-black text-xl text-white tracking-tight">
              CHINNI <span className="text-red-500">DIGITALS</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {settings?.tagline || 'Capturing Your Precious Moments Forever.'}
            <br />
            Premier photography and cinematic videography studio specializing in grand South Indian weddings, half-saree ceremonies, candid portraits, and event coverage.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={settings?.instagram || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:border-rose-500 transition-colors"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={settings?.youtube || 'https://youtube.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500 transition-colors"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href={settings?.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500 transition-colors"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Services */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white text-base tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Our Studio Services
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Wedding Photography & Muhurtham</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">4K Wedding Cinematography</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Pre-Wedding Shoots & Music Videos</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Half Saree & Traditional Functions</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Engagement & Ring Ceremonies</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Birthday Photography & Reels</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Maternity & Baby Milestone Sessions</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-red-400 transition-colors">Luxury Albums & Acrylic Printing</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white text-base tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/packages" className="hover:text-red-400 transition-colors">Packages & Pricing</Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-red-400 transition-colors">Special Offers & Discounts</Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-red-400 transition-colors">Photo Showcase Gallery</Link>
            </li>
            <li>
              <Link to="/videos" className="hover:text-red-400 transition-colors">Cinematic Videos & Reels</Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-red-400 transition-colors">Online Event Booking</Link>
            </li>
            <li>
              <Link to="/quotation" className="hover:text-red-400 transition-colors">Request Custom Quotation</Link>
            </li>
            <li>
              <Link to="/booking-status" className="hover:text-red-400 transition-colors">Check Booking Status</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-400 transition-colors">About Our Studio & Gear</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Studio Contact & Hours */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-white text-base tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Studio Contact Info
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <a href={`tel:${phone1}`} className="block text-white hover:text-red-400 font-mono font-medium">
                  +91 {phone1}
                </a>
                <a href={`tel:${phone2}`} className="block text-white hover:text-red-400 font-mono font-medium">
                  +91 {phone2}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <a
                  href={`https://wa.me/91${whatsappNum}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  WhatsApp: +91 {whatsappNum}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-300 font-medium">{workingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-300">{address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Admin shortcut */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} CHINNI DIGITALS. All Rights Reserved. Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          <span>for memorable moments.</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/booking-status" className="hover:text-zinc-300">
            Customer Status Check
          </Link>
          <span>•</span>
          <Link
            to="/admin/login"
            className="flex items-center gap-1 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Owner Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
