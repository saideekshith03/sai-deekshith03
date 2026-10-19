import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ContactPage = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const phone1 = settings?.phone1 || '9396931802';
  const phone2 = settings?.phone2 || '7337440060';
  const whatsappNum = settings?.whatsapp || '9396931802';
  const address = settings?.address || 'Main Road, Digital Plaza, Andhra Pradesh, India';
  const workingHours = settings?.workingHours || '9:00 AM – 9:30 PM (All 7 Days Open)';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Open WhatsApp with pre-filled enquiry message
    const text = `Hello Chinni Digitals!\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'N/A'}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/91${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" /> Direct Studio Communication
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Contact CHINNI DIGITALS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Have questions about wedding availability, camera setups, or package pricing? Speak directly to our studio management.
          </p>
        </div>

        {/* Highlighted Contact Numbers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-red-500/50 transition-all shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Primary Studio Line</div>
              <a
                href={`tel:${phone1}`}
                className="font-heading font-black text-2xl text-white hover:text-red-400 transition-colors block mt-1"
              >
                +91 {phone1}
              </a>
            </div>
            <a
              href={`tel:${phone1}`}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 font-semibold hover:underline"
            >
              Click to Call Direct &rarr;
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 hover:border-red-500/50 transition-all shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Secondary / Studio Manager</div>
              <a
                href={`tel:${phone2}`}
                className="font-heading font-black text-2xl text-white hover:text-red-400 transition-colors block mt-1"
              >
                +91 {phone2}
              </a>
            </div>
            <a
              href={`tel:${phone2}`}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 font-semibold hover:underline"
            >
              Click to Call Direct &rarr;
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Official WhatsApp Chat</div>
              <a
                href={`https://wa.me/91${whatsappNum}`}
                target="_blank"
                rel="noreferrer"
                className="font-heading font-black text-2xl text-emerald-400 hover:underline block mt-1"
              >
                +91 {whatsappNum}
              </a>
            </div>
            <a
              href={`https://wa.me/91${whatsappNum}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline"
            >
              Start Instant WhatsApp Chat &rarr;
            </a>
          </div>
        </div>

        {/* Contact Form & Studio Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">Send Us a Direct Message</h2>
              <p className="text-xs text-zinc-400">We reply promptly on WhatsApp and telephone.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-sm">Message Sent to Studio!</div>
                <div className="text-xs text-zinc-300">We opened WhatsApp with your details.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                    placeholder="e.g. Anand Kumar"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                    placeholder="10-digit number"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                    placeholder="yourname@gmail.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-zinc-400">Your Message / Event Date</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                    placeholder="Tell us about the event date, type of photography required..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry via WhatsApp</span>
                </button>
              </form>
            )}
          </div>

          {/* Details & Map */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-xl text-white">Visit Our Digital Studio</h3>

              <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Studio Address:</div>
                    <div className="text-zinc-400 leading-relaxed">{address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Business Hours:</div>
                    <div className="text-zinc-400">{workingHours}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Email Address:</div>
                    <div className="text-zinc-400">{settings?.email || 'chinnidigitals@gmail.com'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual */}
            <div className="rounded-3xl overflow-hidden h-64 border border-white/10 bg-zinc-900 shadow-xl">
              <iframe
                title="Studio Location"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy"
                src="https://maps.google.com/maps?q=Visakhapatnam,Andhra+Pradesh,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
