"use client"

import React, { useState, useMemo } from 'react';
import { SearchOverlay } from '@/components/local-lens/SearchOverlay';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function LocalLensApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'tourist' | 'hidden'>('tourist');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const { toast } = useToast();

  const filteredPlaces = useMemo(() => {
    return MOCK_PLACES.filter((place) => {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMode = 
        mode === 'tourist' ? place.isTouristFavorite : place.isHiddenGem;

      return matchesSearch && matchesMode;
    });
  }, [searchQuery, mode]);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setIsPanelExpanded(false); // Snap back to show map + short list
    toast({
      title: place.name,
      description: `Discovered in ${place.city}. Tap marker or card to explore.`,
    });
  };

  const handleModeChange = (newMode: 'tourist' | 'hidden') => {
    setMode(newMode);
    setSelectedPlace(null);
    toast({
      title: `${newMode === 'tourist' ? 'Tourist' : 'Hidden Gems'} Mode Active`,
      description: `Now showing ${newMode === 'tourist' ? 'popular favorites' : 'quiet local spots'}.`,
    });
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Floating Header Components */}
      <SearchOverlay 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mode={mode}
        setMode={handleModeChange}
      />

      {/* Main Map Viewport */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap 
          places={filteredPlaces} 
          selectedPlace={selectedPlace}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>

      {/* Selected Place Mini-Overlay (only if one selected and panel not expanded) */}
      {selectedPlace && !isPanelExpanded && (
        <div className="absolute bottom-[240px] left-6 right-6 md:left-auto md:right-8 md:w-80 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="glass p-4 rounded-2xl border-accent/30 shadow-2xl">
            <h4 className="text-accent text-xs font-bold uppercase tracking-wider mb-1">Spotlight</h4>
            <h3 className="text-xl font-headline font-semibold mb-2">{selectedPlace.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{selectedPlace.description}</p>
            <button 
              onClick={() => setSelectedPlace(null)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Bottom Results Panel */}
      <ResultsPanel 
        places={filteredPlaces}
        isExpanded={isPanelExpanded}
        setIsExpanded={setIsPanelExpanded}
        onPlaceClick={handlePlaceSelect}
      />

      <Toaster />
    </main>
  );
}
