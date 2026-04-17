'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { processScan } from '@/app/actions/scan'

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<{status: 'success'|'error'|'warning'|'idle', message: string}>({status: 'idle', message: ''})
  const [isScanning, setIsScanning] = useState(true)

  useEffect(() => {
    if (!isScanning) return;

    // Config scanner
    const scanner = new Html5QrcodeScanner("reader", { 
      qrbox: { width: 250, height: 250 }, 
      fps: 5,
    }, /* verbose= */ false);

    const onScanSuccess = async (decodedText: string) => {
      // Pause scan once we read something
      scanner.pause()
      
      setScanResult({ status: 'idle', message: 'Vérification en cours...' })
      
      const res = await processScan(decodedText)
      
      setScanResult({ status: res.status as any, message: res.message })
      
      // Auto-resume after 3s
      setTimeout(() => {
        setScanResult({ status: 'idle', message: '' })
        scanner.resume()
      }, 5000)
    }

    const onScanFailure = (error: any) => {
      // Ignore background errors
    }

    scanner.render(onScanSuccess, onScanFailure)

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error))
    }
  }, [isScanning])

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header>
        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm border border-green-200">Point de Contrôle</div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Scanner de Pass</h1>
        <p className="text-gray-500 font-bold mt-2">Validez les accès en temps réel pour la session actuelle.</p>
      </header>
      
      <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl border-b-8 border-gray-100 relative overflow-hidden">
        {/* Résultat Flottant Immérsif */}
        {scanResult.status !== 'idle' && (
          <div className={`absolute inset-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-300`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl mb-8 shadow-2xl animate-bounce ${
              scanResult.status === 'success' ? 'bg-green-100 text-green-600 shadow-green-100' :
              scanResult.status === 'error' ? 'bg-red-100 text-red-600 shadow-red-100' :
              'bg-orange-100 text-orange-600 shadow-orange-100'
            }`}>
              {scanResult.status === 'success' ? '🌴' : scanResult.status === 'error' ? '❌' : '⚠️'}
            </div>
            <h2 className={`text-3xl font-black mb-4 tracking-tighter uppercase ${
              scanResult.status === 'success' ? 'text-green-700' :
              scanResult.status === 'error' ? 'text-red-700' :
              'text-orange-700'
            }`}>
              {scanResult.status === 'success' ? 'Accès Autorisé' : 
               scanResult.status === 'error' ? 'Accès Refusé' : 
               'Déjà Utilisé'}
            </h2>
            <p className="text-gray-600 font-bold text-xl max-w-sm">{scanResult.message}</p>
          </div>
        )}

        <div className="aspect-square relative overflow-hidden bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 flex items-center justify-center shadow-inner group">
          <div id="reader" className="w-full h-full"></div>
          
          {/* Guide visuel de scan */}
          <div className="absolute inset-0 border-[50px] border-white/50 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-orange-500 rounded-3xl opacity-30 group-hover:opacity-100 transition-opacity">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-600 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-600 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-600 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-600 rounded-br-xl"></div>
            {/* Ligne laser */}
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-600/50 shadow-[0_0_15px_rgba(234,88,12,0.5)] animate-scan"></div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-gray-400 font-bold text-sm text-center max-w-xs leading-relaxed">
            Positionnez le QR Code au centre du viseur. Reprise automatique après validation.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] font-black tracking-widest text-orange-600 uppercase bg-orange-50 px-6 py-2 rounded-full hover:bg-orange-100 transition"
          >
            Réinitialiser la caméra
          </button>
        </div>
      </div>
    </div>
  )
}
