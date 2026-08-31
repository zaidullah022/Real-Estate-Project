import { Property, TourRoom, TourRoomCategory } from '../types';

export const ROOM_CATEGORY_OPTIONS: { category: TourRoomCategory; label: string; icon: string; defaultDescription: string }[] = [
  { category: 'Exterior', label: 'Exterior / Approach', icon: '🏠', defaultDescription: 'Architectural facade, landscape grounds, and exterior approach' },
  { category: 'Entrance', label: 'Entrance & Grand Foyer', icon: '🚪', defaultDescription: 'Grand entrance foyer with custom ceiling accents and security' },
  { category: 'Living Room', label: 'Main Living Room', icon: '🛋', defaultDescription: 'Spacious open-concept living area with floor-to-ceiling panoramic glass' },
  { category: 'Kitchen', label: 'Gourmet Chef Kitchen', icon: '🍳', defaultDescription: 'Custom cabinetry, monolithic island, and integrated European appliances' },
  { category: 'Dining Room', label: 'Formal Dining Area', icon: '🍷', defaultDescription: 'Refined dining space designed for intimate gatherings and banquets' },
  { category: 'Master Bedroom', label: 'Master Suite', icon: '👑', defaultDescription: 'Primary master sanctuary with private lounge and scenic vistas' },
  { category: 'Bedroom', label: 'Guest / Secondary Bedroom', icon: '🛏', defaultDescription: 'Sunlit bedroom retreat with acoustic soundproofing and custom closets' },
  { category: 'Bathroom', label: 'Luxury Spa Bathroom', icon: '🚿', defaultDescription: 'Bookmatched Italian marble, freestanding soaking tub, and rainfall shower' },
  { category: 'Balcony', label: 'Terrace & Balcony', icon: '🌅', defaultDescription: 'Private open-air terrace with heated lounge and breathtaking views' },
  { category: 'Garden', label: 'Zen Garden & Pool', icon: '🌳', defaultDescription: 'Lush landscaped private botanical garden with zero-edge pool' },
  { category: 'Store Room', label: 'Store Room & Pantry', icon: '📦', defaultDescription: 'Dedicated walk-in pantry, wine storage, and utility organization' },
  { category: 'Parking', label: 'Garage & Parking Area', icon: '🚗', defaultDescription: 'Climate-controlled private garage with high-speed EV charging' },
  { category: 'Other', label: 'Specialty Space', icon: '✨', defaultDescription: 'Custom architectural feature room or private studio' },
];

// Fallback high-res luxury photography organized by category for auto-generation
export const CATEGORY_FALLBACK_IMAGES: Record<TourRoomCategory, string[]> = {
  'Exterior': [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85'
  ],
  'Entrance': [
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85'
  ],
  'Living Room': [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1800&q=85'
  ],
  'Kitchen': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1800&q=85'
  ],
  'Dining Room': [
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85'
  ],
  'Master Bedroom': [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1800&q=85'
  ],
  'Bedroom': [
    'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85'
  ],
  'Bathroom': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1800&q=85'
  ],
  'Balcony': [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1800&q=85'
  ],
  'Garden': [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1800&q=85'
  ],
  'Store Room': [
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1594910069399-52e8046ff6a5?auto=format&fit=crop&w=1800&q=85'
  ],
  'Parking': [
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1800&q=85'
  ],
  'Other': [
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'
  ]
};

