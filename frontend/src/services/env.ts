import Constants from 'expo-constants';

// Read from Expo public env first, fallback to hardcoded keys only for this demo session.
// In production, never hardcode keys. Use secure storage, proxy, or server-side.

export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYXNod2ludCIsImEiOiJjbWdkZDBwN2sxZGdmMmxzaDlsZW9xbHZvIn0.XWAZbplfKL5_GsDGvylihg';
export const PEXELS_KEY = process.env.EXPO_PUBLIC_PEXELS_KEY || 'rg1dOxqCGw67psNVQuQE2MJZS8tHNCqoGEHnIFO3YfEZsbbEPwj2Al2B';
export const UNSPLASH_KEYS = (
  process.env.EXPO_PUBLIC_UNSPLASH_KEYS || 'o8RoWn3S_PJ6OZVcdBmGMTjnCfpMmhgFeiQsurXMlAk,apEKA5MCxFXKCW0mB54MBnaqyUpeof87J-ihPTG4afs'
).split(',');
export const FLATICON_KEY = process.env.EXPO_PUBLIC_FLATICON_KEY || 'FPSX687524b1b3c53ca6716f91737c5125b0';

export const BACKEND_BASE = process.env.EXPO_PUBLIC_BACKEND_URL || '';