import { createClient } from '@/lib/supabase/server'
import { validatePayment } from '@/app/actions/payments'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch pending payments
  const { data: payments, error } = await supabase
    .from('payments')
    .select('*, tickets(*, events(titre), users(nom, email, telephone))')
    .eq('statut', 'en_attente')
    .order('created_at', { ascending: true })

  // Fetch feedbacks
  const { data: feedbacks } = await supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">Tour de Contrôle</div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">Centre de Validation Solaire</h1>
          <p className="text-gray-500 font-bold">Vérifiez et validez les transferts pour libérer les sésames du Sassandra Beach Camp.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-[2rem] shadow-xl border-t-4 border-orange-500 flex flex-col items-center">
          <span className="text-3xl font-black text-orange-600 leading-none">{payments?.length || 0}</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Dossiers</span>
        </div>
      </header>
      
      {error ? (
        <div className="p-12 bg-red-50 border-2 border-red-100 rounded-[3rem] text-red-600 text-center font-bold">
          ⚠️ Problème de connexion à la base de données.
        </div>
      ) : payments?.length === 0 ? (
        <div className="p-24 bg-white border-2 border-dashed border-gray-100 rounded-[4rem] text-gray-400 text-center flex flex-col items-center gap-6 shadow-inner">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-4xl shadow-xl">🥥</div>
          <h3 className="text-2xl font-black text-gray-900">Tout est calme sur la plage !</h3>
          <p className="max-w-xs font-bold uppercase tracking-widest text-xs">Aucun paiement n'attend votre validation actuellement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {payments?.map((payment) => (
            <div key={payment.id} className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border-b-8 border-orange-100 group">
              <div className="flex flex-col lg:flex-row gap-0 min-h-[400px]">
                {/* Info Client & Billet */}
                <div className="flex-1 p-10 md:p-14 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-orange-600 transition">
                        {payment.tickets.users.nom}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">📱 {payment.tickets.users.telephone}</span>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">✉️ {payment.tickets.users.email}</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] font-black px-4 py-1.5 rounded-full border border-green-200 uppercase tracking-widest">
                      {payment.tickets.events.titre}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 bg-orange-50/30 p-8 rounded-[2.5rem] border border-orange-50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Total</p>
                      <p className="text-xl font-black text-gray-900">{payment.tickets.montant_total}F</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Payé</p>
                      <p className="text-xl font-black text-green-600">{payment.tickets.montant_paye}F</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-2">À VALIDER</p>
                      <p className="text-3xl font-black text-orange-600 tracking-tighter">{payment.montant}F</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Méthode</p>
                      <p className="font-black text-xl text-gray-900 uppercase">{payment.methode}</p>
                    </div>
                    <p className="font-mono bg-orange-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold">{payment.numero_transaction}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <form className="flex-1" action={async () => {
                      "use server";
                      await validatePayment(payment.id, 'valide')
                    }}>
                      <button type="submit" className="w-full bg-orange-600 text-white font-black py-6 rounded-[2rem] hover:bg-orange-500 transition-all uppercase tracking-widest shadow-xl text-sm">
                        ✅ Valider l'Accès
                      </button>
                    </form>
                    <form className="sm:w-1/3" action={async () => {
                      "use server";
                      await validatePayment(payment.id, 'refuse')
                    }}>
                      <button type="submit" className="w-full border-2 border-red-100 hover:border-red-400 hover:bg-red-50 text-red-400 hover:text-red-600 font-black py-6 rounded-[2rem] transition-all uppercase tracking-widest text-xs">
                        ❌ Refuser
                      </button>
                    </form>
                  </div>
                </div>

                {/* Preuve Photo */}
                <div className="lg:w-96 relative bg-gray-50 border-l border-gray-100 overflow-hidden">
                   <img 
                    src={payment.preuve_image_url} 
                    alt="Preuve" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION FEEDBACKS */}
      <section className="mt-20 pt-20 border-t-4 border-gray-100">
        <header className="mb-12">
          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">Community Hub</div>
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter italic uppercase">Visions & Critiques des Voyageurs</h2>
          <p className="text-gray-500 font-bold max-w-xl">L'écoute est le moteur de l'excellence. Voici ce que pensent nos aventuriers.</p>
        </header>

        {!feedbacks || feedbacks.length === 0 ? (
          <div className="p-16 bg-gray-50 rounded-[4rem] text-center text-gray-400 font-bold border-2 border-dashed border-gray-200">
            Aucun feedback reçu pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white rounded-[3rem] p-10 shadow-xl border-l-8 border-orange-500 hover:shadow-2xl transition duration-500 flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 bg-orange-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:rotate-12 transition">📜</div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(fb.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-black text-lg mb-4 leading-tight italic">"{fb.sujet}"</p>
                  <p className="text-gray-600 font-bold text-sm leading-relaxed whitespace-pre-wrap">{fb.message}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-4">
                   <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Avis Voyageur</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
