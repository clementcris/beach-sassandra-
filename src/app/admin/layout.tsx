import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (dbUser?.role !== 'admin') {
    redirect('/') // Non autorisé
  }

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col md:flex-row font-sans text-gray-900">
      <aside className="w-full md:w-72 bg-white border-r-4 border-orange-100 flex flex-col shadow-xl">
        <div className="p-8 flex flex-col items-center border-b border-gray-100">
          <img src="/images/logo.png" alt="Sassandra Logo" className="w-32 h-auto mb-4 hover:rotate-6 transition-transform" />
          <div className="text-orange-600 font-black text-center tracking-widest text-[10px] uppercase bg-orange-50 px-4 py-1 rounded-full">Administration</div>
        </div>
        
        <nav className="flex-1 px-4 py-10 space-y-6">
          <Link href="/admin/dashboard" className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all duration-300 group font-bold">
            <div className="w-2 h-2 bg-orange-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
            Paiements en attente
          </Link>
          <Link href="/admin/scan" className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-2xl transition-all duration-300 group font-bold">
            <div className="w-2 h-2 bg-green-600 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
            Scanner QR Code
          </Link>
          
          <div className="pt-10 mt-10 border-t border-gray-100">
            <Link href="/" className="flex items-center gap-3 px-5 py-3 text-gray-400 hover:text-orange-600 transition-colors font-bold text-sm">
              ← Retour au site
            </Link>
          </div>
        </nav>

        <div className="p-6 text-[10px] text-gray-300 text-center uppercase tracking-widest font-black">
          Sassandra Beach Camp v1.1
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
