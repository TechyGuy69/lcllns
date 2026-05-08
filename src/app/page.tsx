"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRight, MapPin, Compass, Map as MapIcon } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  "Mumbai cafes",
  "Hidden Hampi",
  "Varanasi ghats",
  "Jaipur gems",
  "Munnar trails"
];

export default function LocalLensApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'tourist' | 'hidden'>('tourist');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
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
    setIsPanelExpanded(false);
    toast({
      title: place.name,
      description: `Discovered in ${place.city}.`,
    });
  };

  const handleModeChange = (newMode: 'tourist' | 'hidden') => {
    setMode(newMode);
    setSelectedPlace(null);
  };

  const onExplore = () => {
    setHasSearched(true);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-background selection:bg-accent/20">
      
      {/* Hero Section */}
      <section className={cn(
        "relative w-full transition-all duration-1000 ease-in-out z-10",
        hasSearched ? "h-[40vh] md:h-[30vh]" : "h-screen"
      )}>
        <Image 
          src="https://picsum.photos/seed/india-hero/1920/1080"
          alt="India"
          fill
          priority
          className="object-cover"
          data-ai-hint="india travel"
        />
        <div className="absolute inset-0 hero-gradient flex flex-col items-center justify-center px-6 text-center">
          <div className={cn(
            "transition-all duration-1000",
            hasSearched ? "scale-75 opacity-0 pointer-events-none h-0 overflow-hidden" : "scale-100 opacity-100"
          )}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8">
              In India's Anti-Tourist Guide
            </div>
            <h1 className="text-5xl md:text-8xl font-headline font-bold text-white mb-6 tracking-tight leading-[1.1]">
              See India <br className="hidden md:block" /><span className="italic font-normal">differently.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              Skip the tour buses. Find the places locals actually love — from hidden cafés to sacred spots tourists never reach.
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className={cn(
            "w-full max-w-3xl transition-all duration-700",
            hasSearched ? "mt-4" : ""
          )}>
            <div className="glass rounded-full p-2 flex items-center shadow-2xl">
              <div className="pl-6 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quiet trails in Munnar..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-lg md:text-xl h-14 placeholder:text-muted-foreground/50 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-12 px-8 font-bold text-sm tracking-wide gap-2 group transition-all"
              >
                Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {!hasSearched && (
              <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s}
                    onClick={() => { setSearchQuery(s); onExplore(); }}
                    className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium hover:bg-white/20 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {!hasSearched && (
            <div className="absolute bottom-12 flex items-center gap-20 text-white/80 animate-in fade-in duration-1000 delay-500">
              <div className="text-center">
                <div className="text-2xl font-headline font-bold">20+</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">Places</div>
              </div>
              <div className="text-center border-x border-white/20 px-20">
                <div className="text-2xl font-headline font-bold">10+</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-headline font-bold">AI</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">Powered</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discovery Section (Map + Results) */}
      <section className={cn(
        "relative h-[70vh] md:h-[80vh] w-full transition-opacity duration-700",
        hasSearched ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {/* Mode Toggle Overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
          <div className="glass p-1 rounded-full flex gap-1">
            <button
              onClick={() => handleModeChange('tourist')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all",
                mode === 'tourist' 
                  ? "bg-primary text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="w-4 h-4" /> Tourist
            </button>
            <button
              onClick={() => handleModeChange('hidden')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all",
                mode === 'hidden' 
                  ? "bg-accent text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MapIcon className="w-4 h-4" /> Hidden Gems
            </button>
          </div>
        </div>

        <InteractiveMap 
          places={filteredPlaces} 
          selectedPlace={selectedPlace}
          onPlaceSelect={handlePlaceSelect}
        />

        <ResultsPanel 
          places={filteredPlaces}
          isExpanded={isPanelExpanded}
          setIsExpanded={setIsPanelExpanded}
          onPlaceClick={handlePlaceSelect}
        />
      </section>

      <Toaster />
    </main>
  );
}
