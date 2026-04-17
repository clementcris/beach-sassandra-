import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-300 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-400 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="max-w-4xl w-full bg-white rounded-[4rem] shadow-2xl overflow-hidden relative z-10 border-b-8 border-green-200 transform-3d rotate-x-1">
        <div className="flex flex-col md:flex-row h-full">
          {/* Visual Side */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <Image
              src="/images/not_found_solaire.png"
              alt="L'Escale Égarée"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:to-white"></div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center text-center md:text-left">
            <span className="text-orange-600 font-black text-6xl md:text-8xl mb-4 opacity-20">404</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic leading-none">
              L'Escale <span className="text-green-700">Égarée</span>
            </h1>
            <p className="text-xl text-gray-500 font-bold mb-10 italic">
              "Même au cœur de Sassandra, il arrive que l'on perde sa trace. Mais aucune route ne s'arrête vraiment ici."
            </p>
            
            <Link 
              href="/" 
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-5 rounded-2xl text-lg uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-orange-100"
            >
              Retourner à la Côte
            </Link>
          </div>
        </div>
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full border border-white/40 shadow-2xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 shadow-2xl animate-float-delayed pointer-events-none"></div>
    </div>
  );
}
