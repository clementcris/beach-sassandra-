'use client'

import { useState, useEffect } from 'react'
import { Flame, X } from 'lucide-react'

export function UrgencyBanner() {
  const [count, setCount] = useState(25)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const initialCount = Math.floor(Math.random() * (22 - 12 + 1)) + 12
    setCount(initialCount)
    // Délai avant apparition pour ne pas gêner le scroll initial
    const timer = setTimeout(() => setIsVisible(true), 3000)

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 5) return prev
        return prev - 1
      })
    }, Math.random() * (45000 - 15000) + 15000)

    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [])

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed z-[60] animate-in fade-in slide-in-from-top duration-700
      /* Mobile : bande fine en haut, sous le header */
      top-[76px] left-0 right-0
      /* Desktop : badge flottant en haut à droite */
      md:top-24 md:left-auto md:right-4 md:w-auto
    ">
      {/* Mobile : bande compacte pleine largeur */}
      <div className="md:hidden flex items-center justify-between gap-3 bg-orange-600 px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-yellow-300 animate-pulse flex-shrink-0" />
          <p className="text-white font-black text-[11px] uppercase tracking-tight">
            Vente en cours · Plus que <span className="text-yellow-300">{count}</span> Sésames
          </p>
        </div>
        <button onClick={() => setIsDismissed(true)} className="text-white/70 hover:text-white flex-shrink-0">
          <X size={14} />
        </button>
      </div>

      {/* Desktop : badge flottant original (inchangé) */}
      <div className="hidden md:flex bg-orange-600/90 backdrop-blur-xl border-l-4 border-yellow-400 p-4 rounded-2xl shadow-2xl items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="relative bg-white h-12 w-12 rounded-full flex items-center justify-center shadow-inner">
            <Flame className="h-6 w-6 text-orange-600 animate-bounce" />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em] leading-none mb-1">
            Vente en cours
          </p>
          <p className="text-white font-black text-xl tracking-tighter uppercase italic">
            Plus que <span className="text-yellow-300 text-2xl">{count}</span> Sésames
          </p>
        </div>
      </div>
    </div>
  )
}
