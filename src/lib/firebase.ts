import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { Property, Booking, UserProfile } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

// Initialize Firebase
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || undefined);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserProfile> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || 'user@example.com',
    displayName: user.displayName || user.email?.split('@')[0] || 'Luxury Buyer',
    photoURL: user.photoURL || undefined,
    role: 'buyer'
  };
  // Save user profile in Firestore
  try {
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
  } catch (e) {
    console.warn('Firestore user save warning:', e);
  }
  return profile;
};

export const registerWithEmail = async (email: string, pass: string, name: string): Promise<UserProfile> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  await updateProfile(user, { displayName: name });
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName: name,
    role: 'buyer'
  };
  try {
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
  } catch (e) {
    console.warn('Firestore user profile save warning:', e);
  }
  return profile;
};

export const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  return {
    uid: user.uid,
    email: user.email || email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Client',
    photoURL: user.photoURL || undefined,
    role: 'buyer'
  };
};

export const logOutUser = async () => {
  await signOut(auth);
};

// Real-time Properties listener with Auto-Seeding
export const subscribeToProperties = (callback: (properties: Property[]) => void) => {
  const propertiesCol = collection(db, 'properties');
  const q = query(propertiesCol, orderBy('createdAt', 'desc'));

  let hasSeeded = false;

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    if (snapshot.empty && !hasSeeded) {
      hasSeeded = true;
      console.log('Seeding initial luxury properties to Firestore...');
      try {
        for (const prop of INITIAL_PROPERTIES) {
          await setDoc(doc(db, 'properties', prop.id), prop);
        }
      } catch (err) {
        console.warn('Auto-seed fallback to local initial properties:', err);
        callback(INITIAL_PROPERTIES);
      }
      return;
    }

    const properties: Property[] = [];
    snapshot.forEach((docSnapshot) => {
      const storedProperty = { id: docSnapshot.id, ...docSnapshot.data() } as Property;
      // Keep the bundled showcase listings pinned to their current, real-world
      // locations even when Firestore contains an older seeded copy.
      const canonicalListing = INITIAL_PROPERTIES.find((item) => item.id === storedProperty.id);
      properties.push(canonicalListing ? {
        ...storedProperty,
        location: canonicalListing.location,
        address: canonicalListing.address,
        city: canonicalListing.city,
        state: canonicalListing.state,
        lat: canonicalListing.lat,
        lng: canonicalListing.lng,
      } : storedProperty);
    });
    
    // If for some reason empty after seeding, fallback gracefully to initial
    if (properties.length === 0) {
      callback(INITIAL_PROPERTIES);
    } else {
      callback(properties);
    }
  }, (error) => {
    console.warn('Firestore properties snapshot error, using initial properties:', error);
    callback(INITIAL_PROPERTIES);
  });

  return unsubscribe;
};

// Add new property listing
export const addPropertyListing = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<string> => {
  const newProperty = {
    ...propertyData,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const docRef = await addDoc(collection(db, 'properties'), newProperty);
  return docRef.id;
};

// Update property listing
export const updatePropertyListing = async (propertyId: string, propertyData: Partial<Property>): Promise<void> => {
  const docRef = doc(db, 'properties', propertyId);
  await updateDoc(docRef, {
    ...propertyData,
    updatedAt: Date.now(),
  });
};

// Delete property listing
export const deletePropertyListing = async (propertyId: string): Promise<void> => {
  const docRef = doc(db, 'properties', propertyId);
  await deleteDoc(docRef);
};

// Bookings Real-time Subscription
export const subscribeToBookings = (userId: string | null, callback: (bookings: Booking[]) => void) => {
  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const allBookings: Booking[] = [];
    snapshot.forEach((docSnapshot) => {
      allBookings.push({ id: docSnapshot.id, ...docSnapshot.data() } as Booking);
    });

    if (userId) {
      // Filter by current user or show all for convenience
      const userBookings = allBookings.filter(b => b.userId === userId || b.userId === 'guest');
      callback(userBookings);
    } else {
      callback(allBookings);
    }
  }, (error) => {
    console.warn('Firestore bookings snapshot error:', error);
    callback([]);
  });
};

// Create new viewing booking
export const createViewingBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
  const newBooking = {
    ...bookingData,
    createdAt: Date.now(),
    status: 'confirmed' as const,
  };
  const docRef = await addDoc(collection(db, 'bookings'), newBooking);
  return docRef.id;
};

// Cancel viewing booking
export const cancelViewingBooking = async (bookingId: string): Promise<void> => {
  const docRef = doc(db, 'bookings', bookingId);
  await updateDoc(docRef, { status: 'cancelled' });
};

// Update user profile
export const updateUserProfileInFirestore = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { ...data, updatedAt: Date.now() }, { merge: true });
};

// Subscribe to user profile (including saved properties)
export const subscribeToUserProfile = (userId: string, callback: (profile: UserProfile | null) => void) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn('User profile subscription error:', err);
  });
};

// Toggle saved/favorited property for user
export const toggleSavedPropertyInFirestore = async (
  userId: string,
  propertyId: string,
  currentSavedIds: string[] = []
): Promise<string[]> => {
  const isSaved = currentSavedIds.includes(propertyId);
  const updatedSavedIds = isSaved
    ? currentSavedIds.filter((id) => id !== propertyId)
    : [...currentSavedIds, propertyId];

  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { savedPropertyIds: updatedSavedIds }, { merge: true });
  return updatedSavedIds;
};

