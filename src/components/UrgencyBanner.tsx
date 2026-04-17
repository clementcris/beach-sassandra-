'use client'

import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'

export function UrgencyBanner() {
  const [count, setCount] = useState(25)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initial random count between 12 and 22 to simulate already sold tickets
    const initialCount = Math.floor(Math.random() * (22 - 12 + 1)) + 12
    setCount(initialCount)
    setIsVisible(true)

    // Simulate "sales" every 15-45 seconds
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 5) return prev
        return prev - 1
      })
    }, Math.random() * (45000 - 15000) + 15000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-24 right-4 z-[60] animate-in fade-in slide-in-from-right duration-700 pointer-events-none md:pointer-events-auto">
      <div className="bg-orange-600/90 backdrop-blur-xl border-l-4 border-yellow-400 p-4 rounded-2xl shadow-2xl flex items-center gap-4 group">
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
