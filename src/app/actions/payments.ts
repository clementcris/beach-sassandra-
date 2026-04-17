'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitPaymentProof(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ticketId = formData.get('ticket_id') as string
  const montant = parseFloat(formData.get('montant') as string)
  const methode = formData.get('methode') as string
  const numeroTransaction = formData.get('numero_transaction') as string
  const file = formData.get('preuve_image') as File

  if (!file || file.size === 0) {
    throw new Error("Preuve image requise")
  }

  // 1. Upload the image to Supabase Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`

  const { error: uploadError, data } = await supabase.storage
    .from('payment-proofs')
    .upload(fileName, file)

  if (uploadError) {
    throw new Error("Erreur lors de l'upload de l'image")
  }

  const { data: publicUrlData } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(fileName)

  // 2. Insert into Payments
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      ticket_id: ticketId,
      montant,
      methode,
      numero_transaction: numeroTransaction,
      preuve_image_url: publicUrlData.publicUrl,
      statut: 'en_attente'
    })

  if (paymentError) {
    throw new Error(paymentError.message)
  }

  // 3. Update ticket status
  await supabase
    .from('tickets')
    .update({ statut: 'en_validation' })
    .eq('id', ticketId)

  revalidatePath(`/dashboard/tickets/${ticketId}`)
  revalidatePath('/dashboard')
}

export async function validatePayment(paymentId: string, action: 'valide' | 'refuse') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // On suppose que le validateur est un admin (la RLS vérifira aussi)
  // 1. Get payment
  const { data: payment } = await supabase
    .from('payments')
    .select('*, tickets(montant_total, montant_paye)')
    .eq('id', paymentId)
    .single()

  if (!payment) return { error: "Paiement introuvable" }

  const newStatus = action === 'valide' ? 'validé' : 'refusé'
  
  // Update Payment
  const { error: updateError } = await supabase
    .from('payments')
    .update({ 
      statut: newStatus,
      valide_par: user?.id,
      date_validation: new Date().toISOString()
    })
    .eq('id', paymentId)

  if (action === 'valide') {
    // Calcul nouveau montant
    const newMontantPaye = Number(payment.tickets.montant_paye) + Number(payment.montant)
    let ticketStatut = 'partiel'
    if (newMontantPaye >= Number(payment.tickets.montant_total)) {
      ticketStatut = 'payé'
    }

    // Update Ticket
    await supabase
      .from('tickets')
      .update({
        montant_paye: newMontantPaye,
        statut: ticketStatut
      })
      .eq('id', payment.ticket_id)
  }

  revalidatePath('/admin/dashboard')
  return { success: true }
}
