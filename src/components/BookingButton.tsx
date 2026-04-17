'use client'

import { useTransition, useState } from 'react'
import { bookTicket } from '@/app/actions/tickets'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

interface BookingButtonProps {
  typeTicket: 'solo' | 'couple'
  label: string
  className: string
}

export function BookingButton({ typeTicket, label, className }: BookingButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleBooking = async () => {
    setError(null)
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append('type_ticket', typeTicket)
      
      const result = await bookTicket(formData)
      
      if (result && 'error' in result) {
        setError(result.error as string)
      }
    })
  }

  return (
    <div className="w-full">
      <button
        onClick={handleBooking}
        disabled={isPending}
        className={`${className} flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Embarquement...
          </>
        ) : (
          label
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-start gap-3 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
