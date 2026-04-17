import { register } from '@/app/actions/auth'
import Link from 'next/link'
import { SubmitButton } from '@/components/auth/SubmitButton'

export default async function RegisterPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#FDFCF0] font-sans">
      <Link href="/" className="flex items-center gap-3 group mb-10">
        <img src="/images/logo.png" alt="Logo" className="h-16 w-auto group-hover:rotate-6 transition-transform" />
        <div className="flex flex-col leading-none">
          <span className="text-3xl font-black tracking-tighter text-orange-600 uppercase">Sassandra</span>
          <span className="text-[10px] font-black text-green-700 tracking-[0.2em] uppercase">Beach Camp</span>
        </div>
      </Link>

      <div className="w-full max-w-lg bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border-b-8 border-orange-100 animate-in fade-in zoom-in duration-700">
        <h1 className="text-4xl font-black text-center mb-10 text-gray-900 tracking-tighter uppercase italic">Devenir un Aventurier</h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-[2rem] text-xs font-bold border border-red-100 flex items-center gap-3 text-center">
            {error}
          </div>
        )}

        <form action={register} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4" htmlFor="nom">Nom complet</label>
              <input 
                type="text" 
                name="nom" 
                id="nom" 
                placeholder="Ex: Jean Koffi"
                required 
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4" htmlFor="telephone">Téléphone</label>
              <input 
                type="tel" 
                name="telephone" 
                id="telephone" 
                placeholder="Ex: 0707..."
                required 
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 shadow-inner"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4" htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              placeholder="votre@email.com"
              required 
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 shadow-inner"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4" htmlFor="password">Mot de passe</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="••••••••"
              required 
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900 shadow-inner"
            />
          </div>

          <SubmitButton label="Commencer l'Aventure" />
        </form>

        <p className="mt-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Déjà un habitué ?{' '}
          <Link href="/login" className="text-orange-600 hover:underline">
            Se Connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
