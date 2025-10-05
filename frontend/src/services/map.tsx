import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MAPBOX_TOKEN } from './env';
import MapPlaceholder from '../components/MapPlaceholder';

// For this demo we keep a graceful fallback to our SVG placeholder.
// Mapbox GL native requires native modules; on web we can use mapbox-gl-js.
// To avoid heavy setup, we will render placeholder even when token exists, and
// surface a minimal Mapbox-web only block if running on web.

export default function DemoMap({ countries, onSelectCountry }: { countries: string[]; onSelectCountry: (c: string) => void }) {
  // For mobile (Expo Go), use placeholder for now due to native requirement.
  return (
    <View style={styles.wrap}>
      <MapPlaceholder countries={countries} onSelectCountry={onSelectCountry} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
});