import React, { useState } from 'react';
import { Sparkles, CheckCircle2, User, Phone, Mail, Calendar, MapPin, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiFetch } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const CustomQuotationPage = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    eventType: '3-Day Wedding Ceremony',
    eventDate: '',
    durationDays: 2,
    expectedGuests: '500-800',
    servicesRequired: ['Wedding Photography', 'Wedding Cinematography', 'Drone Aerial Views'],
    budgetRange: '₹1,00,000 - ₹1,50,000',
    location: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const availableServices = [
    'Wedding Photography',
    'Wedding Cinematography',
    'Pre-Wedding Shoots',
    'Drone Aerial Views',
    'Live LED Wall Streaming',
    'Acrylic Flush Mount Albums',
    'Same-Day Teaser Reel',
    'Maternity / Baby Milestone'
  ];

  const handleServiceToggle = (srv) => {
    setFormData(prev => ({
      ...prev,
      servicesRequired: prev.servicesRequired.includes(srv)
        ? prev.servicesRequired.filter(s => s !== srv)
        : [...prev.servicesRequired, srv]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await apiFetch('/quotations', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.success) {
        setIsSuccess(true);
        confetti({ particleCount: 100, spread: 60 });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit quotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Bespoke Event Planning
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Request a Custom Quotation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Planning a multi-day wedding, destination celebration, or grand reception? Tell us your vision and we will tailor the perfect photography & cinema package.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-emerald-500/40 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-white">Quotation Request Received!</h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
              Thank you, <strong>{formData.customerName}</strong>! Our lead cinematographer and owner will review your requirements and reach out via WhatsApp/Phone within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-red-500" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-red-500" /> WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="10-digit number"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Primary Event Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Number of Event Days</label>
                <select
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value={1}>1 Day (Muhurtham & Reception)</option>
                  <option value={2}>2 Days (Sangeet + Wedding)</option>
                  <option value={3}>3 Days Grand Wedding</option>
                  <option value={4}>4+ Days Destination Festival</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Event City & Venue
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Visakhapatnam, Vijayawada, Hyderabad or Destination"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400">Select Required Services</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableServices.map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => handleServiceToggle(srv)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                        formData.servicesRequired.includes(srv)
                          ? 'bg-red-600/20 border-red-500 text-white'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span>{srv}</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${
                        formData.servicesRequired.includes(srv) ? 'text-red-500' : 'text-zinc-600'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400">Additional Instructions & Vision</label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about special rituals, guest count, camera style preferences..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-red-950 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Request...' : 'Send Custom Quotation Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
