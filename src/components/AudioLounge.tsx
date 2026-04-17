'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioLounge() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[100]">
      <audio
        ref={audioRef}
        loop
        src="https://orangefreesounds.com/wp-content/uploads/2025/07/3D-ocean-waves-sound-effect-seamless-loop.mp3"
      />
      
      <button
        onClick={togglePlay}
        className={`relative group flex items-center gap-3 bg-white/40 backdrop-blur-xl border border-white/40 p-3 pr-6 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${
          isPlaying ? 'ring-2 ring-orange-400' : ''
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          isPlaying 
            ? 'bg-orange-600 text-white animate-pulse' 
            : 'bg-white text-gray-500'
        }`}>
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </div>
        
        <div className="flex flex-col items-start overflow-hidden">
          <span className="text-[10px] uppercase font-black tracking-widest text-orange-800 opacity-60">Immersion</span>
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {isPlaying ? 'Écoutez Sassandra' : 'Activer l\'Escale'}
          </span>
        </div>

        {/* Visual waves effect when playing */}
        {isPlaying && (
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 flex gap-0.5 h-4 items-end">
            <div className="w-1 bg-orange-400 rounded-full animate-bounce [animation-duration:0.6s]"></div>
            <div className="w-1 bg-orange-500 rounded-full animate-bounce [animation-duration:1s]"></div>
            <div className="w-1 bg-orange-600 rounded-full animate-bounce [animation-duration:0.8s]"></div>
          </div>
        )}
      </button>

      {/* Intro Tooltip */}
      {!isPlaying && (
        <div className="absolute bottom-full left-0 mb-4 w-48 bg-gray-900 text-white p-3 rounded-2xl text-xs font-bold shadow-2xl animate-bounce after:content-[''] after:absolute after:top-full after:left-8 after:border-8 after:border-transparent after:border-t-gray-900">
          ✨ Plongez dans l'ambiance Solaire. Activez le son.
        </div>
      )}
    </div>
  );
}
