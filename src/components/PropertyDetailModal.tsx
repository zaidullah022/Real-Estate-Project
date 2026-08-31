import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Calendar, 
  Check, 
  Share2, 
  Heart, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Compass, 
  Trees,
  Footprints,
  Play
} from 'lucide-react';
import { Property, UserProfile } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  currentUser: UserProfile | null;
  savedPropertyIds?: string[];
  onToggleSave?: (propertyId: string) => void;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  onStartVirtualTour?: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currentUser,
  savedPropertyIds = [],
  onToggleSave,
  onClose,
  onBookViewing,
  onStartVirtualTour,
  onEdit,
  onDelete,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanInterestRate, setLoanInterestRate] = useState(6.5);

  if (!property) return null;

  const isOwner = currentUser && (currentUser.uid === property.sellerId || currentUser.email === property.sellerEmail);
  const isSaved = savedPropertyIds.includes(property.id);

  // Mortgage Calculator Math
  const principal = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = loanInterestRate / 100 / 12;
  const numPayments = 30 * 12;
  const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalMonthlyEstimate = Math.round(monthlyPayment + (property.price * 0.012) / 12 + 250);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const images = property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#08090b]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#12141b]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-[32px] overflow-hidden shadow-2xl shadow-black/90 my-8 flex flex-col max-h-[92vh]">
        
        {/* Sticky Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0d10]/70 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-[#0c0d10] text-[#dfc5a4] border border-[#c8a97e]/40 uppercase tracking-wider shadow">
              {property.category}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {property.status}
            </span>
            {property.featured && (
              <span className="hidden sm:inline-flex text-xs text-[#dfc5a4] items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Exclusive
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(property.id)}
                className={`p-2 rounded-full border transition-all text-xs flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                  isSaved
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border-white/10'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save to Favorites'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors text-xs flex items-center gap-1 backdrop-blur-md cursor-pointer"
              title="Share listing link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit(property);
                  }}
                  className="p-2 rounded-full bg-[#c8a97e]/15 hover:bg-[#c8a97e] hover:text-[#0c0d10] text-[#dfc5a4] border border-[#c8a97e]/30 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Edit your property listing"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${property.title}"?`)) {
                      onClose();
                      onDelete(property.id);
                    }
                  }}
                  className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Delete this listing"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-10 space-y-9">
          
          {/* Gallery Showcase */}
          <div className="space-y-3.5">
            <div className="relative h-72 sm:h-96 lg:h-[450px] w-full rounded-[24px] overflow-hidden bg-black/50 border border-white/10 group">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Prominent "Explore Property in 3D / Virtual Tour" Hero Button */}
              {onStartVirtualTour && (
                <div className="absolute top-4 left-4 z-10">
                  <button
                    onClick={() => {
                      onClose();
                      onStartVirtualTour(property);
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#0c0d10]/85 hover:bg-[#0c0d10] text-[#dfc5a4] hover:text-white border-2 border-[#dfc5a4]/80 hover:border-[#dfc5a4] backdrop-blur-xl shadow-xl shadow-black/80 transition-all flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider group/tour cursor-pointer"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dfc5a4] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#dfc5a4]" />
                    </span>
                    <Footprints className="w-4 h-4 text-[#dfc5a4] group-hover/tour:translate-x-0.5 transition-transform" />
                    <span>Explore Property in 3D / Virtual Tour</span>
                  </button>
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-[#0c0d10]/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs text-white border border-white/20">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#dfc5a4] scale-105 ring-2 ring-[#c8a97e]/30'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Title, Price, and Address Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-7 border-b border-white/10">
            <div className="space-y-2.5">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-stone-400 font-light">
                <MapPin className="w-4 h-4 text-[#c8a97e] shrink-0" />
                <span>{property.address || property.location}</span>
              </div>
            </div>

            <div className="text-left md:text-right space-y-1">
              <div className="text-xs uppercase tracking-widest text-stone-400">Listing Price</div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#dfc5a4]">
                ${property.price.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400 font-light">
                Est. ~${totalMonthlyEstimate.toLocaleString()}/mo financing
              </div>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-5 bg-[#0c0d10]/50 backdrop-blur-md rounded-2xl border border-white/10 text-center">
            {property.category === 'Plot' ? (
              <>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Dimension / Lot</span>
                  <p className="font-bold text-white text-base">{property.plotDimensions || 'Zoned Land'}</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Total Land Area</span>
                  <p className="font-bold text-white text-base">{property.areaSqFt.toLocaleString()} sq ft</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Zoning Class</span>
                  <p className="font-bold text-white text-base">Residential / Estate</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Utilities</span>
                  <p className="font-bold text-white text-base">Connected / Stubs</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Bedrooms</span>
                  <p className="font-bold text-white text-base flex items-center justify-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-[#c8a97e]" />
                    {property.bedrooms} Beds
                  </p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Bathrooms</span>
                  <p className="font-bold text-white text-base flex items-center justify-center gap-1.5">
                    <Bath className="w-4 h-4 text-[#c8a97e]" />
                    {property.bathrooms} Baths
                  </p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Interior Size</span>
                  <p className="font-bold text-white text-base flex items-center justify-center gap-1.5">
                    <Maximize className="w-4 h-4 text-[#c8a97e]" />
                    {property.areaSqFt.toLocaleString()} sq ft
                  </p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-xs text-stone-400">Parking / Garage</span>
                  <p className="font-bold text-white text-base">
                    {property.parkingSpaces ? `${property.parkingSpaces} Bays` : 'Dedicated Space'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Description & Overview */}
          <div className="space-y-3.5">
            <h3 className="font-serif text-xl font-bold text-white">About the Property</h3>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Features */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3.5">
              <h3 className="font-serif text-xl font-bold text-white">Curated Amenities & Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#0c0d10]/40 backdrop-blur-md border border-white/5 text-xs sm:text-sm text-stone-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#c8a97e]/20 flex items-center justify-center text-[#dfc5a4] shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two-Column Section: Mortgage Calculator & Seller / Agent Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 pt-4 border-t border-white/10">
            
            {/* Mortgage Calculator Card */}
            <div className="p-6 bg-[#0c0d10]/50 backdrop-blur-xl rounded-2xl border border-white/10 space-y-5 shadow-lg">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Calculator className="w-4 h-4 text-[#dfc5a4]" />
                <span>Financing & Monthly Estimate</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-stone-400 mb-1.5">
                    <span>Down Payment ({downPaymentPercent}%)</span>
                    <span className="text-white font-semibold">
                      ${Math.round(property.price * (downPaymentPercent / 100)).toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-[#c8a97e] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1.5">
                    <span>Interest Rate</span>
                    <span className="text-white font-semibold">{loanInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="3.5"
                    max="10"
                    step="0.25"
                    value={loanInterestRate}
                    onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                    className="w-full accent-[#c8a97e] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-[#171920] rounded-xl border border-[#c8a97e]/20 flex items-center justify-between">
                  <span className="text-stone-400">Est. Principal & Interest:</span>
                  <span className="text-base font-serif font-bold text-[#dfc5a4]">
                    ${Math.round(monthlyPayment).toLocaleString()} / mo
                  </span>
                </div>
              </div>
            </div>

            {/* Seller / Agent Representation Card */}
            <div className="p-6 bg-[#0c0d10]/50 backdrop-blur-xl rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3.5">
                <div className="text-xs uppercase tracking-widest text-stone-400">Listing Representation</div>
                <div className="flex items-center gap-4">
                  <img
                    src={property.sellerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                    alt={property.sellerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#c8a97e]"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {property.sellerName}
                      <ShieldCheck className="w-4 h-4 text-[#dfc5a4]" />
                    </h4>
                    <p className="text-xs text-stone-400 font-light">Homevia Senior Real Estate Advisor</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#dfc5a4]" />
                    <span>{property.sellerEmail}</span>
                  </div>
                  {property.sellerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#dfc5a4]" />
                      <span>{property.sellerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 font-light">
                Direct private viewing access with licensed architecture and property specialists.
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Fixed Action Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0c0d10]/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div>
            <span className="text-xs text-stone-400">Ready to experience this property?</span>
            <p className="text-sm font-semibold text-white">Private in-person or live 4K video walkthrough available</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onStartVirtualTour && (
              <button
                onClick={() => {
                  onClose();
                  onStartVirtualTour(property);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-bold text-[#dfc5a4] bg-[#0c0d10] hover:bg-[#1a1d26] border border-[#c8a97e]/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <Footprints className="w-3.5 h-3.5 text-[#dfc5a4]" />
                <span>3D Virtual Tour</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onBookViewing(property);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c8a97e]/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#0c0d10]" />
              <span>Book Private Visit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
