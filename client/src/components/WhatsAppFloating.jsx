import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const WhatsAppFloating = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const phone1 = settings?.phone1 || '9396931802';
  const phone2 = settings?.phone2 || '7337440060';
  const whatsapp = settings?.whatsapp || '9396931802';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Quick Contact Popup */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-zinc-950 border border-emerald-500/40 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">CHINNI DIGITALS Helpdesk</div>
                <div className="text-[10px] text-emerald-400 font-mono">Online • Replies in minutes</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 py-3 leading-relaxed">
            Namaste! How can we assist you with photography or videography for your upcoming function?
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/91${whatsapp}?text=Hello%20Chinni%20Digitals,%20I%20would%20like%20to%20enquire%20about%20event%20photography%20packages.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 {whatsapp})</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${phone1}`}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-red-500 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Call {phone1}</span>
              </a>
              <a
                href={`tel:${phone2}`}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-red-500 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Call {phone2}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
        aria-label="Chat with Chinni Digitals on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
