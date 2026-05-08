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
        isExpanded ? "h-[85vh]" : "h-[160px] md:h-[220px]"
      )}
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-t-[3rem] border-t border-white/50 h-full flex flex-col shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.08)]">
        {/* Trigger */}
        <div 
          className="flex flex-col items-center justify-center py-4 md:py-6 cursor-pointer hover:bg-black/[0.01] transition-colors rounded-t-[3rem]"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1 bg-muted/40 rounded-full mb-4" />
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            {places.length} Hidden Discoveries
          </div>
        </div>

        {/* Grid */}
        <div 
          ref={panelRef}
          className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-10 pb-12"
        >
          {places.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
              <p className="text-xl font-headline font-bold text-primary mb-2">No spots found here.</p>
              <p className="text-xs text-muted-foreground font-light">Try exploring another city or changing the filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 py-4">
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