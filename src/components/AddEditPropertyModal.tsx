import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Home, 
  Building, 
  Trees, 
  DollarSign, 
  MapPin, 
  Sparkles,
  BedDouble,
  Bath,
  Maximize,
  Check,
  Layers,
  Trash2,
  Eye,
  Camera
} from 'lucide-react';
import { Property, PropertyCategory, TourRoom, TourRoomCategory, UserProfile } from '../types';
import { PRESET_PROPERTY_IMAGES } from '../data/initialProperties';
import { ROOM_CATEGORY_OPTIONS, CATEGORY_FALLBACK_IMAGES } from '../utils/tourGenerator';
import { addPropertyListing, updatePropertyListing } from '../lib/firebase';
import { geocodeAddress, normalizeCoordinates } from '../utils/geocoding';

interface AddEditPropertyModalProps {
  propertyToEdit: Property | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface RoomImageItem {
  category: TourRoomCategory;
  name: string;
  image: string;
  description: string;
}

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  propertyToEdit,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const isEditing = !!propertyToEdit;

  const [activeTab, setActiveTab] = useState<'details' | 'rooms'>('details');
  const [title, setTitle] = useState(propertyToEdit?.title || '');
  const [category, setCategory] = useState<PropertyCategory>(propertyToEdit?.category || 'House');
  const [price, setPrice] = useState<number>(propertyToEdit?.price || 1850000);
  const [location, setLocation] = useState(propertyToEdit?.location || 'Greenfield, CA');
  const [address, setAddress] = useState(propertyToEdit?.address || '1234 Maple Avenue, Greenfield');
  const [bedrooms, setBedrooms] = useState<number>(propertyToEdit?.bedrooms || 4);
  const [bathrooms, setBathrooms] = useState<number>(propertyToEdit?.bathrooms || 3.5);
  const [areaSqFt, setAreaSqFt] = useState<number>(propertyToEdit?.areaSqFt || 4200);
  const [plotDimensions, setPlotDimensions] = useState(propertyToEdit?.plotDimensions || '2.5 Acres');
  const [description, setDescription] = useState(propertyToEdit?.description || '');

  // Room-organized images list for the 3D Virtual Tour
  const [roomImages, setRoomImages] = useState<RoomImageItem[]>(() => {
    if (propertyToEdit?.tourRooms && propertyToEdit.tourRooms.length > 0) {
      return propertyToEdit.tourRooms.map((r) => ({
        category: r.category,
        name: r.name,
        image: r.image,
        description: r.description || ''
      }));
    }
    if (propertyToEdit?.images && propertyToEdit.images.length > 0) {
      const defaultCategories: TourRoomCategory[] = ['Exterior', 'Entrance', 'Living Room', 'Kitchen', 'Master Bedroom', 'Bathroom', 'Balcony'];
      return propertyToEdit.images.map((img, i) => ({
        category: defaultCategories[i % defaultCategories.length] || 'Living Room',
        name: `${defaultCategories[i % defaultCategories.length] || 'Room'} View`,
        image: img,
        description: `High-resolution view of the ${defaultCategories[i % defaultCategories.length] || 'property'}.`
      }));
    }
    // Default initial template
    return [
      {
        category: 'Exterior',
        name: 'Exterior & Facade',
        image: PRESET_PROPERTY_IMAGES[0].url,
        description: 'Architectural front facade and approach.'
      },
      {
        category: 'Living Room',
        name: 'Main Living Room',
        image: CATEGORY_FALLBACK_IMAGES['Living Room'][0],
        description: 'Spacious open living area with floor-to-ceiling panoramic glass.'
      },
      {
        category: 'Kitchen',
        name: 'Gourmet Kitchen',
        image: CATEGORY_FALLBACK_IMAGES['Kitchen'][0],
        description: 'Custom marble island and integrated culinary appliances.'
      },
      {
        category: 'Master Bedroom',
        name: 'Master Suite',
        image: CATEGORY_FALLBACK_IMAGES['Master Bedroom'][0],
        description: 'Primary bedroom sanctuary with scenic natural light.'
      },
      {
        category: 'Bathroom',
        name: 'Ensuite Bathroom',
        image: CATEGORY_FALLBACK_IMAGES['Bathroom'][0],
        description: 'Freestanding soaking tub and marble walk-in shower.'
      }
    ];
  });

