import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { MapboxError } from 'mapbox-gl';
import { COUNTRY_COORDS } from '../services/geo';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

interface InteractiveMapProps {
  selectedCountry: string | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedCountry }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current || !MAPBOX_TOKEN) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        projection: { name: 'globe' },
        zoom: 1.5,
        center: [90, 28],
        attributionControl: false
      });

      map.current.on('style.load', () => {
        if (map.current) {
          map.current.setFog({
            color: 'rgb(220, 230, 240)',
            'high-color': 'rgb(120, 150, 200)',
            'horizon-blend': 0.05,
            'space-color': 'rgb(15, 20, 35)',
            'star-intensity': 0.5
          });
        }
      });

      map.current.on('error', (e: { error: MapboxError }) => {
        setMapError(e.error?.message || 'An unknown map error occurred.');
      });
      
    } catch (error) {
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map.');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      const coords = selectedCountry ? COUNTRY_COORDS[selectedCountry] : null;
      map.current.flyTo({
        center: coords ? (coords as [number, number]) : [90, 28],
        zoom: coords ? 4 : 1.5,
        essential: true,
        duration: 2000,
      });
    }
  }, [selectedCountry]);

  return (
    <div className="flex justify-center items-center h-80 w-full px-4 py-2">
      {mapError ? (
        <div className="w-full h-full rounded-2xl bg-gray-900 flex flex-col items-center justify-center text-center p-4">
          <p className="text-red-400 font-semibold">Map Error</p>
          <p className="text-gray-500 text-xs mt-2">{mapError}</p>
        </div>
      ) : MAPBOX_TOKEN ? (
        <div ref={mapContainer} className="w-full h-full rounded-2xl" />
      ) : (
        <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
          <p className="text-gray-500">Mapbox token is missing.</p>
        </div>
      )}
    </div>
  );
};