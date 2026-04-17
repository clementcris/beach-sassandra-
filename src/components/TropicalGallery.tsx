'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const images = [
  {
    src: "/images/mangrove.png",
    alt: "Mangrove Mystique",
    title: "L'Appel de la Mangrove",
    description: "Un labyrinthe de vie entre racines et turquoise.",
    category: "Nature"
  },
  {
    src: "/images/campfire_v3.png",
    alt: "Feu de Camp",
    title: "Le Feu des Ancêtres",
    description: "3 nuits de flammes, de chants et de fraternité.",
    category: "Vibe"
  },
  {
    src: "/images/galerie_cliffs.jpg",
    alt: "Falaises",
    title: "Les Falaises Vertes",
    description: "Où la forêt embrasse l'océan Atlantique.",
    category: "Plage"
  },
  {
    src: "/images/galerie_rocks.jpg",
    alt: "Rochers",
    title: "Bassins Rocheux",
    description: "Eaux cristallines et piscines naturelles.",
    category: "Plage"
  }
]

export const TropicalGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Content */}
          <div className="absolute inset-0 p-12 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-10px]">
            <motion.span 
              className="inline-block px-4 py-1 rounded-full bg-accent/20 backdrop-blur-md text-white border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4 w-fit"
            >
              {image.category}
            </motion.span>
            <h3 className="text-4xl font-heading font-bold text-white mb-4 leading-none tracking-tight">
              {image.title}
            </h3>
            <p className="text-white/70 font-medium text-lg max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {image.description}
            </p>
          </div>
          
          {/* Glass Accent */}
          <div className="absolute top-8 right-8 w-12 h-12 glass-pro rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
             <div className="text-white text-xl">✨</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
