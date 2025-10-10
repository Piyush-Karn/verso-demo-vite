import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export const InteractiveMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxFailed, setMapboxFailed] = useState(false);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.error("Mapbox token is missing. Falling back...");
      setMapboxFailed(true);
      return;
    }
    
    if (map.current || !mapContainer.current) return; // Initialize map only once

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme for the map
      projection: { name: 'globe' }, // This creates the earth view
      zoom: 0.5,
      center: [139, 35], // Start centered around Japan
    });

    map.current.on('style.load', () => {
      if (map.current) {
        // Add a sky layer to create the star effect
        map.current.setFog({
          color: 'rgb(3, 7, 18)', // Dark blue
          'high-color': 'rgb(29, 78, 216)', // Blue horizon
          'horizon-blend': 0.02,
          'space-color': 'rgb(17, 24, 39)', // Starry sky color
          'star-intensity': 0.25 // Star intensity
        });
      }
    });

    map.current.on('error', () => {
      console.error("Mapbox failed to load. Falling back to Geoapify.");
      setMapboxFailed(true);
    });

  }, []);

  if (mapboxFailed) {
    const geoapifyUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:0,0&zoom=1&apiKey=${GEOAPIFY_KEY}`;
    return (
      <div className="flex justify-center py-4 px-4">
        <img 
          src={geoapifyUrl} 
          alt="Static world map" 
          className="w-full h-48 rounded-2xl object-cover" 
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4 px-4">
      <div 
        ref={mapContainer} 
        className="w-full h-48 rounded-2xl" 
      />
    </div>
  );
};