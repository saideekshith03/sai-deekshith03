import React, { useState } from 'react';
import { Camera, Volume2, VolumeX, Eye, Aperture, BatteryMedium, Disc } from 'lucide-react';
import { playCameraShutterSound } from '../utils/sound';

export const CameraViewfinder = ({ currentLens, onLensChange }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hudVisible, setHudVisible] = useState(true);
  const [flashActive, setFlashActive] = useState(false);

  const lenses = [
    { id: '24mm', name: '24mm Wide', fStop: 'f/2.8', iso: '100', desc: 'Grand Venues & Landscapes' },
    { id: '50mm', name: '50mm Prime', fStop: 'f/1.4', iso: '200', desc: 'Natural Eye & Candid Moments' },
    { id: '85mm', name: '85mm Master', fStop: 'f/1.2', iso: '400', desc: 'Creamy Bokeh Bridal Portraits' },
    { id: 'cine', name: 'Cinema 35', fStop: 'T/1.5', iso: '800', desc: '4K Anamorphic Wedding Movie' }
  ];

  const handleShutterClick = () => {
    if (soundEnabled) {
      playCameraShutterSound();
    }
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 300);
  };

  const selectedLens = lenses.find(l => l.id === currentLens) || lenses[1];

  return (
    <>
      {/* Fullscreen Camera Shutter Flash effect */}
      {flashActive && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none camera-flash-active" />
      )}

      {/* Floating Camera Control HUD in Hero */}
      <div className="relative w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Viewfinder corner brackets */}
        <div className="viewfinder-corner viewfinder-tl border-red-500"></div>
        <div className="viewfinder-corner viewfinder-tr border-red-500"></div>
        <div className="viewfinder-corner viewfinder-bl border-red-500"></div>
        <div className="viewfinder-corner viewfinder-br border-red-500"></div>

        {/* Viewfinder Top Bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-zinc-400 border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-red-500 font-semibold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-record inline-block"></span>
              REC ● 4K 60FPS
            </span>
            <span className="hidden sm:inline-block text-zinc-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-zinc-300">
              <Aperture className="w-3.5 h-3.5 text-amber-400" /> SONY FX3 CINE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-mono font-medium">ISO {selectedLens.iso}</span>
            <span className="text-zinc-300 font-mono font-medium">{selectedLens.fStop}</span>
            <span className="text-zinc-300 font-mono font-medium">1/250s</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <BatteryMedium className="w-4 h-4" /> 98%
            </span>
          </div>
        </div>

        {/* Center Grid Viewfinder Area */}
        <div className="relative py-6 sm:py-10 px-4 text-center">
          {/* Rule of thirds crosshairs */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
            <div className="border-r border-b border-white/40"></div>
            <div className="border-r border-b border-white/40"></div>
            <div className="border-b border-white/40"></div>
            <div className="border-r border-b border-white/40"></div>
            <div className="border-r border-b border-white/40"></div>
            <div className="border-b border-white/40"></div>
            <div className="border-r border-white/40"></div>
            <div className="border-r border-white/40"></div>
            <div></div>
          </div>

          {/* Center Focus Reticle */}
          <div className="relative z-10 inline-flex flex-col items-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-dashed border-red-500/80 flex items-center justify-center animate-spin-slow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-amber-400/80 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              </div>
            </div>
            <div className="mt-3 font-mono text-xs text-red-400 tracking-widest uppercase font-semibold">
              [ AUTO FOCUS LOCK • EYE TRACKING ACTIVE ]
            </div>
          </div>

          {/* Interactive Shutter Click Button */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3 relative z-10">
            <button
              onClick={handleShutterClick}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold text-sm shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Click for Camera Shutter Sound & Flash!"
            >
              <Camera className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>SNAP CAMERA SHUTTER</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:border-red-500/50 transition-all cursor-pointer"
              title={soundEnabled ? 'Mute Shutter Sound' : 'Enable Shutter Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>
        </div>

        {/* Bottom Lens Switcher Deck */}
        <div className="border-t border-white/10 pt-4 mt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <Aperture className="w-3.5 h-3.5 text-amber-400" /> SWITCH CINE LENS:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
              {lenses.map((lens) => (
                <button
                  key={lens.id}
                  onClick={() => {
                    if (onLensChange) onLensChange(lens.id);
                    if (soundEnabled) playCameraShutterSound();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer text-left sm:text-center ${
                    currentLens === lens.id
                      ? 'bg-red-600/20 border border-red-500 text-red-300 font-bold shadow-md shadow-red-950'
                      : 'bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-semibold">{lens.name}</div>
                  <div className="text-[10px] opacity-75">{lens.fStop}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
