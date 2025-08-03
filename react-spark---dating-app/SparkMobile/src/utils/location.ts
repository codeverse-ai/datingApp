import type { Location } from '../types';

// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 3958.8; // Radius of the Earth in miles
  const rlat1 = loc1.lat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = loc2.lat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (lat)
  const difflon = (loc2.lon - loc1.lon) * (Math.PI / 180); // Radian difference (lon)

  const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  return d;
}
