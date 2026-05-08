"use client"

import React, { useRef, useEffect } from 'react';
import { Place } from '@/lib/mock-data';
import { PlaceCard } from './PlaceCard';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  places: Place[];
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  onPlaceClick: (place: Place) => void;
}

export function ResultsPanel({ places, isExpanded, setIsExpanded, onPlaceClick }: ResultsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [places]);

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 bottom-0 z-40 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)",
        isExpanded ? "h-[85vh]" : "h-[140px] md:h-[180px]"
      )}
    >
      <div className="bg-white/95 backdrop-blur-3xl rounded-t-[3rem] border-t border-white/60 h-full flex flex-col shadow-[0_-20px_100px_-20px_rgba(0,0,0,0.1)]">
        {/* Trigger Handle */}
        <div 
          className="flex flex-col items-center justify-center py-4 md:py-6 cursor-pointer hover:bg-black/[0.02] transition-colors rounded-t-[3rem] shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-10 h-1 bg-muted/40 rounded-full mb-4" />
          <div className="flex items-center gap-3 text-[9px] font-bold tracking-[0.25em] uppercase text-muted-foreground/80">
            <Sparkles className="w-3 h-3 text-accent" />
            {places.length} CURATED SPOTS
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
          </div>
        </div>

        {/* Results Grid */}
        <div 
          ref={panelRef}
          className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 pb-16"
        >
          {places.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
              <p className="text-xl font-headline font-bold text-primary mb-2">Finding more magic...</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 py-4">
              {places.map((place) => (
                <PlaceCard 
                  key={place.id} 
                  place={place} 
                  onClick={() => onPlaceClick(place)}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}