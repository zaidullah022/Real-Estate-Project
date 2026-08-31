import React, { useState, useEffect, useMemo } from 'react';
import { 
  Property, 
  Booking, 
  UserProfile, 
  FilterState, 
  PropertyCategory 
} from './types';
import { 
  auth, 
  subscribeToProperties, 
  subscribeToBookings, 
  deletePropertyListing, 
  logOutUser,
  subscribeToUserProfile,
  toggleSavedPropertyInFirestore
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedProperties } from './components/FeaturedProperties';
import { PropertySearchAndFilter } from './components/PropertySearchAndFilter';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyMapView } from './components/PropertyMapView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { BookViewingModal } from './components/BookViewingModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { MyDashboardModal } from './components/MyDashboardModal';
import { AboutAndConsultation } from './components/AboutAndConsultation';
import { AuthModal } from './components/AuthModal';
import { VirtualPropertyTourModal } from './components/VirtualPropertyTourModal';
import { ToastContainer, Toast } from './components/ToastNotification';
import { Footer } from './components/Footer';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Properties & Realtime Firestore State
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Toast Notifications State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Saved Properties State (Favorites)
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('homevia_saved_properties');
      return saved ? JSON.parse(saved) : ['aurora-modern-residence', 'skyline-glass-penthouse'];
    } catch {
      return ['aurora-modern-residence', 'skyline-glass-penthouse'];
    }
  });

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [propertyForVirtualTour, setPropertyForVirtualTour] = useState<Property | null>(null);
  const [propertyForBooking, setPropertyForBooking] = useState<Property | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Search & Filter State
  const initialFilter: FilterState = {
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 'all',
    sortBy: 'featured',
    viewMode: 'grid',
  };
  const [filter, setFilter] = useState<FilterState>(initialFilter);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'user@example.com',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Luxury Client',
          photoURL: firebaseUser.photoURL || undefined,
          role: 'buyer',
          membershipTier: 'Homevia Club Member',
          savedPropertyIds: savedPropertyIds
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Profile subscription when user is logged in
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribe = subscribeToUserProfile(currentUser.uid, (profile) => {
      if (profile) {
        setCurrentUser((prev) => prev ? { ...prev, ...profile } : profile);
        if (profile.savedPropertyIds) {
          setSavedPropertyIds(profile.savedPropertyIds);
          try {
            localStorage.setItem('homevia_saved_properties', JSON.stringify(profile.savedPropertyIds));
          } catch (e) {
            // ignore
          }
        }
      }
    });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Subscribe to Realtime Properties in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProperties((data) => {
      setProperties(data);
      setIsLoadingProperties(false);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Realtime Bookings in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToBookings(currentUser?.uid || null, (data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Toggle Favorite Saved Property Handler
  const handleToggleSaveProperty = async (propertyId: string) => {
    const isSaved = savedPropertyIds.includes(propertyId);
    const updated = isSaved 
      ? savedPropertyIds.filter(id => id !== propertyId)
      : [...savedPropertyIds, propertyId];

    setSavedPropertyIds(updated);
    try {
      localStorage.setItem('homevia_saved_properties', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    addToast({
      type: 'favorite',
      icon: 'favorite',
      title: isSaved ? 'Removed from Saved' : 'Saved to Favorites',
      message: isSaved 
        ? 'Property has been removed from your private wishlist.' 
        : 'Property added to your curated favorites portfolio.',
    });

    if (currentUser?.uid) {
      try {
        await toggleSavedPropertyInFirestore(currentUser.uid, propertyId, isSaved);
      } catch (err) {
        console.error('Error syncing saved property:', err);
      }
    }
  };

  // Filter & Search Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Category Filter
      if (filter.category !== 'All' && prop.category !== filter.category) {
        return false;
      }
      // Price Filter
      if (prop.price > filter.maxPrice) {
        return false;
      }
      // Bedrooms Filter (Plot has 0 bedrooms, so if filtering beds skip plots unless 'all')
      if (filter.bedrooms !== 'all') {
        if (prop.category === 'Plot') return false;
        if (prop.bedrooms < filter.bedrooms) return false;
      }
      // Search Query (title, location, address, city)
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(query);
        const matchLocation = prop.location?.toLowerCase().includes(query);
        const matchAddress = prop.address?.toLowerCase().includes(query);
        const matchDesc = prop.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchLocation && !matchAddress && !matchDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      if (filter.sortBy === 'price-asc') return a.price - b.price;
      if (filter.sortBy === 'price-desc') return b.price - a.price;
      if (filter.sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      return 0;
    });
  }, [properties, filter]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: properties.length,
      House: properties.filter((p) => p.category === 'House').length,
      Apartment: properties.filter((p) => p.category === 'Apartment').length,
      Plot: properties.filter((p) => p.category === 'Plot').length,
    };
  }, [properties]);

  // User's own properties
  const myProperties = useMemo(() => {
    if (!currentUser) return [];
    return properties.filter(
      (p) => p.sellerId === currentUser.uid || p.sellerEmail === currentUser.email
    );
  }, [properties, currentUser]);

  // Handler: Open Add Property Modal (requires sign in or guest seller profile)
  const handleOpenAddProperty = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setPropertyToEdit(null);
      setIsAddEditModalOpen(true);
    }
  };

  // Handler: Open Edit Property Modal
  const handleOpenEditProperty = (property: Property) => {
    setPropertyToEdit(property);
    setIsAddEditModalOpen(true);
  };

  // Handler: Delete Property
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deletePropertyListing(propertyId);
      addToast({
        type: 'info',
        icon: 'trash',
        title: 'Listing Removed',
        message: 'The property listing has been successfully unpublished.',
      });
      if (selectedPropertyForDetail?.id === propertyId) {
        setSelectedPropertyForDetail(null);
      }
    } catch (err) {
      console.error('Failed to delete property:', err);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Unable to remove listing. Please check permissions.',
      });
    }
  };

  // Handler: Open Booking Modal
  const handleOpenBooking = (property?: Property) => {
    setPropertyForBooking(property || properties[0] || null);
    setIsBookingModalOpen(true);
  };

  // Handler: Start Virtual Tour Walkthrough
  const handleStartVirtualTour = (property: Property) => {
    setPropertyForVirtualTour(property);
  };

  // Handler: Logout
  const handleLogout = async () => {
    await logOutUser();
    setCurrentUser(null);
    addToast({
      type: 'info',
      icon: 'profile',
      title: 'Signed Out',
      message: 'You have been signed out of your Homevia account.',
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f5ebd9] font-sans antialiased selection:bg-[#c8a97e]/35 selection:text-white relative overflow-x-hidden">
      
      {/* Warm Champagne & Bronze Ambient Glow in Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[12%] -left-[10%] w-[55%] h-[55%] bg-[#c8a97e]/8 rounded-full blur-[170px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#8c734b]/8 rounded-full blur-[180px]" />
        <div className="absolute top-[35%] right-[10%] w-[45%] h-[45%] bg-[#c8a97e]/4 rounded-full blur-[160px]" />
      </div>

      {/* Top Fixed Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddProperty={handleOpenAddProperty}
        onOpenBookings={() => setIsDashboardModalOpen(true)}
        onOpenQuickVisit={() => handleOpenBooking()}
        userBookingsCount={bookings.length}
        userPropertiesCount={myProperties.length}
      />

      <main className="relative z-10 space-y-20 sm:space-y-32 pt-2 pb-16">
        
        {/* SECTION 1: Architectural Hero Section */}
        <HeroSection
          featuredProperties={properties.filter(p => p.featured || p.id === 'aurora-modern-residence')}
          onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
          onBookViewing={(prop) => handleOpenBooking(prop)}
          onStartVirtualTour={handleStartVirtualTour}
          onBrowseAll={() => {
            const el = document.getElementById('properties');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* SECTION 2: Featured Properties Curated Showcase */}
        <FeaturedProperties
          properties={properties}
          currentUser={currentUser}
          savedPropertyIds={savedPropertyIds}
          onToggleSave={handleToggleSaveProperty}
          onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
          onBookViewing={(prop) => handleOpenBooking(prop)}
          onStartVirtualTour={handleStartVirtualTour}
          onViewAllProperties={() => {
            const el = document.getElementById('properties');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* SECTION 3: Filterable Luxury Property Catalog with Grid & Interactive Map View */}
        <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-2.5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4b996] font-bold">
                Curated Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Browse Properties
              </h2>
              <p className="text-sm sm:text-base text-stone-400 max-w-xl font-light leading-relaxed">
                Discover signature houses, skyline apartments, and prime development plots with verified titles and architectural pedigree.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#171920]/80 border border-[#c8a97e]/20 px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
              <div className="w-2 h-2 rounded-full bg-[#c8a97e] animate-pulse" />
              <span className="text-xs text-stone-300 font-medium tracking-wide">
                Live Cloud Sync • {properties.length} Listings
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <PropertySearchAndFilter
            filter={filter}
            onFilterChange={(newF) => setFilter({ ...filter, ...newF })}
            onResetFilter={() => setFilter(initialFilter)}
            onOpenAddProperty={handleOpenAddProperty}
            categoryCounts={categoryCounts}
          />

          {/* Render Map View or Grid View based on toggle */}
          {filter.viewMode === 'map' ? (
            <PropertyMapView
              properties={filteredProperties}
              currentUser={currentUser}
              savedPropertyIds={savedPropertyIds}
              selectedCategory={filter.category}
              onSelectCategory={(cat) => setFilter({ ...filter, category: cat })}
              onToggleSave={handleToggleSaveProperty}
              onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
              onBookViewing={(prop) => handleOpenBooking(prop)}
              onStartVirtualTour={handleStartVirtualTour}
            />
          ) : (
            <PropertyGrid
              properties={filteredProperties}
              currentUser={currentUser}
              savedPropertyIds={savedPropertyIds}
              isLoading={isLoadingProperties}
              onToggleSave={handleToggleSaveProperty}
              onSelectProperty={(prop) => setSelectedPropertyForDetail(prop)}
              onBookViewing={(prop) => handleOpenBooking(prop)}
              onStartVirtualTour={handleStartVirtualTour}
              onEditProperty={(prop) => handleOpenEditProperty(prop)}
              onDeleteProperty={(id) => handleDeleteProperty(id)}
              onResetFilters={() => setFilter(initialFilter)}
              onOpenAddProperty={handleOpenAddProperty}
            />
          )}

        </section>

        {/* SECTION 4: About Homevia & Consultation Advisory */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutAndConsultation
            onOpenQuickVisit={() => handleOpenBooking()}
          />
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* --- MODALS --- */}

      {/* 1. Property Details Modal */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          currentUser={currentUser}
          savedPropertyIds={savedPropertyIds}
          onToggleSave={handleToggleSaveProperty}
          onClose={() => setSelectedPropertyForDetail(null)}
          onStartVirtualTour={(prop) => {
            setSelectedPropertyForDetail(null);
            handleStartVirtualTour(prop);
          }}
          onBookViewing={(prop) => {
            setSelectedPropertyForDetail(null);
            handleOpenBooking(prop);
          }}
          onEdit={(prop) => {
            setSelectedPropertyForDetail(null);
            handleOpenEditProperty(prop);
          }}
          onDelete={(id) => handleDeleteProperty(id)}
        />
      )}

      {/* 2. Full-Screen Interactive 3D Virtual Walkthrough Tour Modal */}
      {propertyForVirtualTour && (
        <VirtualPropertyTourModal
          property={propertyForVirtualTour}
          onClose={() => setPropertyForVirtualTour(null)}
          onBookViewing={(prop) => {
            setPropertyForVirtualTour(null);
            handleOpenBooking(prop);
          }}
        />
      )}

      {/* 3. Book a Property Viewing Modal */}
      {isBookingModalOpen && (
        <BookViewingModal
          property={propertyForBooking}
          currentUser={currentUser}
          allProperties={properties}
          onClose={() => setIsBookingModalOpen(false)}
          onBookingSuccess={() => {
            addToast({
              type: 'success',
              icon: 'booking',
              title: 'Viewing Confirmed',
              message: 'Your private consultation has been reserved and synced.',
            });
          }}
          onOpenAuth={() => {
            setIsBookingModalOpen(false);
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* 4. Add or Edit Property Modal */}
      {isAddEditModalOpen && (
        <AddEditPropertyModal
          propertyToEdit={propertyToEdit}
          currentUser={currentUser}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setPropertyToEdit(null);
          }}
          onSuccess={() => {
            addToast({
              type: 'success',
              icon: 'property',
              title: propertyToEdit ? 'Listing Updated' : 'Listing Published',
              message: propertyToEdit
                ? 'Your property details and pricing were updated successfully.'
                : 'Your luxury property is now published live on Homevia.',
            });
          }}
        />
      )}

      {/* 5. User Dashboard & Bookings Hub with Profile Editing & Saved Favorites */}
      {isDashboardModalOpen && (
        <MyDashboardModal
          currentUser={currentUser}
          bookings={bookings}
          myProperties={myProperties}
          allProperties={properties}
          savedPropertyIds={savedPropertyIds}
          onClose={() => setIsDashboardModalOpen(false)}
          onSelectProperty={(prop) => {
            setIsDashboardModalOpen(false);
            setSelectedPropertyForDetail(prop);
          }}
          onStartVirtualTour={(prop) => {
            setIsDashboardModalOpen(false);
            handleStartVirtualTour(prop);
          }}
          onEditProperty={(prop) => {
            setIsDashboardModalOpen(false);
            handleOpenEditProperty(prop);
          }}
          onToggleSave={handleToggleSaveProperty}
          onOpenAddProperty={() => {
            setIsDashboardModalOpen(false);
            handleOpenAddProperty();
          }}
          onOpenQuickVisit={() => {
            setIsDashboardModalOpen(false);
            handleOpenBooking();
          }}
          onProfileUpdated={(updated) => {
            setCurrentUser((prev) => prev ? { ...prev, ...updated } : null);
            addToast({
              type: 'success',
              icon: 'profile',
              title: 'Profile Updated',
              message: 'Your membership credentials and details were saved.',
            });
          }}
        />
      )}

      {/* 6. Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            addToast({
              type: 'success',
              icon: 'profile',
              title: 'Welcome to Homevia',
              message: `Signed in as ${user.displayName || user.email}`,
            });
          }}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
