"use client"

import React, { useRef, useEffect } from 'react';
import { Place } from '@/lib/mock-data';
import { PlaceCard } from './PlaceCard';
import { ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsPanelProps {
  places: Place[];
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  onPlaceClick: (place: Place) => void;
}

export function ResultsPanel({ places, isExpanded, setIsExpanded, onPlaceClick }: ResultsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to top when places change
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [places]);

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 bottom-0 z-40 transition-all duration-500 ease-in-out",
        isExpanded ? "h-[85vh]" : "h-[180px] md:h-[220px]"
      )}
    >
      <div className="glass rounded-t-[2.5rem] h-full flex flex-col">
        {/* Handle / Trigger */}
        <div 
          className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-t-[2.5rem]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-muted rounded-full mb-2" />
          <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {places.length} Discoveries Near You
          </div>
        </div>

        {/* Results Grid/List */}
        <div 
          ref={panelRef}
          className="flex-1 overflow-y-auto no-scrollbar px-6 pb-20"
        >
          {places.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="text-lg">No places found matching your search.</p>
              <p className="text-sm">Try exploring a different city or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
              {places.map((place) => (
                <PlaceCard 
                  key={place.id} 
                  place={place} 
                  onClick={() => onPlaceClick(place)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
