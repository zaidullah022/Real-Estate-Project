import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, UserProfile } from '../types';
import { PropertyCard } from './PropertyCard';
import { Building2, SearchX, PlusCircle, Sparkles } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  currentUser: UserProfile | null;
  savedPropertyIds?: string[];
  isLoading: boolean;
  onToggleSave?: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onStartVirtualTour?: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onResetFilters: () => void;
  onOpenAddProperty: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  currentUser,
  savedPropertyIds = [],
  isLoading,
  onToggleSave,
  onSelectProperty,
  onBookViewing,
  onStartVirtualTour,
  onEditProperty,
  onDeleteProperty,
  onResetFilters,
  onOpenAddProperty,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="relative overflow-hidden bg-[#14161f]/80 backdrop-blur-xl rounded-[32px] h-[480px] border border-white/10 flex flex-col justify-between p-6"
          >
            <div className="h-64 w-full bg-[#1c1f28]/70 rounded-2xl animate-pulse" />
            <div className="space-y-3 pt-4">
              <div className="h-5 w-3/4 bg-white/10 rounded-full animate-pulse" />
              <div className="h-3.5 w-1/2 bg-white/5 rounded-full animate-pulse" />
              <div className="grid grid-cols-3 gap-2 pt-3">
                <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#12141b]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 sm:p-14 text-center max-w-lg mx-auto space-y-5 shadow-2xl shadow-black/80"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#1a1d26] border border-[#c8a97e]/30 flex items-center justify-center mx-auto text-[#dfc5a4] shadow-md">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white">No properties matched your criteria</h3>
        <p className="text-sm text-stone-400 font-light leading-relaxed">
          Try widening your price range, choosing a different category, or adding a new property listing to the marketplace.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onResetFilters}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold bg-[#1a1d26] hover:bg-[#242733] text-stone-200 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
          >
            Clear All Filters
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, brightness: 1.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAddProperty}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] font-bold shadow-lg shadow-[#c8a97e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#0c0d10]" />
            <span>List First in Category</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-stone-400 font-light">
          Showing <span className="text-[#dfc5a4] font-semibold">{properties.length}</span> curated luxury {properties.length === 1 ? 'property' : 'properties'}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        {properties.map((property) => (
          <motion.div key={property.id} variants={itemVariants}>
            <PropertyCard
              property={property}
              currentUser={currentUser}
              savedPropertyIds={savedPropertyIds}
              onToggleSave={onToggleSave}
              onSelect={onSelectProperty}
              onBookViewing={onBookViewing}
              onStartVirtualTour={onStartVirtualTour}
              onEdit={onEditProperty}
              onDelete={onDeleteProperty}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