  const [amenities, setAmenities] = useState<string[]>(
    propertyToEdit?.amenities || ['Infinity Pool', 'Floor-to-Ceiling Windows', 'Smart Home', 'Private Garage']
  );
  const [newAmenityInput, setNewAmenityInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultAmenitySuggestions = [
    'Infinity Pool',
    'Floor-to-Ceiling Windows',
    'Smart Home Automation',
    'Private Garage',
    'Panoramic Views',
    'Wine Cellar',
    'Rooftop Terrace',
    'Private Garden',
    'Concierge Service',
    'EV Charging Station'
  ];

  const handleAddAmenity = (name: string) => {
    if (!name.trim()) return;
    if (!amenities.includes(name.trim())) {
      setAmenities([...amenities, name.trim()]);
    }
    setNewAmenityInput('');
  };

  const handleRemoveAmenity = (name: string) => {
    setAmenities(amenities.filter((a) => a !== name));
  };

  // Add a new room image item
  const handleAddRoom = () => {
    const nextCategory: TourRoomCategory = 'Bedroom';
    const opt = ROOM_CATEGORY_OPTIONS.find((o) => o.category === nextCategory);
    setRoomImages([
      ...roomImages,
      {
        category: nextCategory,
        name: opt ? opt.label : 'Additional Room',
        image: CATEGORY_FALLBACK_IMAGES[nextCategory][0] || PRESET_PROPERTY_IMAGES[0].url,
        description: opt ? opt.defaultDescription : 'Spacious interior room.'
      }
    ]);
  };

  const handleRemoveRoom = (index: number) => {
    if (roomImages.length <= 1) {
      alert('A property tour must have at least one image.');
      return;
    }
    setRoomImages(roomImages.filter((_, i) => i !== index));
  };

  const handleUpdateRoom = (index: number, updates: Partial<RoomImageItem>) => {
    setRoomImages((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, ...updates };
          if (updates.category && updates.category !== item.category) {
            const opt = ROOM_CATEGORY_OPTIONS.find((o) => o.category === updates.category);
            if (opt) {
              updated.name = opt.label;
              updated.description = opt.defaultDescription;
              if (CATEGORY_FALLBACK_IMAGES[updates.category]?.[0]) {
                updated.image = CATEGORY_FALLBACK_IMAGES[updates.category][0];
              }
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRoomFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleUpdateRoom(index, { image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      // Build tourRooms structured data
      const generatedTourRooms: TourRoom[] = roomImages.map((r, idx) => {
        const id = `${r.category.toLowerCase().replace(/\s+/g, '-')}-${idx}`;
        return {
          id,
          name: r.name || `${r.category}`,
          category: r.category,
          image: r.image,
          description: r.description,
          floorLevel: idx === 0 ? 'Exterior' : `Level ${idx > 3 ? 2 : 1}`,
          hotspots: [] // Dynamic generator or auto-interconnect
        };
      });

      // Interconnect hotspots automatically between rooms
      for (let i = 0; i < generatedTourRooms.length; i++) {
        const current = generatedTourRooms[i];
        const next = generatedTourRooms[(i + 1) % generatedTourRooms.length];
        const prev = generatedTourRooms[(i - 1 + generatedTourRooms.length) % generatedTourRooms.length];

        if (generatedTourRooms.length > 1) {
          current.hotspots = [
            {
              id: `h-${current.id}-${next.id}`,
              targetRoomId: next.id,
              label: `Go to ${next.name}`,
              roomName: next.name,
              position: { x: 72, y: 55 },
              description: next.description
            }
          ];

          if (generatedTourRooms.length > 2) {
            current.hotspots.push({
              id: `h-${current.id}-${prev.id}`,
              targetRoomId: prev.id,
              label: `Back to ${prev.name}`,
              roomName: prev.name,
              position: { x: 22, y: 58 },
              description: prev.description
            });
          }
        }
      }

      const allImages = roomImages.map((r) => r.image);

      // Convert the listing's real address to map coordinates. When an edit cannot
      // be resolved, retain its existing valid coordinates instead of losing its pin.
      const addressQuery = [address.trim(), location.trim()].filter(Boolean).join(', ');
      let coordinates = normalizeCoordinates(propertyToEdit || {});
      try {
        coordinates = (await geocodeAddress(addressQuery)) || coordinates;
      } catch (error) {
        console.warn('Address could not be geocoded; preserving existing coordinates.', error);
      }

      const propertyPayload = {
        title: title.trim(),
        category: category,
        price: Number(price),
        location: location.trim(),
        address: address.trim(),
        city: location.split(',')[0]?.trim() || location,
        ...(coordinates ? coordinates : {}),
        bedrooms: category === 'Plot' ? 0 : Number(bedrooms),
        bathrooms: category === 'Plot' ? 0 : Number(bathrooms),
        areaSqFt: Number(areaSqFt),
        plotDimensions: category === 'Plot' ? plotDimensions : undefined,
        images: allImages,
        tourRooms: generatedTourRooms,
        description: description.trim() || `Modern luxury ${category.toLowerCase()} situated in prestigious ${location}. Features high architectural standards, refined interior materials, and private security.`,
        status: propertyToEdit?.status || 'For Sale',
        amenities: amenities,
        sellerId: propertyToEdit?.sellerId || currentUser?.uid || 'guest-seller',
        sellerName: propertyToEdit?.sellerName || currentUser?.displayName || 'Homevia Premier Seller',
        sellerEmail: propertyToEdit?.sellerEmail || currentUser?.email || 'seller@homevia.luxury',
        sellerPhone: propertyToEdit?.sellerPhone || '+1 (555) 892-3000',
        sellerAvatar: currentUser?.photoURL || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        featured: propertyToEdit?.featured || false,
      };

      if (isEditing && propertyToEdit) {
        await updatePropertyListing(propertyToEdit.id, propertyPayload);
      } else {
        await addPropertyListing(propertyPayload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Unable to save listing. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#08090b]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#12141b]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-[32px] overflow-hidden shadow-2xl shadow-black/90 my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0d10]/70 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a1d26] border border-[#c8a97e]/30 flex items-center justify-center text-[#dfc5a4] shadow-md">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {isEditing ? 'Edit Property & 3D Tour' : 'List Property for Sale'}
              </h3>
              <p className="text-[11px] text-stone-400 font-light">
                {isEditing ? 'Update specifications and room-by-room walkthrough' : 'Publish your property with interactive room-by-room tour'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-full bg-[#0c0d10] border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-[#c8a97e] text-[#0c0d10] shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                1. General Specs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'rooms'
                    ? 'bg-[#c8a97e] text-[#0c0d10] shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Room Tour Photos ({roomImages.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {activeTab === 'details' ? (
            <>
              {/* Category Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                  Property Category *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['House', 'Apartment', 'Plot'] as PropertyCategory[]).map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] font-bold border-[#c8a97e] shadow-lg shadow-[#c8a97e]/20'
                            : 'bg-[#0c0d10]/40 border-white/10 text-stone-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {cat === 'House' && <Home className="w-4 h-4" />}
                        {cat === 'Apartment' && <Building className="w-4 h-4" />}
                        {cat === 'Plot' && <Trees className="w-4 h-4" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Property Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Aurora Modern Residence"
                    className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Listing Price ($ USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c8a97e]" />
                    <input
                      type="number"
                      required
                      min="10000"
                      step="10000"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Full Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    City / Region (e.g. Greenfield, CA) *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Greenfield, CA"
                    className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1.5">
                    Full Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="1234 Maple Avenue, Greenfield"
                    className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                </div>
              </div>

              {/* Category-Specific Dimensions */}
              {category === 'Plot' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0c0d10]/40 backdrop-blur-md rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">
                      Plot Dimensions / Lot Area (e.g. 5 Acres)
                    </label>
                    <input
                      type="text"
                      value={plotDimensions}
                      onChange={(e) => setPlotDimensions(e.target.value)}
                      placeholder="e.g. 40 Acres (1,742,400 sq ft)"
                      className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">
                      Total Land Area in Sq Ft
                    </label>
                    <input
                      type="number"
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 p-4 bg-[#0c0d10]/40 backdrop-blur-md rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">Bedrooms</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">Bathrooms</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      step="0.5"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">Interior Sq Ft</label>
                    <input
                      type="number"
                      min="100"
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                  Architectural Description & Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the interior layout, materials, views, orientation, and luxury attributes..."
                  className="w-full p-3.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-2.5">
                <label className="block text-xs font-medium text-stone-400 uppercase tracking-wider">
                  Amenities & Key Features
                </label>
                
                <div className="flex flex-wrap gap-2">
                  {amenities.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#c8a97e]/15 text-[#dfc5a4] border border-[#c8a97e]/30 backdrop-blur-md"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(item)}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newAmenityInput}
                    onChange={(e) => setNewAmenityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAmenity(newAmenityInput);
                      }
                    }}
                    placeholder="Add custom amenity (e.g. Private Elevator)..."
                    className="flex-1 px-3.5 py-2.5 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddAmenity(newAmenityInput)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1a1d26] hover:bg-[#252834] text-stone-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Prompt to move to Room Tour Tab */}
              <div className="p-4 rounded-2xl bg-[#0c0d10]/70 border border-[#c8a97e]/30 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfc5a4]" />
                    Interactive 3D Virtual Tour Ready
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {roomImages.length} rooms configured. Click next to organize room-by-room photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('rooms')}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#c8a97e] text-[#0c0d10] hover:brightness-110 transition-all cursor-pointer"
                >
                  Configure Rooms →
                </button>
              </div>
            </>
          ) : (
            /* ROOMS & VIRTUAL TOUR PHOTOS TAB */
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0c0d10]/60 rounded-2xl border border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#dfc5a4]" />
                    Virtual Tour Room Images
                  </h4>
                  <p className="text-xs text-stone-400 font-light">
                    Upload and categorize images for each room (Exterior, Entrance, Living Room, Kitchen, Bedroom, Bathroom, Store Room, Balcony, etc.)
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#1a1d26] hover:bg-[#252834] text-[#dfc5a4] border border-[#c8a97e]/40 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Room</span>
                </button>
              </div>

              {/* Room Cards List */}
              <div className="space-y-4">
                {roomImages.map((room, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0c0d10]/50 border border-white/10 hover:border-[#c8a97e]/30 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#c8a97e]/20 text-[#dfc5a4] text-xs font-bold flex items-center justify-center border border-[#c8a97e]/30">
                          {idx + 1}
                        </span>
                        <span className="text-xs uppercase font-bold tracking-wider text-white">
                          {room.category}
                        </span>
                        {idx === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Cover & Tour Entrance
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(idx)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      
                      {/* Thumbnail Preview & File Upload */}
                      <div className="md:col-span-4 space-y-2">
                        <div className="relative h-32 w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                        <label className="flex items-center justify-center gap-2 py-2 px-3 bg-[#171920] hover:bg-[#20242e] border border-white/10 rounded-xl text-[11px] text-stone-200 cursor-pointer transition-colors">
                          <Upload className="w-3 h-3 text-[#dfc5a4]" />
                          <span>Upload Room Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleRoomFileUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Fields: Category, Room Name, Direct URL & Description */}
                      <div className="md:col-span-8 space-y-3">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">
                              Room Category
                            </label>
                            <select
                              value={room.category}
                              onChange={(e) => handleUpdateRoom(idx, { category: e.target.value as TourRoomCategory })}
                              className="w-full px-3 py-2 bg-[#0c0d10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c8a97e]"
                            >
                              {ROOM_CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.category} value={opt.category}>
                                  {opt.icon} {opt.category}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">
                              Display Room Name
                            </label>
                            <input
                              type="text"
                              value={room.name}
                              onChange={(e) => handleUpdateRoom(idx, { name: e.target.value })}
                              placeholder="e.g., Gourmet Chef Kitchen"
                              className="w-full px-3 py-2 bg-[#0c0d10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c8a97e]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            Direct Image URL
                          </label>
                          <input
                            type="url"
                            value={room.image}
                            onChange={(e) => handleUpdateRoom(idx, { image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 bg-[#0c0d10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c8a97e]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">
                            Room Description (Shown in Virtual Tour)
                          </label>
                          <input
                            type="text"
                            value={room.description}
                            onChange={(e) => handleUpdateRoom(idx, { description: e.target.value })}
                            placeholder="e.g. Spacious open layout with Italian marble finishes and floor-to-ceiling glass."
                            className="w-full px-3 py-2 bg-[#0c0d10] border border-white/10 rounded-xl text-xs text-stone-300 focus:outline-none focus:border-[#c8a97e]"
                          />
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Add Room Button Bottom */}
              <button
                type="button"
                onClick={handleAddRoom}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#c8a97e]/50 text-stone-400 hover:text-[#dfc5a4] bg-[#0c0d10]/40 transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Room (Bedroom, Bathroom, Store Room, Balcony, etc.)</span>
              </button>

            </div>
          )}

          {/* Form Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {activeTab === 'rooms' ? (
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white bg-transparent cursor-pointer"
              >
                ← Back to Details
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-400 hover:text-white bg-transparent cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-8 py-3 rounded-full text-xs font-bold text-[#0c0d10] bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#c8a97e]/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Saving Property & Walkthrough...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#0c0d10]" />
                  <span>{isEditing ? 'Update Property Listing' : 'Publish Listing with 3D Tour'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
