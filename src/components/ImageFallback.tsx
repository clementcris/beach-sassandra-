"use client"
import { useState } from 'react'

export function ImageFallback({ src, fallbackSrc, alt, className }: { src: string, fallbackSrc: string, alt: string, className: string }) {
  const [errorCount, setErrorCount] = useState(0)

  // 1. D'abord on essaie le chemin normal (ex: /images/hero.jpg)
  // 2. Si ça échoue à cause du renommage Windows, on essaie avec .jpg en plus (ex: /images/hero.jpg.jpg)
  // 3. Enfin on met l'image de secours internet
  let currentSrc = src;
  if (errorCount === 1) currentSrc = src + ".jpg";
  if (errorCount >= 2) currentSrc = fallbackSrc;

  return (
    <img 
      src={currentSrc} 
      onError={() => {
        if (errorCount < 2) setErrorCount(c => c + 1)
      }} 
      alt={alt} 
      className={className} 
    />
  )
}
