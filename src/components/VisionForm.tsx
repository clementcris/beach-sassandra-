'use client';

import { useState } from 'react';
import { submitFeedback } from '@/app/actions/feedback';
import { CheckCircle2, Send } from 'lucide-react';

export function VisionForm() {
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitFeedback(formData);
      setStatus('success');
      setFormData({ nom: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-700 rounded-[4.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center text-white">
            <CheckCircle2 className="h-20 w-20 mx-auto mb-8 animate-bounce" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-4">Vision Reçue !</h2>
            <p className="text-xl font-bold opacity-80">Merci d'aider à bâtir le futur de Sassandra Solaire. Nous lisons chaque message avec attention.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-10 text-sm font-black uppercase tracking-[0.3em] border-b-2 border-white/30 hover:border-white transition pb-1"
            >
              Envoyer une autre idée
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[4.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden border-b-8 border-orange-600 group">
          {/* Background Aura */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[100px] group-hover:bg-orange-600/30 transition-all duration-700"></div>
          
          <div className="relative z-10 text-center mb-12">
            <span className="text-orange-400 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Le Conseil des Voyageurs</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
              Votre Vision pour <br/><span className="text-orange-500">l'avenir</span>
            </h2>
            <p className="mt-6 text-gray-400 font-bold italic">
              C'est ici que s'écrit la prochaine escale. Critiquez, proposez, créez avec nous.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <input 
                required
                type="text" 
                placeholder="Votre Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder:text-gray-600"
              />
              <input 
                required
                type="email" 
                placeholder="Votre Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder:text-gray-600"
              />
            </div>
            <textarea 
              required
              rows={4} 
              placeholder="Votre message, vos critiques ou vos idées folles..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition placeholder:text-gray-600"
            ></textarea>
            <button 
              disabled={status === 'submitting'}
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-6 rounded-3xl uppercase tracking-widest text-lg shadow-xl shadow-orange-900 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Envoi en cours...' : (
                <>
                  Envoyer ma vision
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
            {status === 'error' && (
              <p className="text-red-500 font-bold text-center mt-4">Une erreur est survenue. Veuillez réessayer.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
