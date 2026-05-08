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
      {/* Subtle Map Grid */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      
      {/* India Background Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <h2 className="text-[20vw] font-headline font-bold text-primary uppercase tracking-tighter">Bharat</h2>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {places.map((place) => {
          // Heuristic coordinate mapping for demo purposes
          const x = ((place.lng - 68) / (97 - 68)) * 70 + 15;
          const y = (1 - (place.lat - 8) / (37 - 8)) * 70 + 15;
          const isSelected = selectedPlace?.id === place.id;

          return (
            <button
              key={place.id}
              onClick={() => onPlaceSelect(place)}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 p-2 transition-all duration-500",
                "hover:scale-110 focus:outline-none group",
                isSelected ? "z-30 scale-125" : "z-10"
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="relative">
                <div className={cn(
                  "relative bg-white border-2 rounded-full p-2.5 md:p-3.5 shadow-xl transition-all duration-300",
                  isSelected ? "border-accent scale-110 shadow-accent/20" : "border-primary/5 group-hover:border-accent/40"
                )}>
                  <MapPin className={cn(
                    "w-5 h-5 md:w-6 md:h-6 transition-colors",
                    isSelected ? "text-accent fill-accent/20" : "text-primary/30 group-hover:text-accent"
                  )} />
                </div>

                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2 rounded-full bg-white shadow-xl border border-border/50 whitespace-nowrap text-[9px] md:text-[10px] font-bold tracking-widest text-primary uppercase transition-all duration-500",
                  isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                )}>
                  {place.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-48 left-8 pointer-events-none hidden lg:block">
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-[2rem] shadow-xl border border-white/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
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