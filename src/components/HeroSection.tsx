import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, MapPin, Sparkles, Star, ChevronRight, Eye, ShieldCheck, Home as HomeIcon, Footprints } from 'lucide-react';
import { Property } from '../types';

interface HeroSectionProps {
  featuredProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onStartVirtualTour?: (property: Property) => void;
  onBrowseAll: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProperties,
  onSelectProperty,
  onBookViewing,
  onStartVirtualTour,
  onBrowseAll,
}) => {
  const heroList: Property[] = featuredProperties.length > 0 ? featuredProperties : [
    {
      id: 'aurora-modern-residence',
      title: 'Aurora Modern Residence',
      address: 'Point Dume, Malibu, CA 90265',
      location: 'Point Dume, Malibu, CA',
      price: 3850000,
      category: 'House',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85'
      ]
    } as Property,
    {
      id: 'lumina-horizon-penthouse',
      title: 'Lumina Sky Penthouse',
      address: 'Marina Boulevard, San Francisco, CA 94123',
      location: 'Marina District, San Francisco, CA',
      price: 2450000,
      category: 'Apartment',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=85'
      ]
    } as Property,
    {
      id: 'solarium-ridge-plot',
      title: 'Solarium Vista Highland Plot',
      address: 'Sun Valley Road, Sun Valley, ID 83353',
      location: 'Sun Valley, ID',
      price: 1250000,
      category: 'Plot',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85'
      ]
    } as Property,
  ];

  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const activeProperty = heroList[selectedHeroIndex] || heroList[0];

  return (
    <section id="home" className="relative w-full max-w-7xl mx-auto px-3 min-[380px]:px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8">
      
      {/* Outer Floating Frame - Deep Charcoal Glass Architecture Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full min-h-[calc(100svh-6.5rem)] sm:min-h-[700px] lg:min-h-[660px] xl:min-h-[700px] rounded-[26px] sm:rounded-[44px] overflow-hidden border border-[#c8a97e]/30 shadow-2xl shadow-black/80 flex flex-col justify-between p-4 min-[380px]:p-5 sm:p-12 lg:p-10 xl:p-12 bg-[#0e1015] group"
      >
        
        {/* Full-bleed Architectural Image with Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProperty.id + (activeProperty.images[0] || '')}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${activeProperty.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85"}')`,
            }}
          >
            {/* Subtle Vignette & Warm Twilight Lighting Gradations */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-black/35 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Giant Translucent Watermark 'Homevia' in the sky background */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="absolute top-10 sm:top-16 lg:top-8 left-0 right-0 z-10 flex justify-center pointer-events-none select-none overflow-hidden"
        >
          <p aria-hidden="true" className="font-serif text-[18vw] sm:text-[16vw] lg:text-[13.5vw] leading-none font-bold text-white/[0.18] sm:text-white/[0.22] lg:text-white/[0.13] tracking-tight uppercase transition-all">
            Homevia
          </p>
        </motion.div>

        {/* Top Space Reservation for Integrated Navigation */}
        <div className="relative z-20 w-full h-16 sm:h-12" />

        {/* Bottom Stage: Split layout with Left Subtitle + Avatars, and Right Floating Residence Cards */}
        <div className="relative z-20 w-full mt-auto flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-5 sm:gap-10 pt-8 sm:pt-12">
          
          {/* Bottom Left: Paragraph & Social Proof */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="w-full lg:max-w-[720px] space-y-4 sm:space-y-6"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c8a97e]/40 bg-black/35 px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#f0d8b8] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" /> Curated places. Remarkable lives.
              </span>
              <h1 className="max-w-xl lg:max-w-[720px] font-serif text-[clamp(2.15rem,11vw,4.6rem)] lg:text-[3.35rem] xl:text-[3.75rem] font-bold leading-[0.98] tracking-[-0.045em] text-white drop-shadow-2xl">
                <span className="lg:whitespace-nowrap">Find a home that feels</span>{' '}
                <span className="text-[#e5c8a3] lg:block lg:mt-1">uniquely yours.</span>
              </h1>
            </div>
            <p className="max-w-md text-[13px] sm:text-base text-stone-200 font-light leading-relaxed drop-shadow-md">
              Discover signature homes and prestigious land parcels designed with enduring architectural elegance. Homevia connects you with spaces that elevate modern living.
            </p>

            <div className="flex flex-col min-[380px]:flex-row gap-2.5 sm:gap-3">
              <button onClick={onBrowseAll} className="min-h-11 rounded-full bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] px-5 text-xs font-bold text-[#0c0d10] shadow-lg shadow-black/30 transition hover:brightness-110">
                Explore properties
              </button>
              <button onClick={() => onBookViewing(activeProperty)} className="min-h-11 rounded-full border border-white/25 bg-black/35 px-5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/55">
                Book a private visit
              </button>
            </div>

            {/* Overlapping User Avatars + 1.2M+ Trusted Clients */}
            <div className="hidden sm:flex items-center gap-3.5 pt-1">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#c8a97e]/60 object-cover shadow-md"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Trusted client"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#c8a97e]/60 object-cover shadow-md"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Trusted client"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#c8a97e]/60 object-cover shadow-md"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                  alt="Trusted client"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide">
                  1.2M+
                </span>
                <span className="text-xs text-stone-300 font-medium -mt-0.5">
                  Trusted Clients Worldwide
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bottom Right: Stacked Thumbnails & Floating Glass Residence Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="w-full sm:w-[340px] lg:w-[360px] flex flex-col items-stretch sm:items-end gap-2.5 sm:gap-3.5 shrink-0"
          >
            
            {/* Top Miniature Thumbnails Gallery */}
            <div className="flex items-center justify-end gap-2">
              {heroList.slice(0, 3).map((item, idx) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedHeroIndex(idx)}
                  className={`relative flex-1 sm:flex-none h-12 min-w-0 sm:w-24 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-lg group/thumb cursor-pointer ${
                    selectedHeroIndex === idx
                      ? 'border-[#dfc5a4] scale-105 ring-2 ring-[#c8a97e]/40 shadow-xl'
                      : 'border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                  }`}
                  title={`Select ${item.title}`}
                >
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                  />
                  {selectedHeroIndex === idx && (
                    <div className="absolute inset-0 bg-[#c8a97e]/10" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Main Floating Clean Warm / Frosted Residence Card */}
            <motion.div
              layout
              className="w-full bg-[#14171f]/95 backdrop-blur-2xl rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 shadow-2xl shadow-black/80 border border-[#c8a97e]/30 text-white space-y-3 sm:space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="min-w-0 font-serif text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {activeProperty.title}
                  </h3>
                  <span className="text-xs font-serif font-bold text-[#dfc5a4]">
                    ${(activeProperty.price / 1000000).toFixed(2)}M
                  </span>
                </div>
                <p className="text-xs text-stone-400 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
                  <span className="truncate">{activeProperty.address || activeProperty.location}</span>
                </p>
              </div>

              {/* Action Buttons: 'Details' + '3D Tour' */}
              <div className="grid grid-cols-2 gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02, brightness: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectProperty(activeProperty)}
                  className="w-full py-3 px-3 rounded-full text-xs font-semibold text-white bg-[#0c0d10] hover:bg-[#1a1d26] border border-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 group/btn cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </motion.button>
                {onStartVirtualTour ? (
                  <motion.button
                    whileHover={{ scale: 1.02, brightness: 1.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStartVirtualTour(activeProperty)}
                    className="w-full py-3 px-3 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-[#c8a97e]/20 group/tour cursor-pointer"
                  >
                    <Footprints className="w-3.5 h-3.5 text-[#0c0d10]" />
                    <span>3D Tour</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02, brightness: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onBookViewing(activeProperty)}
                    className="w-full py-3 px-3 rounded-full text-xs font-semibold text-[#dfc5a4] bg-[#0c0d10] hover:bg-[#1a1d26] border border-[#c8a97e]/40 hover:border-[#dfc5a4] transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 group/btn cursor-pointer"
                  >
                    <span>Book Visit</span>
                  </motion.button>
                )}
              </div>
            </motion.div>

          </motion.div>

        </div>

      </motion.div>

      {/* Subtle Bottom Trust Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full mt-5 sm:mt-6 px-1 sm:px-3 flex flex-col min-[380px]:flex-row items-start min-[380px]:items-center justify-between gap-3 sm:gap-4 text-xs text-stone-400"
      >
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 text-stone-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#dfc5a4]" />
            Direct Curated Verification
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 text-stone-300 font-medium">
            <HomeIcon className="w-4 h-4 text-[#dfc5a4]" />
            Houses, Apartments & Plots
          </span>
        </div>
        <button
          onClick={onBrowseAll}
          className="text-xs text-stone-300 hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <span>View All Available Properties</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#dfc5a4]" />
        </button>
      </motion.div>

    </section>
  );
};
