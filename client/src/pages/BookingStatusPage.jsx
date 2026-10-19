import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle, Phone, MessageCircle, Shield } from 'lucide-react';
import { apiFetch, formatRupee, formatDate } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const BookingStatusPage = () => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [bookingList, setBookingList] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMessage('');
    setBookingList(null);

    try {
      const data = await apiFetch(`/bookings/track/${encodeURIComponent(searchQuery.trim())}`);
      if (data.success && data.bookings) {
        setBookingList(data.bookings);
      }
    } catch (err) {
      setErrorMessage(err.message || 'No booking found matching this reference number or mobile. Please check and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const whatsappNum = settings?.whatsapp || '9396931802';
  const phone1 = settings?.phone1 || '9396931802';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Secure Customer Verification
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Track Your Event Booking Status
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enter your Booking Reference Number (e.g. <span className="font-mono text-amber-400">CD-2026-8941</span>) or 10-digit mobile number.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Booking Reference (CD-XXXX) or Phone Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-500 shadow-xl"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-950 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSearching ? 'Searching...' : 'Lookup Status'}
            </button>
          </div>
        </form>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Results List */}
        {bookingList && bookingList.length > 0 && (
          <div className="space-y-6">
            {bookingList.map((bk) => (
              <div
                key={bk.referenceNo}
                className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-200"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-zinc-400">Reference Number</div>
                    <div className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                      {bk.referenceNo}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${getStatusBadge(bk.status)}`}>
                      Status: {bk.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900 border border-white/10 text-zinc-300">
                      Pay: {bk.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-zinc-500 uppercase font-mono">Customer Name</div>
                    <div className="text-white font-bold mt-0.5">{bk.customerName}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 uppercase font-mono">Event Type</div>
                    <div className="text-white font-bold mt-0.5">{bk.eventType}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 uppercase font-mono">Package</div>
                    <div className="text-zinc-300 mt-0.5">{bk.packageName}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 uppercase font-mono">Locked Investment</div>
                    <div className="text-white font-bold text-base mt-0.5">{formatRupee(bk.quotedPrice)}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 uppercase font-mono">Scheduled Date</div>
                    <div className="text-amber-400 font-bold mt-0.5">{bk.eventDate}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 uppercase font-mono">Time Slot</div>
                    <div className="text-emerald-400 font-bold mt-0.5">{bk.timeSlot}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-zinc-500 uppercase font-mono">Venue / Location</div>
                    <div className="text-zinc-300 mt-0.5">{bk.eventLocation}</div>
                  </div>
                </div>

                {/* Progress Steps Visualizer */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-xs font-mono uppercase text-zinc-400">Booking Lifecycle Progress</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                      <div className="font-bold">1. Received</div>
                      <div className="text-[10px] text-zinc-400">Request logged</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      ['Confirmed', 'Completed'].includes(bk.status)
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}>
                      <div className="font-bold">2. Confirmed</div>
                      <div className="text-[10px] text-zinc-400">Slot locked</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      ['Confirmed', 'Completed'].includes(bk.status)
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}>
                      <div className="font-bold">3. Team Assigned</div>
                      <div className="text-[10px] text-zinc-400">Cameras ready</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      bk.status === 'Completed'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}>
                      <div className="font-bold">4. Delivered</div>
                      <div className="text-[10px] text-zinc-400">Albums & 4K</div>
                    </div>
                  </div>
                </div>

                {/* Need Help Action */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-zinc-400">Questions about your slot?</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/91${whatsappNum}?text=Hello%20Chinni%20Digitals,%20checking%20status%20for%20Booking%20Ref:%20${bk.referenceNo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                    <a
                      href={`tel:${phone1}`}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-semibold flex items-center gap-1.5 hover:border-red-500 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span>Call Studio</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
