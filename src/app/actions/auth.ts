'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    let errorMessage = error.message
    if (errorMessage.includes('Invalid login credentials')) {
      errorMessage = "Email ou mot de passe incorrect."
    } else if (errorMessage.includes('Email not confirmed')) {
      errorMessage = "Veuillez confirmer votre adresse email."
    }
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nom = formData.get('nom') as string
  const telephone = formData.get('telephone') as string

  // 1. Créer le compte via l'API Admin pour auto-confirmer l'email
  const adminSupabase = await createAdminClient()
  const { data: authData, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nom, telephone }
  })

  if (error) {
    let errorMessage = error.message
    
    // Traductions des erreurs communes
    if (errorMessage.includes('security purposes')) {
      errorMessage = "Par mesure de sécurité, veuillez patienter une minute avant de réessayer."
    } else if (errorMessage.includes('registered')) {
      errorMessage = "Cet email est déjà utilisé."
    } else if (errorMessage.includes('least 6 characters')) {
      errorMessage = "Le mot de passe doit contenir au moins 6 caractères."
    } else if (errorMessage.includes('at least one character of each')) {
      errorMessage = "Le mot de passe doit contenir des lettres (majuscules/minuscules) et des chiffres."
    } else if (errorMessage.includes('Invalid email')) {
      errorMessage = "L'adresse email n'est pas valide."
    }

    redirect(`/register?error=${encodeURIComponent(errorMessage)}`)
  }

  // 2. Connecter l'utilisateur automatiquement
  await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 2. Créer le profil dans public.users avec nom + téléphone
  if (authData.user) {
    await supabase.from('users').upsert({
      id: authData.user.id,
      email,
      nom,
      telephone,
      role: 'user'
    }, { onConflict: 'id' })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
