import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Calendar, 
  Eye, 
  Heart, 
  Building2, 
  Trees, 
  Home, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  Footprints
} from 'lucide-react';
import { Property, UserProfile } from '../types';

interface FeaturedPropertiesProps {
  properties: Property[];
  currentUser: UserProfile | null;
  savedPropertyIds: string[];
  onToggleSave: (propertyId: string) => void;
  onSelectProperty: (propertyId: Property) => void;
  onBookViewing: (propertyId: Property) => void;
  onStartVirtualTour?: (property: Property) => void;
  onViewAllProperties: () => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  currentUser,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onBookViewing,
  onStartVirtualTour,
  onViewAllProperties,
}) => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'House' | 'Apartment' | 'Plot'>('All');

  // Filter only featured or high-value curated properties
  const featuredList = properties.filter(p => {
    const isFeatured = p.featured === true || p.price >= 2000000;
    if (filterCategory === 'All') return isFeatured;
    return isFeatured && p.category === filterCategory;
  });

  const displayList = featuredList.length > 0 ? featuredList : properties.slice(0, 3);

  return (
    <section id="featured" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Decorative Warm Champagne Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-[#c8a97e]/6 blur-[140px] pointer-events-none rounded-full" />

      {/* Header Container with Expanded Whitespace */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171920] border border-[#c8a97e]/30 text-[#dfc5a4] text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-md">
            <Award className="w-3.5 h-3.5 text-[#c8a97e]" />
            <span>Curated Portfolio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Featured Residences & Plots
          </h2>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
            Hand-selected architectural masterpieces and prime land parcels meeting our highest standard of design, privacy, and long-term asset value.
          </p>
        </div>

        {/* Category Filters for Featured Section */}
        <div className="flex flex-wrap items-center gap-2 bg-[#12141a]/90 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shrink-0 shadow-lg">
          {(['All', 'House', 'Apartment', 'Plot'] as const).map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer relative ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-md shadow-[#c8a97e]/20 font-bold'
                  : 'text-stone-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {cat === 'All' ? 'All Featured' : `${cat}s`}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Properties Grid */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {displayList.map((property) => {
            const isSaved = savedPropertyIds.includes(property.id);

            return (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-[#13151c]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden hover:border-[#c8a97e]/45 transition-colors duration-300 flex flex-col justify-between shadow-2xl hover:shadow-black/80"
              >
                {/* Image Frame */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#0c0d10]">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  
                  {/* Gradient Shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-black/25 to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#0c0d10]/85 backdrop-blur-md text-[#dfc5a4] border border-[#c8a97e]/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {property.featuredTag || property.category}
                      </span>
                      <span className="bg-[#1c1f28]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-md">
                        <Sparkles className="w-3 h-3 text-[#dfc5a4]" />
                        Curated
                      </span>
                    </div>

                    {/* Favorite Heart Button */}
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.86 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(property.id);
                      }}
                      aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                      className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 scale-110 shadow-lg shadow-rose-500/30'
                          : 'bg-[#0c0d10]/70 border-white/20 text-stone-300 hover:text-white hover:bg-[#0c0d10]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                    </motion.button>
                  </div>

                  {/* Price Tag & 3D Tour Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                        Listing Price
                      </span>
                      <p className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                        ${property.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {onStartVirtualTour && (
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartVirtualTour(property);
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#0c0d10]/90 hover:bg-[#0c0d10] text-[#dfc5a4] hover:text-white border border-[#c8a97e]/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
                          title="Explore property in 3D walkthrough"
                        >
                          <Footprints className="w-3.5 h-3.5 text-[#dfc5a4]" />
                          <span>3D Tour</span>
                        </motion.button>
                      )}
                      <span className="text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold backdrop-blur-md">
                        {property.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  
                  {/* Title & Address */}
                  <div className="space-y-2">
                    <h3 
                      onClick={() => onSelectProperty(property)}
                      className="font-serif text-xl font-bold text-white group-hover:text-[#dfc5a4] transition-colors cursor-pointer line-clamp-1"
                    >
                      {property.title}
                    </h3>
                    <p className="text-xs text-stone-400 flex items-center gap-1.5 line-clamp-1 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
                      <span>{property.address || property.location}</span>
                    </p>
                  </div>

                  {/* Description or Reason */}
                  {property.featuredReason && (
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed bg-white/[0.03] p-3 rounded-2xl border border-white/5 font-light">
                      {property.featuredReason}
                    </p>
                  )}

                  {/* Key Spec Row */}
                  <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-white/[0.08] text-xs text-stone-300">
                    {property.category === 'Plot' ? (
                      <>
                        <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                          <Trees className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                          <span className="font-semibold text-white truncate max-w-full">
                            {property.plotDimensions || 'Highland'}
                          </span>
                          <span className="text-[10px] text-stone-400">Dimensions</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center col-span-2">
                          <Maximize className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                          <span className="font-semibold text-white">
                            {property.areaSqFt.toLocaleString()} sq ft
                          </span>
                          <span className="text-[10px] text-stone-400">Parcel Size</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                          <BedDouble className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                          <span className="font-semibold text-white">{property.bedrooms} Beds</span>
                          <span className="text-[10px] text-stone-400">Suites</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                          <Bath className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                          <span className="font-semibold text-white">{property.bathrooms} Baths</span>
                          <span className="text-[10px] text-stone-400">Bathrooms</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                          <Maximize className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                          <span className="font-semibold text-white">{property.areaSqFt.toLocaleString()}</span>
                          <span className="text-[10px] text-stone-400">Sq Ft</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onSelectProperty(property)}
                      className="py-3 px-4 rounded-full text-xs font-semibold text-stone-200 bg-[#191c24] hover:bg-[#222530] border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-1.5 backdrop-blur-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, brightness: 1.1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onBookViewing(property)}
                      className="py-3 px-4 rounded-full text-xs font-semibold text-white bg-[#0c0d10] hover:bg-[#1a1d26] border border-[#c8a97e]/40 hover:border-[#dfc5a4] shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#dfc5a4]" />
                      <span>Book Visit</span>
                    </motion.button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* View All Properties Trigger */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 mt-16 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.04, brightness: 1.08 }}
          whileTap={{ scale: 0.97 }}
          onClick={onViewAllProperties}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] via-[#c8a97e] to-[#b8956e] transition-all shadow-xl shadow-[#c8a97e]/15 group cursor-pointer"
        >
          <span>Explore All Properties & Plots</span>
          <ArrowRight className="w-4 h-4 text-[#0c0d10] transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>

    </section>
  );
};
