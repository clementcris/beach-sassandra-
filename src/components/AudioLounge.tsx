'use client';

import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioLounge() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setTooltipDismissed(true); // masquer le tooltip après 1er clic
    }
  };

  return (
    <div className="fixed z-[100]
      /* Mobile : petit bouton discret en bas à droite */
      bottom-5 right-4
      /* Desktop : bouton complet en bas à gauche */
      md:bottom-10 md:left-10 md:right-auto
    ">
      <audio
        ref={audioRef}
        loop
        src="https://orangefreesounds.com/wp-content/uploads/2025/07/3D-ocean-waves-sound-effect-seamless-loop.mp3"
      />

      {/* Tooltip — desktop seulement, et disparaît après premier clic */}
      {!isPlaying && !tooltipDismissed && (
        <div className="hidden md:block absolute bottom-full left-0 mb-4 w-48 bg-gray-900 text-white p-3 rounded-2xl text-xs font-bold shadow-2xl animate-bounce after:content-[''] after:absolute after:top-full after:left-8 after:border-8 after:border-transparent after:border-t-gray-900">
          ✨ Plongez dans l&apos;ambiance Solaire. Activez le son.
        </div>
      )}

      {/* MOBILE : icône seule, petite et discrète */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Couper le son' : 'Activer le son ambiance'}
        className={`
          md:hidden
          w-10 h-10 rounded-full flex items-center justify-center shadow-lg
          transition-all duration-300 active:scale-90
          ${isPlaying
            ? 'bg-orange-600 text-white ring-2 ring-orange-400'
            : 'bg-white/80 backdrop-blur text-gray-500 border border-gray-200'
          }`}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* DESKTOP : bouton complet original */}
      <button
        onClick={togglePlay}
        className={`hidden md:flex relative group items-center gap-3 bg-white/40 backdrop-blur-xl border border-white/40 p-3 pr-6 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${
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
            {isPlaying ? 'Écoutez Sassandra' : "Activer l'Escale"}
          </span>
        </div>

        {isPlaying && (
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 flex gap-0.5 h-4 items-end">
            <div className="w-1 bg-orange-400 rounded-full animate-bounce [animation-duration:0.6s]"></div>
            <div className="w-1 bg-orange-500 rounded-full animate-bounce [animation-duration:1s]"></div>
            <div className="w-1 bg-orange-600 rounded-full animate-bounce [animation-duration:0.8s]"></div>
          </div>
        )}
      </button>
    </div>
  );
}
