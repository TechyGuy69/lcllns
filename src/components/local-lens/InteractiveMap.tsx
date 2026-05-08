"use client"

import React from 'react';
import { Place } from '@/lib/mock-data';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  onPlaceSelect: (place: Place) => void;
}

export function InteractiveMap({ places, selectedPlace, onPlaceSelect }: InteractiveMapProps) {
  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Abstract Map Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #5D4037 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Warm Glowing Elements */}
      <div className="absolute top-1/4 left-1/3 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-secondary/30 blur-[100px] md:blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/5 blur-[100px] md:blur-[150px] rounded-full animate-pulse delay-700" />

      {/* Abstract India Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04]">
        <h2 className="text-[25vw] md:text-[15vw] font-headline font-bold text-primary uppercase tracking-tighter">India</h2>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {places.map((place) => {
          // Abstracted coordinates for a cleaner visualization map
          const x = ((place.lng - 68) / (97 - 68)) * 80 + 10;
          const y = (1 - (place.lat - 8) / (37 - 8)) * 80 + 10;
          const isSelected = selectedPlace?.id === place.id;

          return (
            <button
              key={place.id}
              onClick={() => onPlaceSelect(place)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-700",
                "hover:scale-125 focus:outline-none group",
                isSelected ? "z-30 scale-125 md:scale-150" : "z-10"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                {isSelected && (
                  <div className="absolute -inset-4 md:-inset-6 bg-accent/10 rounded-full animate-ping duration-[2000ms]" />
                )}
                
                <div className={cn(
                  "relative bg-white border-2 rounded-full p-1.5 md:p-2 shadow-xl transition-all duration-500",
                  isSelected ? "border-accent scale-110" : "border-primary/20 group-hover:border-accent"
                )}>
                  <MapPin className={cn(
                    "w-4 h-4 md:w-5 md:h-5 transition-colors",
                    isSelected ? "text-accent fill-accent/20" : "text-primary/40 group-hover:text-accent"
                  )} />
                </div>

                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2 md:mt-3 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-primary/10 shadow-lg whitespace-nowrap text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-primary transition-all duration-500",
                  isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                )}>
                  {place.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend - Hidden on mobile, shown on md+ */}
      <div className="absolute bottom-40 left-6 pointer-events-none hidden md:block">
        <div className="glass px-5 py-3 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Tourist Favorites</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Local Hidden Gems</span>
          </div>
        </div>
      </div>
    </div>
  );
}