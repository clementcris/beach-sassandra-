import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { submitPaymentProof } from '@/app/actions/payments'
import { QRCodeSVG } from 'qrcode.react'

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch ticket + event
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*, events(*)')
    .eq('id', id)
    .maybeSingle()

  // Fetch user profile (name, phone)
  const { data: profile } = await supabase
    .from('users')
    .select('nom, telephone')
    .eq('id', user.id)
    .single()

  if (ticketError || !ticket) {
    return (
      <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-sm">
          <div className="text-6xl">🌊</div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Billet introuvable</h2>
          <p className="text-gray-400 font-bold text-sm">Réf: {id}</p>
          <Link href="/dashboard" className="inline-block bg-orange-600 text-white font-black px-8 py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-orange-700 transition">
            Retour au carnet de route
          </Link>
        </div>
      </div>
    )
  }

  // Fetch payments history
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('ticket_id', ticket.id)
    .order('created_at', { ascending: false })

  const typePass = ticket.montant_total >= 80000 ? 'Couple' : 'Solo'
  const resteAPayer = ticket.montant_total - ticket.montant_paye
  const isPaid = ticket.statut === 'payé'
  const isInValidation = ticket.statut === 'en_validation'
  const voyageurNom = profile?.nom || 'Aventurier'

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Retour */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
          <div className="h-7 w-7 bg-white rounded-xl flex items-center justify-center shadow text-sm">←</div>
          Mon carnet de route
        </Link>

        {/* ═══════════════════════════════════════════════ */}
        {/* BOARDING PASS : PARTIE PRINCIPALE              */}
        {/* ═══════════════════════════════════════════════ */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">

          {/* BANDE SUPÉRIEURE COLORÉE */}
          <div className={`h-3 w-full ${isPaid ? 'bg-green-600' : isInValidation ? 'bg-orange-500' : 'bg-yellow-400'}`} />

          {/* EN-TÊTE BOARDING PASS */}
          <div className="bg-gray-900 px-8 pt-8 pb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto brightness-200" />
              <div>
                <p className="text-white font-black text-lg tracking-tighter uppercase">Sassandra Solaire</p>
                <p className="text-orange-400 text-[9px] font-black uppercase tracking-[0.3em]">Beach Camp Experience</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Type de Pass</p>
              <p className="text-white font-black text-xl tracking-tighter">{typePass.toUpperCase()}</p>
            </div>
          </div>

          {/* CORPS DU BOARDING PASS */}
          <div className="px-8 py-8">

            {/* NOM DU VOYAGEUR : Mis en valeur */}
            <div className="mb-8">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Passager / Voyageur</p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                {voyageurNom}
              </h1>
              {profile?.telephone && (
                <p className="text-sm text-gray-400 font-bold mt-1">📱 {profile.telephone}</p>
              )}
            </div>

            {/* LIGNE DE SÉPARATION POINTILLÉE */}
            <div className="border-t-2 border-dashed border-gray-100 mb-8" />

            {/* INFOS DU VOYAGE : GRILLE STYLE BOARDING */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 mb-8">
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                <p className="font-black text-gray-900 text-lg tracking-tight">Sassandra, CI</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Date d'Embarquement</p>
                <p className="font-black text-gray-900 text-lg">
                  {new Date(ticket.events.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Évènement</p>
                <p className="font-black text-orange-600 text-sm">{ticket.events.titre}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Lieu</p>
                <p className="font-black text-gray-900 text-sm">{ticket.events.lieu}</p>
              </div>
            </div>

            {/* STATUT DU BILLET */}
            <div className={`rounded-2xl p-5 flex items-center justify-between gap-4 mb-8 ${
              isPaid ? 'bg-green-50 border-2 border-green-200' :
              isInValidation ? 'bg-orange-50 border-2 border-orange-200' :
              'bg-yellow-50 border-2 border-yellow-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  isPaid ? 'bg-green-100' : isInValidation ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  {isPaid ? '✅' : isInValidation ? '⏳' : '💳'}
                </div>
                <div>
                  <p className={`font-black text-sm uppercase tracking-tight ${
                    isPaid ? 'text-green-700' : isInValidation ? 'text-orange-700' : 'text-yellow-700'
                  }`}>
                    {isPaid ? 'Sésame Validé — Prêt pour le départ !' :
                     isInValidation ? 'Dossier soumis — Accueil en préparation' :
                     'Paiement en attente'}
                  </p>
                  <p className="text-gray-400 font-bold text-xs mt-0.5">
                    {isPaid ? 'Votre QR code est actif ci-dessous' :
                     isInValidation ? `L'équipe vérifie votre virement sous 24h` :
                     'Finalisez votre règlement pour confirmer votre place'}
                  </p>
                </div>
              </div>
            </div>

            {/* BANDE DE SÉPARATION AVEC ENCOCHES (STYLE TICKET) */}
            <div className="relative flex items-center my-6">
              <div className="absolute -left-8 w-8 h-8 bg-stone-100 rounded-r-full" />
              <div className="flex-1 border-t-2 border-dashed border-gray-200" />
              <div className="absolute -right-8 w-8 h-8 bg-stone-100 rounded-l-full" />
            </div>

            {/* PIED DU BOARDING PASS : PRIX */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Sésame</p>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">{ticket.montant_total.toLocaleString()} <span className="text-lg text-gray-400">FCFA</span></p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Restant</p>
                <p className={`text-2xl font-black ${resteAPayer > 0 ? 'text-orange-600' : 'text-green-600'} tracking-tighter`}>
                  {resteAPayer > 0 ? `${resteAPayer.toLocaleString()} F` : '✓ Soldé'}
                </p>
              </div>
            </div>
          </div>

          {/* BANDE INFÉRIEURE */}
          <div className="bg-gray-900 px-8 py-4 flex items-center justify-between">
            <p className="text-gray-600 font-black text-[9px] uppercase tracking-widest">Réf: {ticket.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-gray-600 font-black text-[9px] uppercase tracking-widest">
              {new Date(ticket.created_at).toLocaleDateString('fr-FR')} • Sassandra Beach Camp
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* QR CODE — SÉSAME DÉBLOQUÉ                      */}
        {/* ═══════════════════════════════════════════════ */}
        {isPaid && ticket.qr_code && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-t-4 border-green-600">
            <div className="bg-green-600 px-8 py-5 flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-lg">🌴</div>
              <div>
                <h2 className="text-white font-black text-xl tracking-tighter uppercase">Votre Sésame Solaire</h2>
                <p className="text-green-100 text-xs font-bold">Présentez ce QR code à l'entrée du camp</p>
              </div>
            </div>
            <div className="p-10 flex flex-col items-center gap-6">
              <div className="relative">
                {/* Coins stylisés */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl -translate-x-2 -translate-y-2" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl translate-x-2 -translate-y-2" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl -translate-x-2 translate-y-2" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl translate-x-2 translate-y-2" />
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                  <QRCodeSVG value={ticket.qr_code} size={220} fgColor="#111111" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-black text-gray-900 text-lg tracking-tight">{voyageurNom}</p>
                <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-widest">{ticket.events.titre} • {typePass}</p>
                <p className="font-mono text-[10px] text-gray-300 mt-3 bg-gray-50 px-4 py-2 rounded-full">{ticket.qr_code}</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STATUT EN VALIDATION                            */}
        {/* ═══════════════════════════════════════════════ */}
        {isInValidation && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-[2rem] p-8 text-center space-y-4">
            <div className="text-4xl animate-bounce">⏳</div>
            <h3 className="font-black text-gray-900 text-xl tracking-tight">Dossier reçu par l'équipe</h3>
            <p className="text-gray-600 font-bold text-sm leading-relaxed max-w-sm mx-auto">
              Votre virement est en cours de vérification. Une fois validé, votre QR code sera débloqué sous 24h.
            </p>
            <a
              href={`https://wa.me/2250704538796?text=${encodeURIComponent(`Bonjour, je vérifie l'avancement de mon dossier Sassandra. Réf: #${ticket.id.slice(0,8).toUpperCase()} — Au nom de ${voyageurNom} 🌊`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-green-700 transition text-sm uppercase tracking-widest shadow-lg"
            >
              📱 Vérifier avec le Guide-Hôte
            </a>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* FORMULAIRE PAIEMENT (si en_attente)             */}
        {/* ═══════════════════════════════════════════════ */}
        {!isPaid && !isInValidation && (
          <div className="space-y-5">

            {/* Étape 1 : Contacter WhatsApp */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border-l-8 border-green-600">
              <div className="flex items-center gap-4 mb-5">
                <div className="h-10 w-10 rounded-2xl bg-green-100 text-green-700 font-black text-xl flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg tracking-tight">Contactez votre Guide-Hôte</h3>
                  <p className="text-gray-400 font-bold text-xs">Obtenez le numéro de compte pour votre virement</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 text-sm text-green-900 font-bold mb-5 border border-green-100">
                <span className="font-black">Consigne Akwaba : </span>Le paiement s'effectue via Mobile Money directement auprès de nos agents. Votre Guide-Hôte vous fournira le numéro et confirmera votre dossier.
              </div>
              <a
                href={`https://wa.me/2250704538796?text=${encodeURIComponent(`Akwaba ! 🌊 Je veux finaliser mon inscription au Sassandra Beach Camp. Réf: #${ticket.id.slice(0,8).toUpperCase()} — Au nom de ${voyageurNom}. Merci !`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-black py-5 rounded-2xl hover:bg-green-700 transition shadow-lg uppercase tracking-widest text-sm border-b-4 border-green-900"
              >
                <span>📱</span> Échanger sur WhatsApp
              </a>
            </div>

            {/* Étape 2 : Soumettre preuve */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border-l-8 border-orange-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-700 font-black text-xl flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg tracking-tight">Confirmez votre virement</h3>
                  <p className="text-gray-400 font-bold text-xs">Uploadez votre reçu pour activer votre dossier</p>
                </div>
              </div>

              <form action={submitPaymentProof} className="space-y-5">
                <input type="hidden" name="ticket_id" value={ticket.id} />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Réseau</label>
                    <select name="methode" required className="w-full rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white p-4 font-bold outline-none text-sm">
                      <option value="wave">Wave 🌊</option>
                      <option value="orange_money">Orange Money 🍊</option>
                      <option value="mtn_money">MTN Money</option>
                      <option value="moov_money">Moov Money</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Montant (F CFA)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="montant"
                        max={resteAPayer}
                        required
                        placeholder={`Max: ${resteAPayer.toLocaleString()}`}
                        className="w-full rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white p-4 font-bold outline-none text-sm pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-300 text-xs">F</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">ID de la transaction (reçu SMS)</label>
                  <input
                    type="text"
                    name="numero_transaction"
                    required
                    placeholder="Ex: TXN-2026-XXXXXX"
                    className="w-full rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white p-4 font-bold outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Capture d'écran du reçu</label>
                  <div className="relative group">
                    <input type="file" name="preuve_image" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-orange-400 group-hover:bg-orange-50/40 transition-all rounded-2xl p-10 flex flex-col items-center gap-3">
                      <span className="text-3xl">📸</span>
                      <p className="text-sm font-bold text-gray-400 group-hover:text-orange-600 transition">Cliquez pour ajouter la photo</p>
                      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">JPG, PNG, HEIC acceptés</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-sm border-b-4 border-gray-700 shadow-xl active:scale-95"
                >
                  ✉️ Transmettre mon Dossier
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* HISTORIQUE DES VERSEMENTS                       */}
        {/* ═══════════════════════════════════════════════ */}
        {payments && payments.length > 0 && (
          <div className="bg-white rounded-[2rem] shadow-lg p-8">
            <h2 className="font-black text-gray-900 text-xl tracking-tighter mb-6 flex items-center gap-3">
              <span className="h-8 w-8 bg-orange-100 rounded-xl flex items-center justify-center text-sm">📜</span>
              Historique des Versements
            </h2>
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-100 transition">
                  <div className="space-y-0.5">
                    <p className="font-black text-gray-900 text-base">
                      {payment.montant.toLocaleString()} F
                      <span className="text-[10px] text-orange-600 uppercase font-bold ml-2">via {payment.methode}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {new Date(payment.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 text-[9px] font-black rounded-full uppercase tracking-widest border ${
                    payment.statut === 'validé' ? 'bg-green-50 text-green-700 border-green-200' :
                    payment.statut === 'refusé' ? 'bg-red-50 text-red-600 border-red-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {payment.statut === 'validé' ? '✅ Validé' :
                     payment.statut === 'refusé' ? '❌ Refusé' :
                     '⏳ En attente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pied de page */}
        <div className="text-center pb-8">
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em]">
            Sassandra Beach Camp • +225 0704538796 • Sassandra, Côte d'Ivoire
          </p>
        </div>

      </div>
    </div>
  )
}
