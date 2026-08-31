import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Home, 
  Clock, 
  MapPin, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Eye, 
  Video, 
  Building,
  UserCheck,
  TrendingUp,
  DollarSign,
  Heart,
  User,
  Phone,
  Mail,
  FileText,
  Save,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Booking, Property, UserProfile } from '../types';
import { cancelViewingBooking, deletePropertyListing, updateUserProfileInFirestore } from '../lib/firebase';
import { Footprints } from 'lucide-react';

interface MyDashboardModalProps {
  currentUser: UserProfile | null;
  bookings: Booking[];
  myProperties: Property[];
  allProperties: Property[];
  savedPropertyIds: string[];
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onToggleSave: (propertyId: string) => void;
  onOpenAddProperty: () => void;
  onOpenQuickVisit: () => void;
  onStartVirtualTour?: (property: Property) => void;
  onProfileUpdated?: (updated: Partial<UserProfile>) => void;
}

export const MyDashboardModal: React.FC<MyDashboardModalProps> = ({
  currentUser,
  bookings,
  myProperties,
  allProperties,
  savedPropertyIds,
  onClose,
  onSelectProperty,
  onEditProperty,
  onToggleSave,
  onOpenAddProperty,
  onOpenQuickVisit,
  onStartVirtualTour,
  onProfileUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'bookings' | 'listings'>('profile');

  // Profile Form state
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [preferredLocation, setPreferredLocation] = useState(currentUser?.preferredLocation || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhone(currentUser.phone || '');
      setBio(currentUser.bio || '');
      setPreferredLocation(currentUser.preferredLocation || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  // Saved Properties
  const savedPropertiesList = allProperties.filter((p) => savedPropertyIds.includes(p.id));

  const totalPortfolioValue = myProperties.reduce((acc, p) => acc + (p.price || 0), 0);
  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSavingProfile(true);
    try {
      const updatedData: Partial<UserProfile> = {
        displayName: displayName.trim() || currentUser.displayName,
        phone: phone.trim(),
        bio: bio.trim(),
        preferredLocation: preferredLocation.trim(),
        photoURL: photoURL.trim() || undefined,
        membershipTier: currentUser.membershipTier || 'Homevia Club Member'
      };
      await updateUserProfileInFirestore(currentUser.uid, updatedData);
      if (onProfileUpdated) {
        onProfileUpdated(updatedData);
      }
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled property visit?')) {
      try {
        await cancelViewingBooking(bookingId);
      } catch (err) {
        console.error('Error cancelling booking:', err);
      }
    }
  };

  const handleDeleteListing = async (propertyId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete listing "${title}" from the website?`)) {
      try {
        await deletePropertyListing(propertyId);
      } catch (err) {
        console.error('Error deleting listing:', err);
      }
    }
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#08090b]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#12141b]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-[32px] overflow-hidden shadow-2xl shadow-black/90 my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0c0d10]/70 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#c8a97e] shadow-md shadow-[#c8a97e]/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#c8a97e] to-[#dfc5a4] border border-white/20 flex items-center justify-center text-[#0c0d10] font-bold text-base shadow-md">
                  {currentUser?.displayName?.charAt(0) || 'H'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#12141b] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">
                  {currentUser?.displayName || 'Client'}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#c8a97e]/20 text-[#dfc5a4] border border-[#c8a97e]/40 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {currentUser?.membershipTier || 'Homevia VIP Client'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-light">{currentUser?.email || 'Logged In Account'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 p-4 bg-[#0c0d10]/40 border-b border-white/10 text-center">
          <div className="p-2 space-y-0.5 border-r border-white/5">
            <span className="text-[10px] sm:text-[11px] text-stone-400">Saved Homes</span>
            <p className="text-lg sm:text-xl font-serif font-bold text-rose-400">{savedPropertyIds.length}</p>
          </div>
          <div className="p-2 space-y-0.5 border-r border-white/5">
            <span className="text-[10px] sm:text-[11px] text-stone-400">Active Visits</span>
            <p className="text-lg sm:text-xl font-serif font-bold text-[#dfc5a4]">{activeBookingsCount}</p>
          </div>
          <div className="p-2 space-y-0.5 border-r border-white/5">
            <span className="text-[10px] sm:text-[11px] text-stone-400">My Listings</span>
            <p className="text-lg sm:text-xl font-serif font-bold text-white">{myProperties.length}</p>
          </div>
          <div className="p-2 space-y-0.5">
            <span className="text-[10px] sm:text-[11px] text-stone-400">Asset Value</span>
            <p className="text-lg sm:text-xl font-serif font-bold text-[#dfc5a4]">
              ${(totalPortfolioValue / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex flex-wrap gap-2 border-b border-white/10 bg-[#0c0d10]/30">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#dfc5a4] text-[#dfc5a4]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-[#dfc5a4]" />
            <span>Profile & Account</span>
          </button>
          
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Saved Favorites ({savedPropertiesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-[#dfc5a4] text-[#dfc5a4]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#dfc5a4]" />
            <span>Viewing Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'listings'
                ? 'border-[#dfc5a4] text-[#dfc5a4]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 text-[#dfc5a4]" />
            <span>My Properties ({myProperties.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: PROFILE EDITING */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {saveSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Your profile details have been saved and updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {/* Avatar Selection */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-2.5">
                    Profile Avatar Preset
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoURL(preset)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          photoURL === preset
                            ? 'border-[#dfc5a4] scale-110 shadow-lg shadow-[#c8a97e]/40 ring-2 ring-[#dfc5a4]/50'
                            : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#dfc5a4]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#dfc5a4]" />
                      Email Address (Read Only)
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-[#0c0d10]/40 border border-white/10 rounded-xl text-sm text-stone-400 cursor-not-allowed opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#dfc5a4]" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#dfc5a4]" />
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      placeholder="e.g. San Francisco Bay Area, Beverly Hills"
                      className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#dfc5a4]" />
                    Bio & Investment Criteria
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell our luxury advisory team about your architectural preferences, investment goals, or search criteria..."
                    className="w-full px-4 py-3 bg-[#0c0d10]/60 border border-white/10 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#c8a97e] transition-colors"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] hover:brightness-110 text-[#0c0d10] text-xs font-bold shadow-lg shadow-[#c8a97e]/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#0c0d10]" />
                    <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SAVED PROPERTIES */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedPropertiesList.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-[#0c0d10]/40 rounded-3xl border border-white/10 p-6">
                  <Heart className="w-10 h-10 text-rose-400 mx-auto opacity-50" />
                  <p className="text-sm text-white font-medium">No saved properties yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto font-light leading-relaxed">
                    Click the heart icon on any residence, penthouse, or plot in the catalog to save it to your private portfolio.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-lg shadow-[#c8a97e]/20 transition-all cursor-pointer"
                  >
                    Browse Available Properties
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedPropertiesList.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#0c0d10]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#c8a97e]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-44 w-full">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => onToggleSave(p.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#0c0d10]/80 text-rose-400 hover:scale-110 border border-white/20 transition-all cursor-pointer"
                          title="Remove from saved"
                        >
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 bg-[#0c0d10]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-serif font-bold text-[#dfc5a4] border border-[#c8a97e]/30">
                          ${p.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#dfc5a4] font-semibold uppercase">
                            <span>{p.category}</span>
                            <span>•</span>
                            <span>{p.city}</span>
                          </div>
                          <h4 className="font-serif font-bold text-white text-sm line-clamp-1">
                            {p.title}
                          </h4>
                          <p className="text-xs text-stone-400 truncate font-light">{p.address || p.location}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-white/10">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectProperty(p);
                            }}
                            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                          {onStartVirtualTour && (
                            <button
                              onClick={() => {
                                onClose();
                                onStartVirtualTour(p);
                              }}
                              className="py-2.5 rounded-xl bg-[#0c0d10] hover:bg-[#1a1d26] border border-[#c8a97e]/60 text-xs font-bold text-[#dfc5a4] flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                            >
                              <Footprints className="w-3.5 h-3.5 text-[#dfc5a4]" />
                              <span>3D Tour</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onClose();
                              onSelectProperty(p);
                            }}
                            className="py-2.5 rounded-xl bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-xs font-bold text-[#0c0d10] flex items-center justify-center gap-1 transition-all shadow-md shadow-[#c8a97e]/20 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Visit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-[#0c0d10]/40 rounded-3xl border border-white/10 p-6">
                  <Calendar className="w-10 h-10 text-stone-500 mx-auto opacity-50" />
                  <p className="text-sm text-white font-medium">No property viewings booked yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto font-light leading-relaxed">
                    Browse our luxury catalogue and book a private walkthrough for any residence, penthouse, or plot.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQuickVisit();
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-lg shadow-[#c8a97e]/20 transition-all cursor-pointer"
                  >
                    Schedule a Visit Now
                  </button>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0c0d10]/60 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#c8a97e]/30 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={b.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                        alt={b.propertyTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-white text-sm sm:text-base">
                            {b.propertyTitle}
                          </h4>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
                          <span className="truncate max-w-[240px]">{b.propertyLocation}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#dfc5a4]" />
                            {b.date} at {b.timeSlot}
                          </span>
                          <span className="flex items-center gap-1 text-[#dfc5a4]">
                            {b.tourType === 'Live Video Tour' ? <Video className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            {b.tourType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-4 py-2 text-xs rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/20 transition-all cursor-pointer"
                        >
                          Cancel Visit
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: MY LISTED PROPERTIES */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-stone-400">Properties created by you</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddProperty();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-md shadow-[#c8a97e]/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#0c0d10]" />
                  <span>Add New Property</span>
                </button>
              </div>

              {myProperties.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-[#0c0d10]/40 rounded-3xl border border-white/10 p-6">
                  <Home className="w-10 h-10 text-stone-500 mx-auto opacity-50" />
                  <p className="text-sm text-white font-medium">You have not listed any properties yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto font-light leading-relaxed">
                    Publish your house, apartment, or plot to connect with qualified buyers worldwide.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAddProperty();
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-lg shadow-[#c8a97e]/20 transition-all cursor-pointer"
                  >
                    List Property for Sale
                  </button>
                </div>
              ) : (
                myProperties.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0c0d10]/60 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#c8a97e]/30 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                        alt={p.title}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-white text-sm sm:text-base">
                            {p.title}
                          </h4>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#0c0d10] text-[#dfc5a4] border border-[#c8a97e]/40">
                            {p.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-light">
                          <MapPin className="w-3.5 h-3.5 text-[#c8a97e] shrink-0" />
                          <span className="truncate max-w-[240px]">{p.address || p.location}</span>
                        </div>
                        <div className="text-xs font-serif font-bold text-[#dfc5a4]">
                          ${p.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProperty(p);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onEditProperty(p);
                        }}
                        className="p-2 rounded-xl bg-[#c8a97e]/15 hover:bg-[#c8a97e] hover:text-[#0c0d10] text-[#dfc5a4] transition-colors cursor-pointer"
                        title="Edit listing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(p.id, p.title)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
