import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, Phone, MessageCircle, 
  MapPin, User, Mail, Sparkles, Tag, ArrowRight, ArrowLeft, Copy, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiFetch, formatRupee } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();

  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    eventType: 'Wedding Photography',
    packageId: searchParams.get('packageId') || '',
    packageName: searchParams.get('packageName') || '',
    quotedPrice: 0,
    eventDate: '',
    timeSlot: '',
    customerName: '',
    phone: '',
    email: '',
    eventLocation: '',
    eventAddress: '',
    notes: ''
  });

  const eventTypes = [
    'Wedding Photography',
    'Wedding Cinematography',
    'Pre-Wedding Shoots',
    'Engagement Photography',
    'Birthday Photography',
    'Baby Photography',
    'Half Saree and Traditional Functions',
    'Anniversary Photography',
    'Maternity and Family Photoshoots',
    'Birthday and Event Videography',
    'Outdoor Photoshoots',
    'Photo Albums and Printing',
    'Other Custom Events'
  ];

  const defaultSlots = [
    'Morning (8:00 AM - 1:00 PM)',
    'Evening (4:00 PM - 9:00 PM)',
    'Full Day (8:00 AM - 10:00 PM)',
    'Custom Hours'
  ];

  // Fetch packages and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, srvRes] = await Promise.all([
          apiFetch('/packages'),
          apiFetch('/services')
        ]);
        if (pkgRes.success) setPackages(pkgRes.packages || []);
        if (srvRes.success) setServices(srvRes.services || []);

        // If packageId in URL query, set package details
        const urlPkgId = searchParams.get('packageId');
        if (urlPkgId && pkgRes.packages) {
          const matchedPkg = pkgRes.packages.find(p => p.id === urlPkgId);
          if (matchedPkg) {
            setFormData(prev => ({
              ...prev,
              packageId: matchedPkg.id,
              packageName: matchedPkg.name,
              quotedPrice: matchedPkg.price,
              eventType: matchedPkg.category || prev.eventType
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
      }
    };

    fetchData();
  }, [searchParams]);

  // When date changes, check slot availability in real time
  const handleDateChange = async (selectedDate) => {
    setFormData(prev => ({ ...prev, eventDate: selectedDate, timeSlot: '' }));
    setErrorMessage('');
    if (!selectedDate) return;

    try {
      setIsCheckingSlots(true);
      const res = await apiFetch(`/bookings/check-slot?date=${selectedDate}`);
      if (res.success && res.slots) {
        setSlotAvailability(res.slots);
      } else {
        setSlotAvailability(defaultSlots.map(s => ({ slot: s, isAvailable: true, status: 'Available' })));
      }
    } catch (err) {
      console.warn('Could not check slot:', err);
      setSlotAvailability(defaultSlots.map(s => ({ slot: s, isAvailable: true, status: 'Available' })));
    } finally {
      setIsCheckingSlots(false);
    }
  };

  // Submit Booking Request
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.success && res.booking) {
        setBookingResult(res.booking);
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        setStep(5); // Confirmation Screen
      }
    } catch (err) {
      setErrorMessage(err.message || 'Booking submission failed. Please try again or chat with us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (bookingResult?.referenceNo) {
      navigator.clipboard.writeText(bookingResult.referenceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappNum = settings?.whatsapp || '9396931802';

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Online Reservation
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Book Your Photography Session
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Reserve your auspicious date with CHINNI DIGITALS. Live slot checking prevents conflicting double reservations.
          </p>
        </div>

        {/* Step Progress Bar (Hidden on success screen) */}
        {step < 5 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-zinc-800 -z-0"></div>
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-red-600 -z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>

              {[
                { s: 1, label: 'Event & Package' },
                { s: 2, label: 'Date & Slot' },
                { s: 3, label: 'Your Details' },
                { s: 4, label: 'Summary' }
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      step >= item.s
                        ? 'bg-red-600 text-white shadow-lg shadow-red-950 scale-105'
                        : 'bg-zinc-900 border border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {item.s}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-2 font-medium hidden sm:block ${
                    step >= item.s ? 'text-zinc-200' : 'text-zinc-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-600/50 flex items-start gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">Reservation Notice:</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Step 1: Select Event Type & Package */}
        {step === 1 && (
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Step 1: Select Event Type & Photography Package
              </h2>
              <p className="text-xs text-zinc-400">
                Choose the occasion and select from our curated packages, or select Custom Package.
              </p>
            </div>

            {/* Event Type Grid */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400">1. Select Event Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, eventType: type }))}
                    className={`p-3 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                      formData.eventType === type
                        ? 'bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Package Selection */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-xs font-mono uppercase text-zinc-400">2. Select Photography Package</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages
                  .filter(p => !formData.eventType || p.category.toLowerCase().includes(formData.eventType.toLowerCase().slice(0, 4)) || true)
                  .map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          packageId: pkg.id,
                          packageName: pkg.name,
                          quotedPrice: pkg.price
                        }));
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        formData.packageId === pkg.id
                          ? 'bg-red-950/40 border-red-500 text-white shadow-lg shadow-red-950'
                          : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                          <span className="text-red-400 font-bold">{pkg.category}</span>
                          <span>{pkg.duration}</span>
                        </div>
                        <h4 className="font-heading font-bold text-white text-base">{pkg.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{pkg.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="font-heading font-black text-lg text-white">
                          {formatRupee(pkg.price)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          formData.packageId === pkg.id ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {formData.packageId === pkg.id ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  ))}

                {/* Custom Package Option */}
                <div
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      packageId: 'custom',
                      packageName: 'Custom Tailored Package',
                      quotedPrice: 0
                    }));
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.packageId === 'custom'
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-lg'
                      : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">FLEXIBLE</div>
                    <h4 className="font-heading font-bold text-white text-base">Custom Quotation / Personalized Plan</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Need custom hours, multi-day coverage, or specific equipment combinations? We will formulate a personalized quote.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-semibold">Price on discussion</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      formData.packageId === 'custom' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {formData.packageId === 'custom' ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
              >
                <span>Continue to Date & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Event Date & View Available Time Slots */}
        {step === 2 && (
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Step 2: Choose Event Date & Available Slot
              </h2>
              <p className="text-xs text-zinc-400">
                Pick your function date. Our live availability check verifies if slots are open.
              </p>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" /> Event Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.eventDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Time Slot Availability Checker */}
            {formData.eventDate && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> Available Time Slots for {formData.eventDate}
                  </label>
                  {isCheckingSlots && (
                    <span className="text-xs text-amber-400 font-mono animate-pulse">Checking availability...</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(slotAvailability.length > 0 ? slotAvailability : defaultSlots.map(s => ({ slot: s, isAvailable: true, status: 'Available' }))).map((slotItem) => (
                    <button
                      key={slotItem.slot}
                      type="button"
                      disabled={!slotItem.isAvailable}
                      onClick={() => setFormData(prev => ({ ...prev, timeSlot: slotItem.slot }))}
                      className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                        !slotItem.isAvailable
                          ? 'bg-zinc-900/30 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-60'
                          : formData.timeSlot === slotItem.slot
                          ? 'bg-red-600/20 border-red-500 text-white shadow-md shadow-red-950'
                          : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{slotItem.slot}</div>
                        <div className={`text-[10px] mt-0.5 font-mono ${
                          slotItem.isAvailable ? 'text-emerald-400' : 'text-red-500'
                        }`}>
                          {slotItem.isAvailable ? '● Available' : '✕ Reserved / Conflicting'}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.timeSlot === slotItem.slot
                          ? 'border-red-500 bg-red-600 text-white'
                          : 'border-zinc-600'
                      }`}>
                        {formData.timeSlot === slotItem.slot && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={!formData.eventDate || !formData.timeSlot}
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
              >
                <span>Continue to Your Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 3 && (
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Step 3: Contact & Venue Details
              </h2>
              <p className="text-xs text-zinc-400">
                Please provide accurate contact info so our studio director can confirm your event.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-red-500" /> Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Varma"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-red-500" /> Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Event Venue / Function Hall Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Novotel Convention Hall, Vizag or Home"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400">Full Address & Landmark</label>
                <textarea
                  rows="2"
                  placeholder="Street address, city, district"
                  value={formData.eventAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventAddress: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-zinc-400">Additional Requests / Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g., Drone entry requirement, specific muhurtham timing, special rituals"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={!formData.customerName || !formData.phone || !formData.eventLocation}
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
              >
                <span>Review Booking Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Confirmation */}
        {step === 4 && (
          <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-white/10 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Step 4: Review Booking Summary & Price Guarantee
              </h2>
              <p className="text-xs text-zinc-400">
                Please double-check all details before final submission.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-black/60 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-zinc-500 uppercase font-mono">Event Type</div>
                  <div className="text-white font-bold mt-0.5">{formData.eventType}</div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase font-mono">Selected Package</div>
                  <div className="text-white font-bold mt-0.5">{formData.packageName || 'Custom Plan'}</div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase font-mono">Event Date</div>
                  <div className="text-amber-400 font-bold mt-0.5">{formData.eventDate}</div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase font-mono">Time Slot</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{formData.timeSlot}</div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase font-mono">Customer Name</div>
                  <div className="text-white font-semibold mt-0.5">{formData.customerName}</div>
                </div>
                <div>
                  <div className="text-zinc-500 uppercase font-mono">Mobile / WhatsApp</div>
                  <div className="text-white font-mono font-semibold mt-0.5">{formData.phone}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-zinc-500 uppercase font-mono">Venue & Address</div>
                  <div className="text-zinc-300 mt-0.5">{formData.eventLocation} {formData.eventAddress && `— ${formData.eventAddress}`}</div>
                </div>
              </div>

              {/* Price Lock Box */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Locked Quoted Price</div>
                  <div className="text-[11px] text-zinc-500">Includes all chosen equipment & team</div>
                </div>
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">
                  {formData.quotedPrice > 0 ? formatRupee(formData.quotedPrice) : 'Quotation Pending'}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl shadow-red-950 transition-all"
              >
                {isSubmitting ? (
                  <span>Submitting Booking...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Submit Booking Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success & Booking Reference Screen */}
        {step === 5 && bookingResult && (
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-emerald-500/40 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
                Booking Request Submitted!
              </h2>
              <p className="text-zinc-300 text-sm max-w-lg mx-auto">
                Thank you, <strong>{bookingResult.customerName}</strong>! Your event booking request has been securely registered in CHINNI DIGITALS database.
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between">
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-400">Your Booking Reference Number</div>
                <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
                  {bookingResult.referenceNo}
                </div>
              </div>

              <button
                onClick={handleCopyRef}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                title="Copy Reference"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Summary Details */}
            <div className="max-w-md mx-auto text-left text-xs text-zinc-400 space-y-2 p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex justify-between">
                <span>Event:</span>
                <span className="text-white font-medium">{bookingResult.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Slot:</span>
                <span className="text-white font-medium">{bookingResult.eventDate} ({bookingResult.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span>Quoted Investment:</span>
                <span className="text-white font-bold">{formatRupee(bookingResult.quotedPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Status:</span>
                <span className="text-amber-400 font-mono font-bold uppercase">{bookingResult.status}</span>
              </div>
            </div>

            {/* WhatsApp Direct Confirmation Button */}
            <div className="pt-4 space-y-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
                  `Hello Chinni Digitals! I just booked my event online.\n\n` +
                  `Booking Ref: ${bookingResult.referenceNo}\n` +
                  `Name: ${bookingResult.customerName}\n` +
                  `Event: ${bookingResult.eventType}\n` +
                  `Date: ${bookingResult.eventDate}\n` +
                  `Slot: ${bookingResult.timeSlot}\n` +
                  `Venue: ${bookingResult.eventLocation}\n\n` +
                  `Please confirm my booking slot.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Booking Details to WhatsApp</span>
              </a>

              <div className="flex items-center justify-center gap-4 text-xs pt-2">
                <Link to="/booking-status" className="text-red-400 hover:underline">
                  Track Booking Status
                </Link>
                <span>•</span>
                <Link to="/" className="text-zinc-400 hover:underline">
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
