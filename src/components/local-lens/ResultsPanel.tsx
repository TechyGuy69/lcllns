
"use client"

import React, { useRef, useEffect } from 'react';
import { Place } from '@/lib/mock-data';
import { PlaceCard } from './PlaceCard';
import { ChevronUp, ChevronDown, Sparkles, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  places: Place[];
  mode: 'tourist' | 'hidden';
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  onPlaceClick: (place: Place) => void;
}

export function ResultsPanel({ places, mode, isExpanded, setIsExpanded, onPlaceClick }: ResultsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [places]);

  return (
    <div 
      className={cn(
        "absolute left-0 right-0 bottom-0 z-40 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)",
        isExpanded ? "h-[85%] md:h-[80%]" : "h-[90px] md:h-[120px]"
      )}
    >
      <div className="bg-white/95 backdrop-blur-3xl rounded-t-[2.5rem] md:rounded-t-[3rem] border-t border-white/60 h-full flex flex-col shadow-[0_-20px_100px_-20px_rgba(0,0,0,0.1)]">
        {/* Trigger Handle */}
        <div 
          className="flex flex-col items-center justify-center py-3 md:py-6 cursor-pointer hover:bg-black/[0.02] transition-colors rounded-t-[2.5rem] md:rounded-t-[3rem] shrink-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-8 h-1 md:w-10 md:h-1 bg-muted/40 rounded-full mb-2 md:mb-4" />
          <div className="flex items-center gap-2 md:gap-3 text-[7px] md:text-[9px] font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-muted-foreground/80">
            {mode === 'hidden' ? <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-accent" /> : <Compass className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary" />}
            {places.length} CURATED SPOTS
            {isExpanded ? <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 ml-1" /> : <ChevronUp className="w-3 h-3 md:w-3.5 md:h-3.5 ml-1" />}
          </div>
        </div>

        {/* Results Container */}
        <div 
          ref={panelRef}
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 pb-16 transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Mode Context Heading */}
          {places.length > 0 && (
            <div className="mb-6 md:mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
              <h2 className="text-xl md:text-3xl font-headline font-bold text-primary">
                {mode === 'hidden' ? 'Showing Hidden Gems near you 🌿' : 'Popular Tourist Spots 🧳'}
              </h2>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1 opacity-70">
                {mode === 'hidden' ? 'Authentic experiences away from the crowds' : 'Must-see landmarks and trending destinations'}
              </p>
            </div>
          )}

          {places.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-60">
              <div className="bg-secondary/20 p-6 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xl md:text-2xl font-headline font-bold text-primary mb-2">Finding more magic...</p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-widest">
                No {mode === 'hidden' ? 'hidden gems' : 'spots'} found. Try a different search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 py-2 md:py-4">
              {places.map((place) => (
                <PlaceCard 
                  key={place.id} 
                  place={place} 
                  onClick={() => onPlaceClick(place)}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
