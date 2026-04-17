'use server'

import { createClient } from '@/lib/supabase/server'

export async function processScan(qrCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, message: "Non autorisé" }

  // 1. Chercher le ticket correspondand
  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, events(titre), users(nom)')
    .eq('qr_code', qrCode)
    .single()

  if (!ticket) {
    return { success: false, status: 'error', message: "QR Code invalide ou ticket inconnu." }
  }

  if (ticket.statut !== 'payé') {
    return { success: false, status: 'warning', message: `Ce billet n'est pas payé. Statut actuel: ${ticket.statut}` }
  }

  // 2. Vérifier s'il a déjà été scanné (on suppose qu'un billet est à usage unique pour simplifier)
  const { data: existingScan } = await supabase
    .from('scans')
    .select('*')
    .eq('ticket_id', ticket.id)
    .eq('valide', true)
    // On pourrait regarder sur les 24h ou juste count > 0

  if (existingScan && existingScan.length > 0) {
    return { 
      success: false, 
      status: 'error', 
      message: `Attention : Ce billet a déjà été scanné le ${new Date(existingScan[0].date_scan).toLocaleString()}` 
    }
  }

  // 3. Enregistrer le scan
  await supabase
    .from('scans')
    .insert({
      ticket_id: ticket.id,
      valide: true
    })

  return {
    success: true,
    status: 'success',
    message: `Accès autorisé ! Billet pour ${ticket.events.titre}. Au nom de ${ticket.users.nom}.`
  }
}
