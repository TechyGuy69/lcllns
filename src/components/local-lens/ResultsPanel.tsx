"use client"

import React, { useRef, useEffect } from 'react';
import { Place } from '@/lib/mock-data';
import { PlaceCard } from './PlaceCard';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
        isExpanded ? "h-[85vh] md:h-[85vh]" : "h-[180px] md:h-[240px]"
      )}
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-t-[2rem] md:rounded-t-[3rem] border-t border-white/50 h-full flex flex-col shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)]">
        {/* Handle / Trigger */}
        <div 
          className="flex flex-col items-center justify-center p-4 md:p-6 cursor-pointer hover:bg-black/[0.02] transition-colors rounded-t-[2rem] md:rounded-t-[3rem]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 md:w-16 h-1 bg-muted/60 rounded-full mb-3 md:mb-4" />
          <div className="flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            {isExpanded ? <ChevronDown className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />}
            {places.length} Discoveries
          </div>
        </div>

        {/* Results Grid/List */}
        <div 
          ref={panelRef}
          className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 pb-8 md:pb-12"
        >
          {places.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <p className="text-xl md:text-2xl font-headline font-bold text-primary mb-2">No discoveries yet.</p>
              <p className="text-sm md:text-base text-muted-foreground font-light">Try exploring a different city or switching modes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 py-2 md:py-4">
              {places.map((place) => (
                <PlaceCard 
                  key={place.id} 
                  place={place} 
                  onClick={() => onPlaceClick(place)}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}