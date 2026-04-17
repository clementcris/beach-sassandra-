import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { bookTicket } from '@/app/actions/tickets'

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    return <div className="p-8 text-center text-red-500">Événement introuvable.</div>
  }

  // Vérifier si connecté
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col font-sans">
      <header className="bg-white/70 backdrop-blur-md border-b border-orange-50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto group-hover:rotate-6 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-orange-600 uppercase">Sassandra</span>
              <span className="text-[8px] font-black text-green-700 tracking-widest uppercase">Beach Camp</span>
            </div>
          </Link>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors">
            ← Revenir à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-white rounded-[3.5rem] shadow-[0_30px_60px_rgba(255,125,0,0.1)] border border-orange-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 h-32 w-32 bg-orange-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="p-10 md:p-14">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-green-200 shadow-sm">
              Escale Prochaine
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter leading-none italic uppercase">
              {event.titre}
            </h1>
            
            <div className="prose prose-orange max-w-none">
              <p className="text-gray-500 text-lg md:text-xl font-bold mb-10 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#FDFCF0] p-10 rounded-[2.5rem] mb-12 border-2 border-orange-50 shadow-inner group">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Le Rendez-vous</h3>
                <p className="text-gray-900 font-black text-lg tracking-tight uppercase">
                  {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-orange-600 font-bold text-sm">À partir de {new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Le Spot</h3>
                <p className="text-gray-900 font-black text-lg tracking-tight uppercase leading-tight">
                  {event.lieu}
                </p>
                <p className="text-green-700 font-bold text-sm">Côte d'Ivoire 🌍</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tarif Pass</h3>
                <p className="text-3xl font-black text-orange-600 tracking-tighter">
                  {event.prix_total}<span className="text-sm ml-1 text-gray-400">F</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              {user ? (
                <form action={async () => {
                  "use server"
                  await bookTicket(event.id)
                }} className="w-full">
                  <button type="submit" className="w-full bg-orange-600 text-white font-black py-6 px-10 rounded-[2rem] hover:bg-orange-500 transition-all shadow-2xl shadow-orange-100 text-xl uppercase tracking-widest border-b-4 border-orange-800 transform active:scale-95">
                    Réserver mon Escale Solaire
                  </button>
                </form>
              ) : (
                <Link href="/login" className="w-full bg-gray-900 text-white font-black py-6 px-10 rounded-[2rem] hover:bg-black transition-all shadow-2xl text-xl uppercase tracking-widest text-center border-b-4 border-gray-600 transform active:scale-95">
                  Embarquer pour réserver
                </Link>
              )}
            </div>
            
            <p className="text-center mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              L'aventure commence ici • Sassandra Beach Camp
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
