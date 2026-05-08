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
      {/* Abstract Map Grid Pattern - Very Subtle */}
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #5D4037 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      
      {/* Warm Premium Glowing Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/20 blur-[150px] rounded-full animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/5 blur-[200px] rounded-full animate-pulse delay-1000 duration-[10000ms]" />

      {/* Abstract India Background Text - Decorative */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <h2 className="text-[30vw] font-headline font-bold text-primary uppercase tracking-tighter">India</h2>
      </div>

      {/* Markers */}
      <div className="absolute inset-0">
        {places.map((place) => {
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
                  <div className="absolute -inset-6 bg-accent/10 rounded-full animate-ping duration-[3000ms]" />
                )}
                
                <div className={cn(
                  "relative bg-white border-2 rounded-full p-2 md:p-3 shadow-2xl transition-all duration-500",
                  isSelected ? "border-accent scale-110 shadow-accent/20" : "border-primary/10 group-hover:border-accent group-hover:shadow-lg"
                )}>
                  <MapPin className={cn(
                    "w-5 h-5 md:w-6 md:h-6 transition-colors",
                    isSelected ? "text-accent fill-accent/20" : "text-primary/30 group-hover:text-accent"
                  )} />
                </div>

                <div className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary/5 shadow-xl whitespace-nowrap text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-primary transition-all duration-500",
                  isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                )}>
                  {place.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend - Soft Premium Style */}
      <div className="absolute bottom-48 left-10 pointer-events-none hidden lg:block">
        <div className="glass px-7 py-5 rounded-[2rem] flex flex-col gap-3 border-white/60">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Tourist Mainstays</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">Hidden Sanctuaries</span>
          </div>
        </div>
      </div>
    </div>
  );
}