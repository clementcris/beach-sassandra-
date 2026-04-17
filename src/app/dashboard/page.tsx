import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Ticket, LogOut, Map, Calendar, User, ShieldCheck, ArrowRight, Waves, Globe } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get user profile for roles
  const { data: profile } = await supabase
    .from('users')
    .select('role, nom')
    .eq('id', user.id)
    .single()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, events(titre, date, lieu)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col font-sans">
      {/* HEADER SOLAIRE */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b-2 border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto group-hover:rotate-6 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-orange-600 uppercase">Sassandra</span>
              <span className="text-[8px] font-black text-green-700 tracking-[0.2em] uppercase">Beach Camp</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4 lg:gap-6">
            {profile?.role === 'admin' && (
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-full text-xs font-black shadow-lg shadow-green-200 hover:scale-105 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                ADMIN PANEL
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold text-sm transition transition-colors">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Se déconnecter</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* HERO DASHBOARD : LUMINEUX */}
      <div className="pt-24 pb-32 bg-orange-600 relative overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="animate-in fade-in slide-in-from-left duration-1000">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1.5 w-12 bg-white rounded-full"></div>
                <span className="text-orange-100 font-black tracking-[0.2em] text-xs uppercase">Mon Carnet de Route</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter italic">
                Akwaba chez vous, {profile?.nom?.split(' ')[0] || 'Aventurier'} !
              </h1>
              <p className="text-orange-50 text-xl font-bold opacity-90 max-w-md">
                Le sable de Sassandra chauffe déjà pour vous... 🏖️
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border-2 border-white/20 flex items-center gap-6 text-white shadow-2xl">
              <div className="bg-white p-4 rounded-3xl shadow-inner">
                <Ticket className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter">{tickets?.length || 0}</div>
                <div className="text-[10px] text-orange-100 font-black uppercase tracking-widest">Pass Réservé(s)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT : SABLE & COULEURS */}
      <main className="relative -mt-16 z-10 flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 w-full">
        <div className="bg-white rounded-[4rem] shadow-2xl border-b-8 border-gray-100 p-8 md:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <h2 className="text-4xl font-black text-gray-900 flex items-center gap-4 tracking-tighter">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <Waves className="h-8 w-8 text-orange-600" />
              </div>
              Mes Aventures
            </h2>
            <Link 
              href="/#tarifs" 
              className="w-full md:w-auto px-10 py-5 bg-green-700 text-white rounded-3xl font-black hover:bg-green-800 transition shadow-xl shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-widest text-sm border-b-4 border-green-900"
            >
              Prévoir une escale
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {tickets?.length === 0 ? (
            <div className="text-center py-24 px-4 bg-orange-50/50 rounded-[3rem] border-2 border-dashed border-orange-200">
              <div className="h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-8 bg-white shadow-xl">
                <Map className="h-16 w-16 text-orange-300" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">L'Horizon est encore libre...</h3>
              <p className="text-gray-500 font-bold max-w-sm mx-auto mb-10 text-lg">
                Vous n'avez pas de départ prévu pour le moment. Ne laissez pas les plus belles vagues de Sassandra glisser sans vous !
              </p>
              <Link 
                href="/#tarifs" 
                className="inline-flex items-center gap-3 text-orange-600 font-black text-xl hover:gap-6 transition-all uppercase tracking-tighter"
              >
                Découvrir les offres <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tickets?.map((ticket) => (
                <div key={ticket.id} className="group bg-white rounded-[3.5rem] shadow-xl hover:shadow-2xl border-2 border-gray-50 p-10 flex flex-col transition-all duration-500 relative overflow-hidden active:scale-95">
                  <div className={`absolute top-0 right-0 h-3 w-full ${
                    ticket.statut === 'payé' ? 'bg-green-500' : 
                    ticket.statut === 'en_validation' ? 'bg-orange-400' :
                    'bg-yellow-400'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-orange-50 p-4 rounded-3xl group-hover:rotate-12 transition-transform shadow-inner">
                      <Ticket className="h-8 w-8 text-orange-600" />
                    </div>
                    <span className={`px-5 py-2 text-[10px] uppercase font-black tracking-widest rounded-full shadow-sm border ${
                      ticket.statut === 'payé' ? 'bg-green-100 text-green-700 border-green-200' : 
                      ticket.statut === 'en_validation' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {ticket.statut === 'payé' ? '✅ Sésame Validé • Prêt pour le départ !' : 
                       ticket.statut === 'en_validation' ? '⏳ L’équipe prépare votre accueil...' :
                       '⌛ En attente'}
                    </span>
                  </div>

                  <h3 className="font-black text-3xl text-gray-900 mb-4 line-clamp-1 tracking-tighter group-hover:text-orange-600 transition">
                    {ticket.events?.titre}
                  </h3>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 text-gray-500 font-bold">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="text-sm">
                        {new Date(ticket.events?.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 font-bold">
                      <Map className="h-5 w-5 text-green-600" />
                      <span className="text-sm">{ticket.events?.lieu || 'Sassandra, CI'}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Pass</span>
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">{ticket.montant_total}F</span>
                    </div>
                    <Link 
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="h-16 w-16 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-[2rem] flex items-center justify-center transition-all shadow-lg hover:shadow-orange-200"
                    >
                      <ArrowRight className="h-7 w-7" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
