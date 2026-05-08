
"use client"

import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Place } from '@/lib/mock-data';
import { AlertCircle } from 'lucide-react';

interface InteractiveMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onPlaceSelect: (place: Place) => void;
  mode: 'tourist' | 'hidden';
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

const mapOptions = {
  disableDefaultUI: true,
  styles: [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#fdf8f4" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#e0e0e0" }]
    },
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#444444" }]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{ "color": "#fdf8f4" }]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    }
  ]
};

export function InteractiveMap({ places, selectedPlace, onPlaceSelect, mode }: InteractiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map && places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (typeof place.lat === 'number' && typeof place.lng === 'number') {
          bounds.extend({ lat: place.lat, lng: place.lng });
        }
      });
      map.fitBounds(bounds);
    }
  }, [map, places]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-secondary/20 flex flex-col items-center justify-center p-8 text-center gap-4">
        <AlertCircle className="w-8 h-8 text-amber-600 opacity-50" />
        <div className="max-w-xs">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">Map API Key Required</p>
          <p className="text-xs text-muted-foreground">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable the interactive map.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full bg-secondary/20 flex flex-col items-center justify-center p-8 text-center gap-4">
        <AlertCircle className="w-8 h-8 text-destructive opacity-50" />
        <div className="max-w-xs">
          <p className="text-[10px] font-bold tracking-widest uppercase text-destructive opacity-60 mb-2">Map Load Error</p>
          <p className="text-xs text-muted-foreground">There was an issue loading Google Maps. Please verify your API key and billing settings.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) return (
    <div className="w-full h-full bg-secondary/20 flex items-center justify-center animate-pulse">
      <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Loading Map Intelligence...</span>
    </div>
  );

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPlace ? { lat: selectedPlace.lat, lng: selectedPlace.lng } : defaultCenter}
        zoom={selectedPlace ? 12 : 5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {places.map((place) => (
          <Marker
            key={place.id || `${place.lat}-${place.lng}`}
            position={{ lat: Number(place.lat), lng: Number(place.lng) }}
            onClick={() => onPlaceSelect(place)}
            icon={{
              path: typeof google !== 'undefined' ? google.maps.SymbolPath.CIRCLE : 0,
              scale: selectedPlace?.id === place.id ? 10 : 7,
              fillColor: mode === 'hidden' ? '#1a2e1a' : '#ea580c',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }}
          />
        ))}
      </GoogleMap>

      <div className="absolute bottom-48 left-8 pointer-events-none hidden lg:block z-20">
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-xl border border-white/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-600" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tourist Favorites</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Local Hidden Gems</span>
          </div>
        </div>
      </div>
    </div>
  );
}
