"use client"

import React, { useState, useEffect } from 'react';
import { Place } from '@/lib/mock-data';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onPlaceSelect: (place: Place) => void;
}

export function InteractiveMap({ places, selectedPlace, onPlaceSelect }: InteractiveMapProps) {
  // We use a mock map background image and absolute positioned markers
  // to simulate a real map experience without heavy libraries for a demo.
  
  return (
    <div className="relative w-full h-full bg-[#0a0c10] overflow-hidden">
      {/* Abstract Map Grid Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #2E5CA6 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Animated Glowing Elements */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 blur-[120px] rounded-full animate-pulse delay-700" />

      {/* Mock India Shape or Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
        <h2 className="text-[20vw] font-headline font-bold text-white uppercase tracking-tighter">India</h2>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {places.map((place) => {
          // Normalize coordinates to percentage for visual placement on mock map
          // India approx bounds: 8N to 37N, 68E to 97E
          const x = ((place.lng - 68) / (97 - 68)) * 80 + 10;
          const y = (1 - (place.lat - 8) / (37 - 8)) * 80 + 10;

          const isSelected = selectedPlace?.id === place.id;

          return (
            <button
              key={place.id}
              onClick={() => onPlaceSelect(place)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-500",
                "hover:scale-125 focus:outline-none group",
                isSelected ? "z-30 scale-150" : "z-10"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                {/* Ripple Effect */}
                {isSelected && (
                  <>
                    <div className="absolute -inset-4 bg-accent/20 rounded-full animate-ping" />
                    <div className="absolute -inset-2 bg-accent/30 rounded-full animate-pulse" />
                  </>
                )}
                
                <div className={cn(
                  "relative bg-background border-2 rounded-full p-1.5 shadow-xl transition-colors",
                  isSelected ? "border-accent" : "border-primary group-hover:border-accent"
                )}>
                  <MapPin className={cn(
                    "w-4 h-4 transition-colors",
                    isSelected ? "text-accent fill-accent/20" : "text-primary group-hover:text-accent"
                  )} />
                </div>

                {/* Marker Label */}
                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-background/80 backdrop-blur-md border border-white/10 whitespace-nowrap text-[10px] font-bold tracking-widest uppercase transition-opacity duration-300",
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {place.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Overlay controls or attribution */}
      <div className="absolute bottom-32 left-6 pointer-events-none">
        <div className="glass px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Tourist Favs
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            Hidden Gems
          </div>
        </div>
      </div>
    </div>
  );
}
