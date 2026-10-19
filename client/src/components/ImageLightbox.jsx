import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../utils/api';

export const ImageLightbox = ({ image, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-zinc-900/80 text-white hover:bg-red-600 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 text-white hover:bg-red-600 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 text-white hover:bg-red-600 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content wrapper */}
      <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
        <div className="relative max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl border border-white/10">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full max-h-[75vh] object-contain select-none"
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full px-4 text-center sm:text-left">
          <div>
            <h3 className="font-heading text-lg font-bold text-white tracking-wide">{image.title}</h3>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 justify-center sm:justify-start">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-red-500" /> {image.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> {formatDate(image.shootDate || image.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
