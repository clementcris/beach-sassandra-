'use client';

import { createClient } from '@/lib/supabase/client';

export async function submitFeedback(formData: { nom: string; email: string; message: string }) {
  const supabase = createClient();

  const { error } = await supabase
    .from('feedbacks')
    .insert([
      {
        sujet: 'Vision Voyageur',
        message: `Nom: ${formData.nom}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
        score: 5,
      },
    ]);

  if (error) throw error;
  return { success: true };
}
