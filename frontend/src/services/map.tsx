import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import MapPlaceholder from '../components/MapPlaceholder';
import { MAPBOX_TOKEN } from './env';

let mapboxgl: any = null;
if (Platform.OS === 'web') {
  mapboxgl = require('mapbox-gl');
}

export default function DemoMap({ countries, onSelectCountry }: { countries: string[]; onSelectCountry: (c: string) => void }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!mapRef.current || mapInstance.current) return;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      const style = 'mapbox://styles/mapbox/light-v11';
      const map = new mapboxgl.Map({ container: mapRef.current, style, center: [80, 20], zoom: 1.4 });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
      const coords: Record<string, [number, number]> = { Japan: [139.6917, 35.6895], Bali: [115.1889, -8.4095], Goa: [73.7997, 15.2993] };
      map.on('load', () => {
        Object.entries(coords).forEach(([name, [lng, lat]]) => {
          if (!countries.includes(name)) return;
          const el = document.createElement('div');
          el.style.width = '10px'; el.style.height = '10px'; el.style.borderRadius = '999px'; el.style.background = '#e6e1d9'; el.style.cursor = 'pointer';
          el.onclick = () => { map.flyTo({ center: [lng, lat], zoom: 3.5 }); onSelectCountry(name); };
          new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
        });
      });
      mapInstance.current = map;
    } catch (e) { /* no-op */ }
  }, [countries, onSelectCountry]);

  if (Platform.OS === 'web') return <View style={styles.webMap} ref={mapRef as any} />;
  return (
    <View style={styles.wrap}>
      <MapPlaceholder countries={countries} onSelectCountry={onSelectCountry} />
    </View>
  );
}

export function CitiesMap({ points, onSelect }: { points: Array<{ name: string; lng: number; lat: number }>; onSelect: (name: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inst = useRef<any>(null);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!ref.current || inst.current) return;
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      const style = 'mapbox://styles/mapbox/light-v11';
      const map = new mapboxgl.Map({ container: ref.current, style, center: [80, 10], zoom: 2.2 });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
      map.on('load', () => {
        points.forEach((p) => {
          const el = document.createElement('div');
          el.style.width = '10px'; el.style.height = '10px'; el.style.borderRadius = '999px'; el.style.background = '#e6e1d9'; el.style.cursor = 'pointer';
          el.onclick = () => { map.flyTo({ center: [p.lng, p.lat], zoom: 6 }); onSelect(p.name); };
          new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).addTo(map);
        });
      });
      inst.current = map;
    } catch (e) { /* no-op */ }
  }, [points, onSelect]);

  if (Platform.OS === 'web') return <View style={styles.webMap} ref={ref as any} />;
  // native fallback could be the placeholder; for simplicity show nothing extra here
  return <View style={styles.wrap}><View style={styles.nativePlaceholder} /></View>;
}

const styles = StyleSheet.create({
  webMap: { width: '92%', height: 200, borderRadius: 16, overflow: 'hidden' },
  wrap: { width: '100%', alignItems: 'center' },
  nativePlaceholder: { width: '92%', height: 200, borderRadius: 16, backgroundColor: '#111' },
});