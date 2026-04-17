'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function bookTicket(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // L'event ID peut être passé en hidden input, ou hardcodé puisqu'on a qu'un événement phare
  // On va utiliser le nom de l'event pour trouver le bon (au cas où l'ID change)
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .ilike('titre', '%Sassandra%') 
    .limit(1)
    .single()

  let finalEventId = event?.id

  // Si l'événement n'existe pas encore (BDD vide), on le crée à la volée !
  if (eventError || !event) {
    const { data: newEvent } = await supabase.from('events').insert({
      titre: 'Sassandra Beach Camp',
      description: 'Expérience immersive de 3 jours',
      date: '2026-06-05T08:00:00Z',
      lieu: 'Sassandra, Côte d\'Ivoire',
      prix_total: 50000 
    }).select('id').single()
    finalEventId = newEvent?.id
  }

  if (!finalEventId) {
    console.error("Event error:", eventError)
    return { error: "L'événement 'Sassandra Beach Camp' n'existe pas et nous n'avons pas pu le créer automatiquement. Vérifiez que votre compte a bien le rôle 'admin' dans Supabase (colonne 'role')." }
  }

  // Type de ticket ('solo' ou 'couple')
  const type_ticket = formData.get('type_ticket') as string
  const montantFinal = type_ticket === 'couple' ? 80000 : 50000

  // Création du ticket
  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      user_id: user.id,
      event_id: finalEventId,
      montant_total: montantFinal,
      montant_paye: 0,
      statut: 'en_attente',
      qr_code: `SASSANDRA-${crypto.randomUUID().toUpperCase()}`
    })
    .select()
    .single()

  if (error) {
    return { error: `Erreur base de données : ${error.message}` }
  }

  revalidatePath('/dashboard')
  redirect(`/dashboard/tickets/${ticket.id}`)
}
