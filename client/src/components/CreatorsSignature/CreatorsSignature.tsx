'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const videos = ['/signature1.mp4', '/signature2.mp4'];

export function CreatorsSignature() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className="text-gray-300 font-medium cursor-pointer hover:text-indigo-400 hover:underline transition-colors"
      >
        SIAIdziwAIk
      </span>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          <div className="relative bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full aspect-video animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-1 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>

            <video
              src={videos[currentVideoIndex]}
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
