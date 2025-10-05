import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import MapPlaceholder from '../components/MapPlaceholder';
import { MAPBOX_TOKEN } from './env';

let mapboxgl: any = null;
if (Platform.OS === 'web') {
  mapboxgl = require('mapbox-gl');
}

export type MapHandle = { flyToCountry: (name: string) => void };

const countryCoords: Record<string, [number, number]> = {
  Japan: [139.6917, 35.6895],
  Bali: [115.1889, -8.4095],
  Goa: [73.7997, 15.2993],
};

const DemoMap = React.forwardRef<MapHandle, { countries: string[]; onSelectCountry: (c: string) => void }>(
  ({ countries, onSelectCountry }, ref) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      flyToCountry: (name: string) => {
        if (Platform.OS === 'web' && mapInstance.current && countryCoords[name]) {
          const [lng, lat] = countryCoords[name];
          mapInstance.current.flyTo({ center: [lng, lat], zoom: 3.5 });
        }
      },
    }));

    useEffect(() => {
      if (Platform.OS !== 'web') return;
      if (!mapRef.current || mapInstance.current) return;
      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const style = 'mapbox://styles/mapbox/streets-v12';
        const map = new mapboxgl.Map({ container: mapRef.current, style, center: [80, 20], zoom: 1.4 });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
        map.on('load', () => {
          Object.entries(countryCoords).forEach(([name, [lng, lat]]) => {
            if (!countries.includes(name)) return;
            const el = document.createElement('div');
            el.style.width = '12px'; el.style.height = '12px'; el.style.borderRadius = '999px'; el.style.background = '#e6e1d9'; el.style.boxShadow = '0 0 0 4px rgba(230,225,217,0.25)'; el.style.cursor = 'pointer';
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
);

export default DemoMap;

export type CitiesMapHandle = { flyToCity: (name: string) => void; flyToLngLat: (lng: number, lat: number, zoom?: number) => void };

export const CitiesMap = React.forwardRef<CitiesMapHandle, { points: Array<{ name: string; lng: number; lat: number }>; onSelect: (name: string) => void }>(
  ({ points, onSelect }, ref) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const inst = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      flyToCity: (name: string) => {
        if (Platform.OS === 'web' && inst.current) {
          const p = points.find((x) => x.name === name);
          if (p) inst.current.flyTo({ center: [p.lng, p.lat], zoom: 6 });
        }
      },
      flyToLngLat: (lng: number, lat: number, zoom: number = 3.5) => {
        if (Platform.OS === 'web' && inst.current) inst.current.flyTo({ center: [lng, lat], zoom });
      }
    }));

    useEffect(() => {
      if (Platform.OS !== 'web') return;
      if (!divRef.current || inst.current) return;
      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        const style = 'mapbox://styles/mapbox/streets-v12';
        const map = new mapboxgl.Map({ container: divRef.current, style, center: [80, 10], zoom: 2.2 });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
        map.on('load', () => {
          points.forEach((p) => {
            const el = document.createElement('div');
            el.style.width = '12px'; el.style.height = '12px'; el.style.borderRadius = '999px'; el.style.background = '#e6e1d9'; el.style.boxShadow = '0 0 0 4px rgba(230,225,217,0.25)'; el.style.cursor = 'pointer';
            el.onclick = () => { map.flyTo({ center: [p.lng, p.lat], zoom: 6 }); onSelect(p.name); };
            new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).addTo(map);
          });
        });
        inst.current = map;
      } catch (e) { /* no-op */ }
    }, [points, onSelect]);

    if (Platform.OS === 'web') return <View style={styles.webMap} ref={divRef as any} />;
    return <View style={styles.nativePlaceholder} />;
  }
);

const styles = StyleSheet.create({
  webMap: { width: '92%', height: 220, borderRadius: 16, overflow: 'hidden' },
  wrap: { width: '100%', alignItems: 'center' },
  nativePlaceholder: { width: '92%', height: 220, borderRadius: 16, backgroundColor: '#111' },
});