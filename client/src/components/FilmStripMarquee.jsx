import React from 'react';
import { Camera } from 'lucide-react';

export const FilmStripMarquee = () => {
  const frames = [
    {
      title: 'Royal Muhurtham',
      tag: 'Wedding',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Talambralu Joy',
      tag: 'Candid',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Half Saree Elegance',
      tag: 'Traditional',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Romantic Sunset Glow',
      tag: 'Pre-Wedding',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Cake Smash Wonder',
      tag: '1st Birthday',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Diamond Ring Promise',
      tag: 'Engagement',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Motherhood Radiance',
      tag: 'Maternity',
      url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Golden Hour Fashion',
      tag: 'Outdoor',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Duplicate for infinite marquee loop
  const doubleFrames = [...frames, ...frames];

  return (
    <div className="relative w-full py-8 overflow-hidden bg-black/90 border-y border-red-950/60 shadow-inner">
      {/* Film Strip Header indicator */}
      <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-xs font-mono text-zinc-500">
        <span className="flex items-center gap-1.5 text-red-500 font-semibold tracking-wider uppercase">
          <Camera className="w-3.5 h-3.5" /> 35MM CINEMATIC FILM REEL • CHINNI DIGITALS ARCHIVE
        </span>
        <span className="hidden sm:inline-block">KODAK VISION3 500T • KODACHROME 64</span>
      </div>

      {/* Marquee Track */}
      <div className="flex animate-film-scroll hover:[animation-play-state:paused]">
        {doubleFrames.map((frame, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-3 w-56 sm:w-64 bg-zinc-950 border-2 border-zinc-800 rounded-lg overflow-hidden shadow-xl group hover:border-red-600 transition-all duration-300"
          >
            {/* Top Film Sprocket Perforations */}
            <div className="flex justify-between items-center px-2 py-1 bg-black border-b border-zinc-800">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-2 bg-zinc-800 rounded-xs"></div>
              ))}
            </div>

            {/* Photo Image Frame */}
            <div className="relative h-40 sm:h-44 overflow-hidden">
              <img
                src={frame.url}
                alt={frame.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide truncate drop-shadow">
                  {frame.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/80 text-white font-mono uppercase">
                  {frame.tag}
                </span>
              </div>
            </div>

            {/* Bottom Film Sprocket Perforations */}
            <div className="flex justify-between items-center px-2 py-1 bg-black border-t border-zinc-800">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-2 bg-zinc-800 rounded-xs"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
