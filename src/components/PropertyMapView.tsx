import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Eye, 
  Calendar, 
  Heart, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Home, 
  Building, 
  Trees, 
  Maximize, 
  BedDouble, 
  Bath, 
  SlidersHorizontal,
  X,
  Sparkles,
  Footprints
} from 'lucide-react';
import { Property, PropertyCategory, UserProfile } from '../types';
import { geocodeAddress, normalizeCoordinates, Coordinates } from '../utils/geocoding';

interface PropertyMapViewProps {
  properties: Property[];
  currentUser: UserProfile | null;
  savedPropertyIds: string[];
  selectedCategory: 'All' | PropertyCategory;
  onSelectCategory: (cat: 'All' | PropertyCategory) => void;
  onToggleSave: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onStartVirtualTour?: (property: Property) => void;
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  currentUser,
  savedPropertyIds,
  selectedCategory,
  onSelectCategory,
  onToggleSave,
  onSelectProperty,
  onBookViewing,
  onStartVirtualTour,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedPropertyOnMap, setSelectedPropertyOnMap] = useState<Property | null>(null);
  const [mapTheme, setMapTheme] = useState<'street' | 'satellite'>('street');
  const [resolvedCoordinates, setResolvedCoordinates] = useState<Record<string, Coordinates>>({});

  useEffect(() => {
    let cancelled = false;
    const missing = properties.filter((property) => !normalizeCoordinates(property));
    if (missing.length === 0) return;

    const resolveLegacyListings = async () => {
      const updates: Record<string, Coordinates> = {};
      // Resolve sequentially to be courteous to the free geocoding service.
      for (const property of missing) {
        if (cancelled) return;
        try {
          const result = await geocodeAddress(property.address || property.location);
          if (result) updates[property.id] = result;
        } catch (error) {
          console.warn(`Unable to locate ${property.title}`, error);
        }
      }
      if (!cancelled && Object.keys(updates).length) {
        setResolvedCoordinates((current) => ({ ...current, ...updates }));
      }
    };
    void resolveLegacyListings();
    return () => { cancelled = true; };
  }, [properties]);

  // Filter properties with valid lat/lng and matching category
  const validProperties = useMemo(() => properties.flatMap((p) => {
    const coordinates = normalizeCoordinates(p) || resolvedCoordinates[p.id];
    if (!coordinates || (selectedCategory !== 'All' && p.category !== selectedCategory)) return [];
    return [{ ...p, ...coordinates }];
  }), [properties, resolvedCoordinates, selectedCategory]);

  // Tile layers
  const tileLayers = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri and contributors',
      maxZoom: 19,
    },
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Cleanup previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center California / Western US
    const defaultCenter: [number, number] = [36.5, -119.8];
    const defaultZoom = 6;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
      attributionControl: true,
    });

    map.attributionControl.setPrefix(false);
    const layer = tileLayers[mapTheme];

    L.tileLayer(layer.url, {
      maxZoom: layer.maxZoom,
      attribution: layer.attribution,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapTheme]);

  // Update Markers when properties or category changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (validProperties.length === 0) return;

    const bounds = L.latLngBounds([]);

    validProperties.forEach((property) => {
      if (property.lat === undefined || property.lng === undefined) return;

      const isSelected = selectedPropertyOnMap?.id === property.id;
      const formattedPrice = property.price >= 1000000 
        ? `$${(property.price / 1000000).toFixed(1)}M` 
        : `$${(property.price / 1000).toFixed(0)}k`;

      // Custom Luxury Champagne & Charcoal Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 5px;
            background: ${isSelected ? 'linear-gradient(135deg, #dfc5a4, #c8a97e)' : '#12141a'};
            color: ${isSelected ? '#0c0d10' : '#f5ebd9'};
            padding: 5px 12px;
            border-radius: 9999px;
            border: 2px solid ${isSelected ? '#ffffff' : '#c8a97e'};
            box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.85);
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
            cursor: pointer;
            transform: scale(${isSelected ? '1.18' : '1.0'});
            transition: all 0.25s ease;
          ">
            <span style="font-size: 10px;">${property.category === 'Plot' ? '🌳' : property.category === 'Apartment' ? '🏢' : '🏡'}</span>
            <span>${formattedPrice}</span>
          </div>
        `,
        iconSize: [64, 30],
        iconAnchor: [32, 15],
      });

      const marker = L.marker([property.lat, property.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPropertyOnMap(property);
        map.setView([property.lat!, property.lng!], Math.max(map.getZoom(), 11), {
          animate: true,
          duration: 0.8,
        });
      });

      markersGroup.addLayer(marker);
      bounds.extend([property.lat, property.lng]);
    });

    if (validProperties.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [validProperties, selectedPropertyOnMap, mapTheme]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    if (validProperties.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(validProperties.map((p) => [p.lat!, p.lng!]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
    setSelectedPropertyOnMap(null);
  };

  return (
    <div className="relative w-full h-[72svh] min-h-[520px] sm:h-[680px] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/15 shadow-2xl bg-[#0c0d10] flex flex-col">
      
      {/* Map Header Floating Overlay Controls */}
      <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 z-20 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 sm:gap-3 pointer-events-none">
        
        {/* Category Filters Pill */}
        <div className="pointer-events-auto flex items-center justify-between gap-0.5 p-1 bg-[#0c0d10]/90 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl overflow-x-auto max-w-full">
          {(['All', 'House', 'Apartment', 'Plot'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`min-h-10 px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-[#0c0d10] shadow-md shadow-[#c8a97e]/20'
                    : 'text-stone-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat === 'All' ? 'All Pins' : cat}
              </button>
            );
          })}
        </div>

        {/* Map Style & View Control Buttons */}
        <div className="pointer-events-auto flex items-center justify-between sm:justify-end gap-2.5">
          {/* Map Style Switcher */}
          <div className="flex items-center bg-[#0c0d10]/90 backdrop-blur-xl border border-white/15 rounded-full p-1 shadow-2xl text-xs">
            <button
              onClick={() => setMapTheme('street')}
              className={`min-h-9 px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                mapTheme === 'street' ? 'bg-white/20 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapTheme('satellite')}
              className={`min-h-9 px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                mapTheme === 'satellite' ? 'bg-white/20 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Zoom In/Out & Reset */}
          <div className="flex items-center gap-1 bg-[#0c0d10]/90 backdrop-blur-xl border border-white/15 rounded-full p-1 shadow-2xl">
            <button
              onClick={handleZoomIn}
              className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Fit to All Properties"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Selected Property Floating Bottom Preview Card */}
      {selectedPropertyOnMap && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#12141a]/95 backdrop-blur-2xl border border-[#c8a97e]/30 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/90 flex flex-col gap-4 relative">
            
            {/* Close Selected Pin Card */}
            <button
              onClick={() => setSelectedPropertyOnMap(null)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedPropertyOnMap.images[0]}
                alt={selectedPropertyOnMap.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-white/10"
              />
              
              <div className="space-y-1.5 pr-6 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0c0d10] text-[#dfc5a4] border border-[#c8a97e]/30">
                    {selectedPropertyOnMap.category}
                  </span>
                  {selectedPropertyOnMap.featured && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-[#dfc5a4]" />
                      Featured
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-white text-sm truncate">
                  {selectedPropertyOnMap.title}
                </h4>

                <div className="flex items-center gap-1 text-xs text-stone-400 truncate">
                  <MapPin className="w-3 h-3 text-[#c8a97e] shrink-0" />
                  <span className="truncate">{selectedPropertyOnMap.address || selectedPropertyOnMap.location}</span>
                </div>

                <p className="font-serif font-bold text-base text-[#dfc5a4]">
                  ${selectedPropertyOnMap.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Quick Specs & Actions */}
            <div className={`grid ${onStartVirtualTour ? 'grid-cols-3' : 'grid-cols-2'} gap-2 pt-2 border-t border-white/10`}>
              <button
                onClick={() => onSelectProperty(selectedPropertyOnMap)}
                className="py-2.5 px-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
              {onStartVirtualTour && (
                <button
                  onClick={() => onStartVirtualTour(selectedPropertyOnMap)}
                  className="py-2.5 px-2 rounded-full bg-[#0c0d10] hover:bg-[#1a1d26] border border-[#c8a97e]/60 text-xs font-bold text-[#dfc5a4] flex items-center justify-center gap-1 transition-all cursor-pointer shadow"
                >
                  <Footprints className="w-3.5 h-3.5 text-[#dfc5a4]" />
                  <span>3D Tour</span>
                </button>
              )}
              <button
                onClick={() => onBookViewing(selectedPropertyOnMap)}
                className="py-2.5 px-2 rounded-full bg-gradient-to-r from-[#dfc5a4] to-[#c8a97e] text-xs font-semibold text-[#0c0d10] font-bold shadow-lg shadow-[#c8a97e]/20 flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Visit</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Info Pill at Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-[#0c0d10]/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 text-[11px] text-stone-400 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#c8a97e] animate-pulse" />
        <span>Showing {validProperties.length} active locations</span>
      </div>

    </div>
  );
};
