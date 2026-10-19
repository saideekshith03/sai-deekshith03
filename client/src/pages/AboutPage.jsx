import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Award, ShieldCheck, Heart, Sparkles, CheckCircle2, Film, Layers, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage = () => {
  const { settings } = useSettings();

  const gears = [
    { name: 'Sony Alpha FX3 Cinema Camera', desc: '4K 120fps Full-Frame 10-bit 4:2:2 cinematic recording with 15+ stops dynamic range.' },
    { name: 'Sony Alpha 7 IV Full-Frame', desc: '33MP ultra high resolution sensors delivering razor-sharp candid photographs and true-to-life colors.' },
    { name: 'Sony FE 85mm f/1.4 G-Master', desc: 'Legendary creamy bokeh portrait lens capturing emotional bridal close-ups and ring moments.' },
    { name: 'Sony FE 24-70mm f/2.8 GM II', desc: 'Industry benchmark standard zoom for fast-paced Telugu muhurtham rituals and stage groups.' },
    { name: 'DJI Air 3 & Mavic 3 Pro Drones', desc: 'Dual-camera 4K aerial cinematography capturing grand venue architectures and baraat entries.' },
    { name: 'DJI RS3 Pro Gimbal Stabilizer', desc: 'Buttery-smooth Hollywood style camera tracking shots for cinematic couple teasers.' }
  ];

  const workflow = [
    { step: '01', title: 'Creative Consultation', desc: 'We understand your rituals, family preferences, event timelines, and camera style expectations.' },
    { step: '02', title: 'Date & Slot Reservation', desc: 'Securing your auspicious date in our live system to guarantee dedicated lead team assignment.' },
    { step: '03', title: 'Event Day Multi-Cam Shoot', desc: 'Synchronized candid, traditional, and drone coverage with high-end wireless audio microphones.' },
    { step: '04', title: 'Master Color Grading & Editing', desc: 'Frame-by-frame skin retouching, cinematic Hollywood color grading, and emotional music design.' },
    { step: '05', title: 'Luxury Album & 4K Delivery', desc: 'High-res digital cloud gallery, Pendrive master archive, and hand-bound luxury acrylic photobooks.' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero About */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" /> 10+ Years of Visual Excellence
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight">
              About <span className="text-red-500">CHINNI DIGITALS</span>
            </h1>
            <p className="text-base text-zinc-300 leading-relaxed">
              At <strong>CHINNI DIGITALS</strong>, photography is not just clicking buttons; it is the sacred art of preserving timeless family emotions, heartfelt laughter, tearful blessings, and joyous celebrations forever.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              With over 10+ years of dedicated professional studio experience in Andhra Pradesh, CHINNI DIGITALS specializes in documenting grand Telugu weddings, half-saree ceremonies, milestone birthdays, and family functions with an unwavering commitment to cinematic quality.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/book"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-950 transition-all flex items-center gap-2"
              >
                <span>Book Our Crew</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/gallery"
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-200 text-sm font-semibold transition-all"
              >
                View Our Portfolio
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
              alt="Chinni Digitals Camera Gear"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-xs text-zinc-300 font-mono">
                SONY ALPHA FX3 CINEMA • G-MASTER LENSES • DJI RONIN • 4K HDR
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Arsenal */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Industry-Leading Hardware
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">Our Camera & Cinema Arsenal</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              We invest in state-of-the-art cinema equipment to guarantee crystal clarity in any lighting condition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gears.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-red-500/40 transition-all shadow-xl space-y-2">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">{item.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow steps */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" /> Precision Workflow
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">Our 5-Step Photography Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflow.map((w) => (
              <div key={w.step} className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 relative">
                <div className="font-mono text-3xl font-black text-red-500/40">{w.step}</div>
                <h4 className="font-heading font-bold text-sm text-white">{w.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
