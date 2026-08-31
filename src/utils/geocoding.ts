import { Property } from '../types';

export interface Coordinates {
  lat: number;
  lng: number;
}

const isCoordinate = (value: unknown, min: number, max: number): value is number => {
  const number = typeof value === 'string' ? Number.parseFloat(value) : value;
  return typeof number === 'number' && Number.isFinite(number) && number >= min && number <= max;
};

export const normalizeCoordinates = (
  property: Pick<Property, 'lat' | 'lng'>,
): Coordinates | null => {
  if (!isCoordinate(property.lat, -90, 90) || !isCoordinate(property.lng, -180, 180)) {
    return null;
  }
  return { lat: Number(property.lat), lng: Number(property.lng) };
};

export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  const query = address.trim();
  if (!query) return null;

  const cacheKey = `homevia_geocode_${query.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Coordinates;
  } catch {
    // Storage can be disabled; geocoding still works without the cache.
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) throw new Error(`Geocoding failed with status ${response.status}`);

  const [match] = (await response.json()) as Array<{ lat: string; lon: string }>;
  if (!match || !isCoordinate(match.lat, -90, 90) || !isCoordinate(match.lon, -180, 180)) {
    return null;
  }

  const coordinates = { lat: Number(match.lat), lng: Number(match.lon) };
  try {
    localStorage.setItem(cacheKey, JSON.stringify(coordinates));
  } catch {
    // Ignore storage quota/privacy mode errors.
  }
  return coordinates;
};
