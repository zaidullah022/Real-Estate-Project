export type PropertyCategory = 'House' | 'Apartment' | 'Plot';

export type ThemeMode = 'Luxury Charcoal' | 'Elegance Ivory';

export type TourRoomCategory =
  | 'Exterior'
  | 'Entrance'
  | 'Living Room'
  | 'Kitchen'
  | 'Dining Room'
  | 'Master Bedroom'
  | 'Bedroom'
  | 'Bathroom'
  | 'Balcony'
  | 'Garden'
  | 'Store Room'
  | 'Parking'
  | 'Other';

export interface TourHotspot {
  id: string;
  targetRoomId: string;
  label: string; // e.g. "Walk to Kitchen"
  roomName: string; // e.g. "Gourmet Kitchen"
  icon?: 'door' | 'kitchen' | 'bed' | 'bath' | 'balcony' | 'arrow' | 'stairs' | 'garden' | 'box' | 'compass' | 'eye';
  position: { x: number; y: number }; // percentage from left and top (0-100)
  description?: string;
}

export interface TourRoom {
  id: string;
  name: string;
  category: TourRoomCategory;
  image: string;
  description?: string;
  floorLevel?: string;
  hotspots: TourHotspot[];
}

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  price: number;
  location: string;
  address: string;
  city: string;
  state?: string;
  lat?: number;
  lng?: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  plotDimensions?: string; // e.g. "120ft x 80ft" or "0.75 Acres"
  images: string[];
  tourRooms?: TourRoom[];
  description: string;
  featured?: boolean;
  featuredTag?: string; // e.g., "Architectural Landmark", "Skyline Penthouse", "Editor's Pick", "Highland Ranch"
  featuredReason?: string;
  status: 'For Sale' | 'Under Offer' | 'Sold';
  amenities: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  sellerAvatar?: string;
  createdAt: number;
  updatedAt?: number;
  yearBuilt?: number;
  parkingSpaces?: number;
  isOwnerListing?: boolean;
}

export type TourType = 'In-Person Walkthrough' | 'Live Video Tour';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  propertyPrice: number;
  category: PropertyCategory;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  tourType: TourType;
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  bio?: string;
  preferredLocation?: string;
  membershipTier?: 'Standard Client' | 'Homevia Club Member' | 'VIP Private Client';
  role: 'buyer' | 'seller' | 'agent';
  isAnonymous?: boolean;
  savedPropertyIds?: string[];
  themePreference?: ThemeMode;
}

export interface FilterState {
  category: 'All' | PropertyCategory;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  viewMode: 'grid' | 'map' | 'split';
}

