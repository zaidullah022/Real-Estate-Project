import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Calendar, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Trees, 
  CheckCircle2, 
  Building, 
  Heart,
  Footprints
} from 'lucide-react';
import { Property, UserProfile } from '../types';

interface PropertyCardProps {
  property: Property;
  currentUser: UserProfile | null;
  savedPropertyIds?: string[];
  onToggleSave?: (propertyId: string) => void;
  onSelect: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onStartVirtualTour?: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currentUser,
  savedPropertyIds = [],
  onToggleSave,
  onSelect,
  onBookViewing,
  onStartVirtualTour,
  onEdit,
  onDelete,
}) => {
  const isOwner = currentUser && (currentUser.uid === property.sellerId || currentUser.email === property.sellerEmail);
  const isSaved = savedPropertyIds.includes(property.id);

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-[#13151c]/90 backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/10 hover:border-[#c8a97e]/45 transition-colors duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-black/80"
    >
      
      {/* Top Image Showcase */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0c0d10]">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-black/20 to-black/40" />

        {/* Badges on Top */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#0c0d10]/85 backdrop-blur-md text-[#dfc5a4] border border-[#c8a97e]/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {property.category}
            </span>
            {property.featured && (
              <span className="bg-[#1c1f28]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20 shadow-md">
                <Sparkles className="w-3 h-3 text-[#dfc5a4]" />
                Curated
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/15 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {property.status}
            </span>

            {/* Favorite Save Button */}
            {onToggleSave && (
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.86 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(property.id);
                }}
                aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/20'
                    : 'bg-[#0c0d10]/70 border-white/20 text-stone-300 hover:text-white hover:bg-[#0c0d10]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 transition-transform ${isSaved ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Owner Controls Overlay if listing belongs to current user */}
        {isOwner && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-[#0c0d10]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(property);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#c8a97e] hover:text-[#0c0d10] text-white transition-colors cursor-pointer"
              title="Edit your listing"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${property.title}"?`)) {
                  onDelete(property.id);
                }
              }}
              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors cursor-pointer"
              title="Delete this listing"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}

        {/* Price Tag & 3D Tour Shortcut in Bottom of image */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
          <p className="text-2xl font-serif font-bold text-white tracking-tight drop-shadow-md">
            ${property.price.toLocaleString()}
          </p>

          {onStartVirtualTour && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                onStartVirtualTour(property);
              }}
              className="px-3 py-1.5 rounded-full bg-[#0c0d10]/90 hover:bg-[#0c0d10] text-[#dfc5a4] hover:text-white border border-[#c8a97e]/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer"
              title="Launch interactive 3D virtual tour"
            >
              <Footprints className="w-3.5 h-3.5 text-[#dfc5a4]" />
              <span>3D Tour</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Property Details Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Location */}
        <div className="space-y-1.5">
          <h3 
            onClick={() => onSelect(property)}
            className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#dfc5a4] transition-colors cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 line-clamp-1 font-light">
            <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
            <span>{property.address || property.location}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.08] text-xs text-stone-300">
          {property.category === 'Plot' ? (
            <>
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                <Trees className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                <span className="font-semibold text-white truncate max-w-full">
                  {property.plotDimensions || 'Zoned Land'}
                </span>
                <span className="text-[10px] text-stone-400">Dimension</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center col-span-2">
                <Maximize className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                <span className="font-semibold text-white">
                  {property.areaSqFt.toLocaleString()} sq ft
                </span>
                <span className="text-[10px] text-stone-400">Total Land Area</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                <BedDouble className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                <span className="font-semibold text-white">{property.bedrooms} Beds</span>
                <span className="text-[10px] text-stone-400">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                <Bath className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                <span className="font-semibold text-white">{property.bathrooms} Baths</span>
                <span className="text-[10px] text-stone-400">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[#0c0d10]/40 border border-white/5 text-center">
                <Maximize className="w-3.5 h-3.5 text-[#c8a97e] mb-1" />
                <span className="font-semibold text-white">{property.areaSqFt.toLocaleString()}</span>
                <span className="text-[10px] text-stone-400">Sq Ft</span>
              </div>
            </>
          )}
        </div>

        {/* Amenities preview tags */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {property.amenities.slice(0, 2).map((amenity, i) => (
              <span 
                key={i} 
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-stone-300 border border-white/5 backdrop-blur-sm"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.02] text-stone-400 border border-white/5">
                +{property.amenities.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(property)}
            className="py-2.5 px-3 rounded-full text-xs font-semibold text-stone-200 bg-[#191c25] hover:bg-[#232733] border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 backdrop-blur-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, brightness: 1.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onBookViewing(property)}
            className="py-2.5 px-3 rounded-full text-xs font-semibold text-white bg-[#0c0d10] hover:bg-[#1a1d26] border border-[#c8a97e]/40 hover:border-[#dfc5a4] shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#dfc5a4]" />
            <span>Book Visit</span>
          </motion.button>
        </div>

      </div>

    </motion.div>
  );
};
