import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, MapPin, Map, Calendar, Users, Waves, Flame, Award, ArrowRight, Play } from 'lucide-react'
import { BookingButton } from '@/components/BookingButton'
import { UrgencyBanner } from '@/components/UrgencyBanner'
import { VisionForm } from '@/components/VisionForm'
import { TropicalGallery } from '@/components/TropicalGallery'
import * as motion from 'framer-motion/client'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-orange-200 overflow-x-hidden font-body">
      <UrgencyBanner />
      
      {/* HEADER TROPICAL PRO */}
      <header className="fixed w-full z-50 bg-white border-b-2 border-orange-100 shadow-md py-5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <img src="/images/logo.png" alt="Sassandra Camp" className="h-14 w-auto object-contain drop-shadow-sm" />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-heading font-black tracking-tighter text-accent uppercase">Sassandra</span>
              <span className="text-[9px] font-body font-black text-lush tracking-[0.3em] uppercase">Solaire Experience</span>
            </div>
          </motion.div>
          
          <nav className="hidden lg:flex items-center gap-12">
            {["L'Esprit", 'Programme', 'Réservation'].map((item, idx) => (
              <Link 
                key={item}
                href={`#${['experience', 'programme', 'tarifs'][idx]}`} 
                className="text-xs font-black text-foreground/50 hover:text-accent transition-all tracking-[0.2em] uppercase"
              >
                {item}
              </Link>
            ))}
          </nav>

          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
          >
            {user ? (
              <Link href="/dashboard" className="bg-accent text-white font-black px-8 py-3 rounded-full hover:bg-orange-700 transition shadow-xl shadow-orange-200 text-xs uppercase tracking-widest">
                Mon Espace
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="px-8 py-3 bg-accent text-white rounded-full text-[10px] font-black shadow-2xl shadow-orange-100 hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                Embarquer • Akwaba
              </Link>
            )}
          </motion.div>
        </div>
      </header>

      {/* HERO SECTION : IMMERSION TOTALE */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/images/hero.jpg" 
            alt="Camping Sassandra" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/40 to-transparent" />
          <div className="absolute inset-0 bg-[#0F4C75]/20 mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full pt-36 pb-16">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
               <span className="px-5 py-2 rounded-full glass-pro text-white font-black tracking-[0.2em] text-[10px] uppercase border border-white/20">
                  ☀️ L'Horizon Solaire n'attend que vous.
               </span>
               <div className="bg-accent text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-2xl animate-pulse">
                Exclusif • 25 Places Uniquement
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-5xl sm:text-7xl md:text-9xl font-heading font-black text-white mb-6 leading-[0.85] tracking-tighter"
            >
              VOTRE ESCALE <br /> 
              <span className="solaire-text">AKWABA.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-white/80 text-base sm:text-xl md:text-3xl font-medium mb-10 max-w-2xl leading-relaxed font-body"
            >
              Vivez l'inoubliable : 3 jours d'évasion sauvage et chic entre l'écume de Sassandra et la chaleur de nos feux de camp.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link 
                href="#tarifs" 
                className="w-full sm:w-auto px-12 py-6 bg-white text-accent rounded-full font-black text-base hover:scale-105 transition-all shadow-2xl uppercase tracking-widest border-b-4 border-orange-100 flex items-center justify-center gap-4 group"
              >
                REJOINDRE L'AVENTURE
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex flex-wrap gap-8 mt-24"
          >
            <div className="flex items-center gap-5 glass-pro p-6 rounded-[2rem] border-l-4 border-accent">
              <Calendar className="text-accent w-10 h-10" />
              <div>
                <span className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Date Officielle</span>
                <span className="font-heading font-bold text-2xl text-white">5 - 7 JUIN 2026</span>
                <span className="block text-[8px] text-accent font-black uppercase mt-1">Clôture : 18 Mai</span>
              </div>
            </div>
            <div className="flex items-center gap-5 glass-pro p-6 rounded-[2rem] border-l-4 border-lush">
              <MapPin className="text-lush w-10 h-10" />
              <div>
                <span className="block text-[10px] text-white/50 font-black uppercase tracking-widest mb-1">Destination</span>
                <span className="font-heading font-bold text-2xl text-white">SASSANDRA, CI</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating badge */}
        <div className="absolute bottom-20 right-20 z-10 hidden lg:block">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="w-40 h-40 border border-white/10 rounded-full flex items-center justify-center relative overflow-hidden glass-pro"
           >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent" />
              <div className="text-white text-xs font-black tracking-widest uppercase text-center leading-none">
                Sassandra<br/>Solaire
              </div>
           </motion.div>
        </div>
      </section>

      {/* L'EXPERIENCE TROPICALE */}
      <section id="experience" className="py-40 bg-[var(--background)] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1.5 w-16 bg-accent rounded-full"></div>
                <span className="text-accent font-black tracking-[0.4em] text-[10px] uppercase">L'Ambiance Ivoire</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-heading font-black text-foreground mb-10 leading-none tracking-tighter">
                L'Art de Vivre au <br/><span className="text-secondary italic font-light">Bord de l'Eau</span>
              </h2>
              <p className="text-xl text-foreground/70 font-medium leading-relaxed mb-6 font-body">
                Laissez le tumulte de la ville derrière vous. Un séjour immersif de 3 jours combinant plages sauvages, découverte de la mangrove, visites culturelles et ambiance festive.
              </p>
              <p className="text-sm font-black text-accent uppercase tracking-widest border-l-4 border-accent pl-4 mb-10">
                Explorez Dagbego, Niega et Kadrôpka • Les perles de Sassandra.
              </p>
              <div className="flex items-center gap-6 p-6 glass-pro rounded-[2rem] border-l-4 border-accent text-accent">
                 <Play className="fill-accent w-6 h-6" />
                 <span className="font-black uppercase tracking-widest text-xs">Découvrir le teaser immersif</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl"
            >
               <Image src="/images/galerie2.jpg" alt="Vibe Sassandra" fill className="object-cover" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Waves, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Le Grand Large', desc: "Les plages les plus secrètes de Côte d'Ivoire pour vos bains de minuit et vos siestes au soleil." },
              { icon: Flame, color: 'text-accent', bg: 'bg-orange-50', title: 'Veillées Wôyô', desc: 'Retrouvez la magie des grillades au clair de lune et des chants qui unissent les cœurs.' },
              { icon: Map, color: 'text-lush', bg: 'bg-green-50', title: 'Circuit Sauvage', desc: "Glissez en pirogue dans la mangrove, visitez l'Île des Singes et les vestiges de la Maison du Gouverneur." },
              { icon: Users, color: 'text-accent', bg: 'bg-orange-50', title: 'Famille Akwaba', desc: "Ici, on arrive en voyageur, on repart en frère. On est ensemble." }
            ].map((atout, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card hover:bg-white"
              >
                <div className={`w-16 h-16 ${atout.bg} rounded-3xl flex items-center justify-center mb-10 shadow-lg animate-float`}>
                  <atout.icon className={`h-8 w-8 ${atout.color}`} />
                </div>
                <h3 className="text-3xl font-heading font-black text-foreground mb-4 tracking-tight">{atout.title}</h3>
                <p className="text-foreground/60 font-medium font-body leading-relaxed">{atout.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE CINÉMATIQUE */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-accent font-black uppercase tracking-[0.3em] text-xs mb-4 block">L'Immersion</span>
              <h2 className="text-5xl md:text-7xl font-heading font-black text-foreground tracking-tighter leading-none uppercase">
                L'Âme de <br/><span className="text-lush italic font-light">la Côte</span>
              </h2>
            </div>
            <p className="max-w-xs text-foreground/50 font-medium italic border-l-4 border-accent pl-6 font-body">
              "Sassandra n'est pas un lieu, c'est une émotion brute entre la forêt et l'écume."
            </p>
          </div>

          {/* Deux grandes cartes cinématiques */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <Image src="/images/mangrove.png" alt="L'Appel de la Mangrove" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-3xl font-heading font-black text-white italic tracking-tighter uppercase mb-2">L'Appel de la Mangrove</h3>
                <p className="text-orange-200 font-bold font-body">Un labyrinthe de vie entre racines et turquoise.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl md:translate-y-20"
            >
              <Image src="/images/campfire_v3.png" alt="Le Feu des Ancêtres" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className="text-3xl font-heading font-black text-white italic tracking-tighter uppercase mb-2">Le Feu des Ancêtres</h3>
                <p className="text-orange-200 font-bold font-body">3 nuits de flammes, de chants et de fraternité.</p>
              </div>
            </motion.div>
          </div>

          {/* Grille Instants Authentiques */}
          <div className="mt-40">
            <div className="mb-12">
              <h3 className="text-3xl font-heading font-black text-foreground tracking-tighter uppercase italic">
                Instants <span className="text-accent underline decoration-4 underline-offset-8">Authentiques</span>
              </h3>
              <p className="text-foreground/50 font-bold font-body mt-2">La réalité de Sassandra, capturée par nos voyageurs.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { src: "/images/galerie_cliffs.jpg", alt: "Sassandra Falaises Vertes" },
                { src: "/images/galerie2.jpg", alt: "Sassandra Vue 2" },
                { src: "/images/galerie_rocks.jpg", alt: "Sassandra Bassins Rocheux" },
                { src: "/images/galerie4.jpg", alt: "Sassandra Vue 4" }
              ].map((img, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="aspect-square relative rounded-[2rem] overflow-hidden group shadow-xl hover:scale-105 transition-all duration-500"
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover transition duration-700 scale-110" />
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE INTERACTIVE TROPICALE */}
      <section className="py-40 bg-foreground relative text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] invert" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-6 block">Visual Stories</span>
              <h2 className="text-7xl md:text-9xl font-heading font-black tracking-tighter leading-[0.85] uppercase">
                L'Esprit <br/><span className="text-accent italic">Sauvage</span>
              </h2>
            </div>
          </div>
          <TropicalGallery />
        </div>
      </section>

      {/* PROGRAMME : LES TEMPS FORTS */}
      <section id="programme" className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-accent to-yellow-400" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-heading font-black mb-8 tracking-tighter leading-none italic uppercase">
              Le Programme <br/><span className="text-accent">Solaire</span>
            </h2>
            <p className="text-gray-400 font-bold font-body max-w-xl">3 jours rythmés par l'aventure, la culture et la fête. Préparez-vous pour l'immersion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Nature & Baignade */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              className="space-y-6 p-8 bg-white/5 rounded-[3rem] border border-white/10 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-4 text-accent animate-float">
                <Waves className="h-8 w-8" />
                <h3 className="text-2xl font-heading font-black uppercase tracking-tighter">Baignade & Nature</h3>
              </div>
              <ul className="space-y-3 text-gray-400 font-bold text-sm font-body">
                <li>• Détente sur la Plage du Camp</li>
                <li>• Expédition sur Dagbego & Niega</li>
                <li>• Escale sauvage à Kadrôpka</li>
                <li>• Balade en pirogue (Mangrove)</li>
              </ul>
            </motion.div>

            {/* Patrimoine & Culture */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 p-8 bg-white/5 rounded-[3rem] border border-white/10 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-4 text-green-500 animate-float-delayed">
                <Map className="h-8 w-8" />
                <h3 className="text-2xl font-heading font-black uppercase tracking-tighter">Patrimoine</h3>
              </div>
              <ul className="space-y-3 text-gray-400 font-bold text-sm font-body">
                <li>• Visite de l'Île des Singes</li>
                <li>• Prison des Esclaves (Histoire)</li>
                <li>• Maison du Gouverneur</li>
                <li>• Trésors de la Mangrove</li>
              </ul>
            </motion.div>

            {/* Sport & Compétition */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 p-8 bg-white/5 rounded-[3rem] border border-white/10 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-4 text-yellow-500 animate-float">
                <Award className="h-8 w-8" />
                <h3 className="text-2xl font-heading font-black uppercase tracking-tighter">Activités</h3>
              </div>
              <ul className="space-y-3 text-gray-400 font-bold text-sm font-body">
                <li>• Tournoi Handball Plage & Fléchettes</li>
                <li>• Wôyô (Jeux traditionnels)</li>
                <li>• Concours de Chant Akwaba</li>
                <li>• Élection du meilleur Maillot</li>
              </ul>
            </motion.div>
          </div>

          {/* Bannière Soirées 🔥 */}
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            className="mt-12 bg-accent p-10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-8 group"
          >
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-4xl animate-bounce">🔥</div>
              <div>
                <h4 className="text-3xl font-heading font-black text-white italic tracking-tighter uppercase">Soirées Authentiques</h4>
                <p className="text-orange-100 font-bold font-body">3 Nuits de Feu de Camp • Barbecue Géant • Musique & Danse</p>
              </div>
            </div>
            <Link href="#tarifs" className="px-10 py-5 bg-white text-accent rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
              Je veux en être !
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TARIFS & RÉSERVATION */}
      <section id="tarifs" className="py-12 md:py-28 bg-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl -ml-48 -mb-48" />

        {/* Conteneur unique centré pour le titre ET les cartes */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">

          {/* En-tête : centré sur mobile, aligné à gauche sur desktop */}
          <div className="text-center md:text-left mb-10 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tighter italic leading-none">
              Prévoyez votre <br/><span className="text-orange-200">Escale Solaire</span>
            </h2>
            <div className="flex items-start gap-4 bg-orange-50 p-4 sm:p-5 rounded-[1.5rem] border-2 border-orange-100 max-w-lg mx-auto md:mx-0 mb-5 text-left">
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white rounded-xl shadow-inner flex items-center justify-center flex-shrink-0">🎁</div>
              <p className="text-sm font-bold text-gray-600 leading-tight">
                <span className="text-accent font-black uppercase tracking-tighter">Votre Sésame Inclut :</span><br/>
                Transport AR, 3 nuits immersives, Pensions complètes & Sélection de rafraîchissements.
              </p>
            </div>
            <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest pl-4 border-l-2 border-orange-300 text-left max-w-lg mx-auto md:mx-0">
              ✨ Un Bar Privé & une carte de Mixologie disponibles au campement.
            </p>
          </div>

          {/* Grille des cartes — même conteneur, même largeur max */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Solo Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl relative border-b-8 border-gray-200"
            >
              <div className="absolute top-0 right-8 md:right-12 transform -translate-y-1/2 bg-lush text-white font-black px-5 py-2 rounded-full text-xs md:text-sm uppercase tracking-widest">
                Populaire
              </div>

              {/* Image sésame */}
              <div className="absolute top-8 right-4 md:top-12 md:right-6 w-24 h-24 md:w-32 md:h-32 pointer-events-none transform rotate-12 opacity-90">
                <img src="/images/sesame_solo.png" alt="Solo Pass" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>

              <h4 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-2">Pass Solo</h4>
              <p className="text-accent font-bold mb-6 uppercase tracking-widest text-xs md:text-sm">Pour 1 Aventurier</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-6xl md:text-7xl font-heading font-black text-foreground tracking-tighter">50K</span>
                <span className="text-gray-400 font-bold text-lg uppercase">FCFA</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-foreground/70 font-medium font-body text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-lush flex-shrink-0" /> Transport AR climatisé</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-lush flex-shrink-0" /> Tente partagée (lits séparés)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-lush flex-shrink-0" /> Repas complets & Boissons</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-lush flex-shrink-0" /> Accès à toutes les sorties</li>
              </ul>

              {user ? (
                <BookingButton 
                  typeTicket="solo" 
                  label="RÉSERVER SOLO" 
                  className="w-full font-black py-5 rounded-3xl transition bg-accent text-white hover:bg-orange-700 shadow-xl shadow-orange-200 uppercase tracking-widest border-b-4 border-orange-800 text-sm"
                />
              ) : (
                <Link href="/login" className="w-full block text-center font-black py-5 rounded-3xl transition bg-gray-900 text-white hover:bg-black shadow-xl uppercase tracking-widest text-sm">
                  SE CONNECTER
                </Link>
              )}
            </motion.div>

            {/* Couple Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-yellow-400 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl relative border-b-8 border-yellow-600"
            >
              <div className="absolute top-0 right-8 md:right-12 transform -translate-y-1/2 bg-accent text-white font-black px-5 py-2 rounded-full text-xs md:text-sm uppercase tracking-widest">
                -20.000F Offerts
              </div>

              {/* Image sésame duo */}
              <div className="absolute top-8 right-4 md:top-12 md:right-6 w-24 h-24 md:w-32 md:h-32 pointer-events-none transform -rotate-12 opacity-90">
                <img src="/images/sesame_duo.png" alt="Couple Pass" className="w-full h-full object-contain drop-shadow-2xl" />
              </div>

              <h3 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-2 tracking-tighter italic">Pass Couple</h3>
              <p className="text-lush font-black uppercase tracking-[0.2em] text-[10px] mb-6">Pour 2 Amoureux de l&apos;Océan</p>
              
              <div className="text-5xl md:text-6xl font-heading font-black text-foreground tracking-tighter mb-8 flex items-start gap-1">
                80K <span className="text-sm text-gray-500 mt-2 font-body">FCFA</span>
              </div>

              <ul className="space-y-3 mb-8 font-body text-sm">
                <li className="flex items-center gap-3 font-bold text-foreground/70"><div className="h-2 w-2 bg-accent rounded-full flex-shrink-0"></div> Tout en duo (Logistique incluse)</li>
                <li className="flex items-center gap-3 font-bold text-foreground/70"><div className="h-2 w-2 bg-accent rounded-full flex-shrink-0"></div> Tente privée &quot;Nid d&apos;amour&quot;</li>
                <li className="flex items-center gap-3 font-bold text-foreground/70"><div className="h-2 w-2 bg-accent rounded-full flex-shrink-0"></div> Tous les repas & Boissons</li>
                <li className="flex items-center gap-3 font-bold text-foreground/70"><div className="h-2 w-2 bg-accent rounded-full flex-shrink-0"></div> Cadeau souvenir offert</li>
              </ul>

              {user ? (
                <BookingButton 
                  typeTicket="couple" 
                  label="DEVENIR DUO SOLAIRE" 
                  className="w-full font-black py-5 rounded-[2rem] transition bg-lush text-white hover:bg-green-600 shadow-2xl uppercase tracking-widest text-sm border-b-4 border-green-900"
                />
              ) : (
                <Link href="/login" className="w-full flex justify-center py-5 bg-lush text-white rounded-[2rem] font-black hover:bg-green-600 transition shadow-2xl uppercase tracking-widest text-sm border-b-4 border-green-900">
                  DEVENIR DUO SOLAIRE
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground mb-4 tracking-tighter uppercase italic">
              Questions <span className="text-accent">Fréquentes</span>
            </h2>
            <p className="text-foreground/50 font-bold font-body">Tout ce qu'il faut savoir avant de prendre la route.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "🎒 Quel équipement prévoir ?", r: "Prévoyez un sac à dos léger, de la crème solaire et vos maillots. Bien que nos tentes soient protectrices pour la nuit, nous recommandons d'apporter une petite lotion ou pommade anti-moustique pour la peau. C'est le secret pour être 100% serein pendant nos activités nocturnes et nos veillées au feu de camp." },
              { q: "🛡️ Est-ce que le séjour est sécurisé ?", r: "La sécurité est notre priorité. Le camp est surveillé et nos guides locaux connaissent parfaitement la région. Vous êtes entre de bonnes mains 24h/24." },
              { q: "📱 Comment se passe le paiement ?", r: "Une fois votre réservation enregistrée, cliquez sur le bouton de validation. Cela enverra un message automatique à notre Guide-Hôte sur WhatsApp. Il échangera ensuite avec vous pour coordonner votre règlement et répondre à toutes vos questions." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-orange-50 rounded-[2.5rem] border-b-4 border-orange-100 hover:-translate-y-1 transition-all duration-300 group"
              >
                <h4 className="text-lg font-heading font-black text-foreground mb-3 uppercase tracking-tight">{item.q}</h4>
                <p className="text-foreground/60 font-body font-medium leading-relaxed">{item.r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSEIL DES VOYAGEURS */}
      <VisionForm />

      {/* L'ÉQUIPE ORGANISATRICE */}
      <section className="py-24 bg-green-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl relative border-b-8 border-green-200 flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex -space-x-4">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/40 backdrop-blur-md rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden animate-float relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/50 to-transparent" />
                <img src="/images/virgile_fit.png" alt="Virgile" className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10" />
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/40 backdrop-blur-md rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden translate-y-4 animate-float-delayed relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-200/50 to-transparent" />
                <img src="/images/khalef_locks.png" alt="Khalef" className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10" />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-6 tracking-tighter uppercase italic">
                Vos Hôtes de <span className="text-lush">l'Aventure</span>
              </h3>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="bg-accent text-white font-black px-8 py-3 rounded-full text-sm uppercase tracking-widest shadow-lg shadow-orange-100 italic">Virgile Avit</span>
                <span className="bg-gray-900 text-white font-black px-8 py-3 rounded-full text-sm uppercase tracking-widest shadow-lg shadow-gray-200 italic">Khalef Bley</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-20 px-4 border-t-8 border-lush">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
            <p className="text-foreground/40 font-bold font-body text-sm leading-relaxed text-center md:text-left max-w-xs">
              © 2026 Sassandra Beach Camp. <br/>
              Une aventure signée Virgile & Khalef.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-center md:text-right">
            <div>
              <h5 className="font-black text-accent uppercase mb-4 tracking-widest text-xs">Navigation</h5>
              <ul className="space-y-2 font-bold text-foreground/50 text-sm font-body">
                <li><a href="#experience" className="hover:text-accent transition">L'Esprit</a></li>
                <li><a href="#programme" className="hover:text-accent transition">Programme</a></li>
                <li><a href="#faq" className="hover:text-accent transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-lush uppercase mb-4 tracking-widest text-xs">Légal</h5>
              <ul className="space-y-2 font-bold text-foreground/50 text-sm font-body">
                <li className="hover:text-lush cursor-pointer transition">Conditions</li>
                <li className="hover:text-lush cursor-pointer transition">Confidentialité</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em]">Paiement sécurisé via WhatsApp • +225 0704538796</p>
        </div>
      </footer>
    </div>
  )
}