// Generates a rich, interconnected virtual walkthrough for any property
export function generatePropertyTour(property: Property): TourRoom[] {
  // If property already has customized tourRooms with at least 2 rooms, return them
  if (property.tourRooms && property.tourRooms.length >= 2) {
    return property.tourRooms;
  }

  const propImages = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85'];

  if (property.category === 'Plot') {
    // Plot / Land Walkthrough
    const r1Img = propImages[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85';
    const r2Img = propImages[1] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85';
    const r3Img = propImages[2] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=85';
    const r4Img = propImages[3] || 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1800&q=85';
    const r5Img = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85';

    return [
      {
        id: 'exterior',
        name: 'Gated Estate Approach',
        category: 'Exterior',
        image: r1Img,
        description: 'Private paved access road and front perimeter entrance to the estate parcel.',
        floorLevel: 'Ground Level',
        hotspots: [
          {
            id: 'h-ext-entrance',
            targetRoomId: 'entrance',
            label: 'Enter Parcel Grounds',
            roomName: 'Main Parcel Entry',
            icon: 'door',
            position: { x: 50, y: 65 },
            description: 'Step onto the private property grounds'
          }
        ]
      },
      {
        id: 'entrance',
        name: 'Main Parcel Entry & Elevation',
        category: 'Entrance',
        image: r2Img,
        description: 'Gentle grade approach featuring direct utility stubs and south-facing solar exposure.',
        floorLevel: 'Ground Level',
        hotspots: [
          {
            id: 'h-ent-site',
            targetRoomId: 'build-site',
            label: 'To Primary Build Site',
            roomName: 'Primary Build Site',
            icon: 'arrow',
            position: { x: 68, y: 55 },
            description: 'Explore the approved foundation & architectural footprint'
          },
          {
            id: 'h-ent-vista',
            targetRoomId: 'vista-point',
            label: 'To Mountain Vista Lookout',
            roomName: 'Vista Lookout',
            icon: 'compass',
            position: { x: 28, y: 48 },
            description: 'View 360-degree panoramic horizons'
          },
          {
            id: 'h-ent-ext',
            targetRoomId: 'exterior',
            label: 'Back to Main Approach',
            roomName: 'Gated Estate Approach',
            icon: 'door',
            position: { x: 12, y: 80 }
          }
        ]
      },
      {
        id: 'build-site',
        name: 'Primary Architectural Build Site',
        category: 'Garden',
        image: r3Img,
        description: 'Flat, engineered plateau cleared for a custom estate residence, zero-edge pool, and guest pavilion.',
        floorLevel: 'Main Ridge',
        hotspots: [
          {
            id: 'h-site-vista',
            targetRoomId: 'vista-point',
            label: 'To Sunset Vista Point',
            roomName: 'Vista Lookout',
            icon: 'balcony',
            position: { x: 78, y: 45 }
          },
          {
            id: 'h-site-woods',
            targetRoomId: 'green-belt',
            label: 'To Protected Natural Forest',
            roomName: 'Green Belt & Woodland',
            icon: 'garden',
            position: { x: 24, y: 60 }
          },
          {
            id: 'h-site-ent',
            targetRoomId: 'entrance',
            label: 'Back to Parcel Entry',
            roomName: 'Main Parcel Entry',
            icon: 'arrow',
            position: { x: 12, y: 82 }
          }
        ]
      },
      {
        id: 'vista-point',
        name: '360° Panoramic Vista Lookout',
        category: 'Balcony',
        image: r4Img,
        description: 'Unobstructed ridgeline vistas overlooking the coastal valley and surrounding hills.',
        floorLevel: 'High Ridge Point',
        hotspots: [
          {
            id: 'h-vista-site',
            targetRoomId: 'build-site',
            label: 'Return to Build Site',
            roomName: 'Primary Build Site',
            icon: 'arrow',
            position: { x: 45, y: 68 }
          },
          {
            id: 'h-vista-woods',
            targetRoomId: 'green-belt',
            label: 'Walk to Native Woodland',
            roomName: 'Green Belt & Woodland',
            icon: 'garden',
            position: { x: 80, y: 60 }
          }
        ]
      },
      {
        id: 'green-belt',
        name: 'Protected Woodland & Natural Spring',
        category: 'Garden',
        image: r5Img,
        description: 'Mature native trees and seasonal stream bed bordering the private estate boundaries.',
        floorLevel: 'Lower Valley',
        hotspots: [
          {
            id: 'h-woods-site',
            targetRoomId: 'build-site',
            label: 'Back to Build Site',
            roomName: 'Primary Build Site',
            icon: 'arrow',
            position: { x: 50, y: 55 }
          },
          {
            id: 'h-woods-ent',
            targetRoomId: 'entrance',
            label: 'Back to Entrance',
            roomName: 'Main Parcel Entry',
            icon: 'door',
            position: { x: 15, y: 75 }
          }
        ]
      }
    ];
  }

  // House / Apartment Walkthrough
  const isPenthouse = property.category === 'Apartment';

  const extImg = propImages[0] || (isPenthouse ? CATEGORY_FALLBACK_IMAGES['Balcony'][0] : CATEGORY_FALLBACK_IMAGES['Exterior'][0]);
  const entImg = propImages[1] || CATEGORY_FALLBACK_IMAGES['Entrance'][0];
  const livImg = propImages[2] || CATEGORY_FALLBACK_IMAGES['Living Room'][0];
  const kitImg = propImages[3] || CATEGORY_FALLBACK_IMAGES['Kitchen'][0];
  const bedImg = propImages[4] || CATEGORY_FALLBACK_IMAGES['Master Bedroom'][0];
  const bathImg = propImages[5] || CATEGORY_FALLBACK_IMAGES['Bathroom'][0];
  const balcImg = propImages[6] || CATEGORY_FALLBACK_IMAGES['Balcony'][0];
  const storeImg = CATEGORY_FALLBACK_IMAGES['Store Room'][0];

  return [
    {
      id: 'exterior',
      name: isPenthouse ? 'Skyline Tower & Facade' : 'Exterior & Architectural Facade',
      category: 'Exterior',
      image: extImg,
      description: isPenthouse 
        ? 'Prestige high-rise tower exterior overlooking prime metropolitan vistas.' 
        : 'Striking cantilevered modernist facade framed by architectural illumination and manicured grounds.',
      floorLevel: 'Exterior',
      hotspots: [
        {
          id: 'h-ext-ent',
          targetRoomId: 'entrance',
          label: isPenthouse ? 'Enter Sky Foyer' : 'Enter Grand Foyer',
          roomName: isPenthouse ? 'Sky Foyer' : 'Grand Entrance Foyer',
          icon: 'door',
          position: { x: 50, y: 64 },
          description: 'Step into the private foyer'
        }
      ]
    },
    {
      id: 'entrance',
      name: isPenthouse ? 'Private Sky Foyer' : 'Grand Entrance & Foyer',
      category: 'Entrance',
      image: entImg,
      description: 'Dramatic double-height foyer with custom millwork, discreet coat gallery, and ambient light wells.',
      floorLevel: 'Level 1',
      hotspots: [
        {
          id: 'h-ent-liv',
          targetRoomId: 'living-room',
          label: 'Walk to Main Living Room',
          roomName: 'Main Living Room',
          icon: 'door',
          position: { x: 65, y: 55 },
          description: 'Open-concept great room with panoramic windows'
        },
        {
          id: 'h-ent-kit',
          targetRoomId: 'kitchen',
          label: 'Go to Gourmet Kitchen',
          roomName: 'Chef Kitchen',
          icon: 'kitchen',
          position: { x: 28, y: 56 },
          description: 'Custom marble island and integrated culinary suite'
        },
        {
          id: 'h-ent-ext',
          targetRoomId: 'exterior',
          label: 'Step Outside (Exterior)',
          roomName: 'Exterior View',
          icon: 'arrow',
          position: { x: 12, y: 80 }
        }
      ]
    },
    {
      id: 'living-room',
      name: 'Main Living Room & Great Hall',
      category: 'Living Room',
      image: livImg,
      description: 'Soaring ceilings, acoustic architectural finishes, contemporary fireplace, and floor-to-ceiling glass.',
      floorLevel: 'Level 1',
      hotspots: [
        {
          id: 'h-liv-kit',
          targetRoomId: 'kitchen',
          label: 'Go to Gourmet Kitchen',
          roomName: 'Chef Kitchen',
          icon: 'kitchen',
          position: { x: 22, y: 58 },
          description: 'Adjacent culinary space and breakfast bar'
        },
        {
          id: 'h-liv-bed',
          targetRoomId: 'master-bedroom',
          label: 'Walk to Master Suite',
          roomName: 'Master Sanctuary',
          icon: 'bed',
          position: { x: 74, y: 52 },
          description: 'Private master bedroom wing'
        },
        {
          id: 'h-liv-balc',
          targetRoomId: 'balcony',
          label: isPenthouse ? 'Step onto Sky Terrace' : 'Step onto Private Patio',
          roomName: isPenthouse ? 'Sky Terrace' : 'Sun Terrace & Pool',
          icon: 'balcony',
          position: { x: 48, y: 48 },
          description: 'Open-air lounge and panoramic horizon'
        },
        {
          id: 'h-liv-ent',
          targetRoomId: 'entrance',
          label: 'Back to Foyer',
          roomName: 'Entrance Foyer',
          icon: 'door',
          position: { x: 10, y: 80 }
        }
      ]
    },
    {
      id: 'kitchen',
      name: 'Gourmet Chef Kitchen & Dining',
      category: 'Kitchen',
      image: kitImg,
      description: 'Monolithic Calacatta marble island, custom Poliform cabinetry, Sub-Zero refrigeration, and wine preservation.',
      floorLevel: 'Level 1',
      hotspots: [
        {
          id: 'h-kit-liv',
          targetRoomId: 'living-room',
          label: 'Return to Living Room',
          roomName: 'Main Living Room',
          icon: 'door',
          position: { x: 75, y: 55 },
          description: 'Great room lounge'
        },
        {
          id: 'h-kit-store',
          targetRoomId: 'store-room',
          label: 'Enter Walk-in Pantry & Store',
          roomName: 'Walk-in Store Room',
          icon: 'box',
          position: { x: 20, y: 55 },
          description: 'Pantry storage & wine gallery'
        },
        {
          id: 'h-kit-balc',
          targetRoomId: 'balcony',
          label: 'To Outdoor Dining Terrace',
          roomName: 'Terrace & Lounge',
          icon: 'balcony',
          position: { x: 48, y: 46 }
        }
      ]
    },
    {
      id: 'master-bedroom',
      name: 'Master Sanctuary Suite',
      category: 'Master Bedroom',
      image: bedImg,
      description: 'A serene haven featuring motorized acoustic sheer drapery, custom headboard millwork, and private sunset orientation.',
      floorLevel: 'Level 2 / Wing',
      hotspots: [
        {
          id: 'h-bed-bath',
          targetRoomId: 'bathroom',
          label: 'Enter Ensuite Spa Bathroom',
          roomName: 'Luxury Spa Bath',
          icon: 'bath',
          position: { x: 78, y: 56 },
          description: 'Freestanding soaking tub & rainfall shower'
        },
        {
          id: 'h-bed-balc',
          targetRoomId: 'balcony',
          label: 'Step onto Master Balcony',
          roomName: 'Terrace & Lounge',
          icon: 'balcony',
          position: { x: 25, y: 50 },
          description: 'Private morning coffee deck'
        },
        {
          id: 'h-bed-liv',
          targetRoomId: 'living-room',
          label: 'Back to Living Room',
          roomName: 'Main Living Room',
          icon: 'door',
          position: { x: 12, y: 80 }
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'Ensuite Marble Spa Bathroom',
      category: 'Bathroom',
      image: bathImg,
      description: 'Heated stone flooring, bookmatched marble vanities, matte black Dornbracht fixtures, and dual rainfall thermostatic shower.',
      floorLevel: 'Level 2 / Wing',
      hotspots: [
        {
          id: 'h-bath-bed',
          targetRoomId: 'master-bedroom',
          label: 'Back to Master Suite',
          roomName: 'Master Bedroom',
          icon: 'bed',
          position: { x: 35, y: 65 },
          description: 'Return to bedroom wing'
        },
        {
          id: 'h-bath-liv',
          targetRoomId: 'living-room',
          label: 'To Living Room',
          roomName: 'Main Living Room',
          icon: 'door',
          position: { x: 75, y: 70 }
        }
      ]
    },
    {
      id: 'store-room',
      name: 'Walk-in Store Room & Wine Cellar',
      category: 'Store Room',
      image: storeImg,
      description: 'Climate-controlled architectural storage with custom oak shelving, sommelier wine racks, and utility management.',
      floorLevel: 'Level 1',
      hotspots: [
        {
          id: 'h-store-kit',
          targetRoomId: 'kitchen',
          label: 'Return to Chef Kitchen',
          roomName: 'Gourmet Kitchen',
          icon: 'kitchen',
          position: { x: 50, y: 68 },
          description: 'Back to main culinary area'
        }
      ]
    },
    {
      id: 'balcony',
      name: isPenthouse ? 'Skyline Rooftop Terrace & Spa' : 'Private Sunset Terrace & Grounds',
      category: 'Balcony',
      image: balcImg,
      description: 'Frameless glass balustrades, integrated heating, outdoor kitchen bar, and panoramic horizon vistas.',
      floorLevel: isPenthouse ? 'Rooftop Level' : 'Outdoor Grounds',
      hotspots: [
        {
          id: 'h-balc-liv',
          targetRoomId: 'living-room',
          label: 'Enter Living Room',
          roomName: 'Main Living Room',
          icon: 'door',
          position: { x: 30, y: 62 },
          description: 'Step inside'
        },
        {
          id: 'h-balc-bed',
          targetRoomId: 'master-bedroom',
          label: 'Enter Master Suite',
          roomName: 'Master Bedroom',
          icon: 'bed',
          position: { x: 70, y: 60 },
          description: 'Return to bedroom'
        },
        {
          id: 'h-balc-ext',
          targetRoomId: 'exterior',
          label: 'View Exterior Facade',
          roomName: 'Exterior View',
          icon: 'arrow',
          position: { x: 12, y: 82 }
        }
      ]
    }
  ];
}
