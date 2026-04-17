'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
}

export function SubmitButton({ label, pendingLabel = 'Chargement...' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        w-full flex justify-center items-center py-6 px-4 font-black rounded-[2rem] shadow-2xl transition-all transform active:scale-95 uppercase tracking-widest text-sm border-b-4 
        ${pending 
          ? 'bg-orange-400 cursor-not-allowed border-orange-500' 
          : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-100 border-orange-800'}
      `}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  )
}
