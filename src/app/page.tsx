"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HERO_IMAGES = [
  { url: "https://picsum.photos/seed/taj/1920/1080", hint: "taj mahal" },
  { url: "https://picsum.photos/seed/varanasi/1920/1080", hint: "varanasi india" },
  { url: "https://picsum.photos/seed/himalayas/1920/1080", hint: "himalayas" },
  { url: "https://picsum.photos/seed/kerala/1920/1080", hint: "kerala boat" }
];

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
  const [heroIndex, setHeroIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filteredPlaces = useMemo(() => {
    return MOCK_PLACES.filter((place) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        place.name.toLowerCase().includes(query) ||
        place.city.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query);

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
      description: `Exploring ${place.city}`,
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
    <main className="relative min-h-screen w-full bg-background flex flex-col overflow-x-hidden">
      
      {/* Hero Section */}
      <section className={cn(
        "relative w-full transition-all duration-1000 ease-in-out shrink-0",
        hasSearched ? "h-[45vh]" : "h-screen"
      )}>
        {/* Background images with crossfade */}
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={img.url}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2500ms] ease-in-out",
              heroIndex === idx ? "opacity-100" : "opacity-0"
            )}
          >
            <Image 
              src={img.url}
              alt="India Travel"
              fill
              priority={idx === 0}
              className="object-cover"
              data-ai-hint={img.hint}
            />
          </div>
        ))}
        
        {/* Clean Gradient Overlay for Readability */}
        <div className="absolute inset-0 hero-overlay" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center z-10">
          <div className={cn(
            "transition-all duration-1000 transform max-w-4xl",
            hasSearched ? "mb-6" : "mb-12"
          )}>
            <h1 className={cn(
              "font-headline font-bold text-white tracking-tight leading-tight text-shadow-strong transition-all duration-700",
              hasSearched ? "text-3xl md:text-5xl" : "text-5xl md:text-8xl mb-6"
            )}>
              See India <span className="italic font-normal">differently.</span>
            </h1>
            {!hasSearched && (
              <p className="text-base md:text-xl text-white/95 font-medium max-w-xl mx-auto leading-relaxed text-shadow-strong animate-in fade-in duration-1000 delay-300">
                Skip the crowds. Discover the quiet sanctuaries and local haunts where India truly lives.
              </p>
            )}
          </div>

          {/* Clean Search Bar */}
          <div className="w-full max-w-3xl px-4 animate-in zoom-in-95 duration-700">
            <div className="glass rounded-full p-2 md:p-3 flex items-center shadow-2xl border-white/80">
              <div className="pl-4 md:pl-6 text-primary/60">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Find a hidden cafe or quiet trail..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-base md:text-xl h-10 md:h-14 placeholder:text-primary/40 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-10 md:h-14 px-6 md:px-10 font-bold text-sm md:text-base tracking-wide gap-2 group shadow-lg shrink-0"
              >
                <span>Explore</span> <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {!hasSearched && (
              <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s}
                    onClick={() => { setSearchQuery(s); onExplore(); }}
                    className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs md:text-sm font-bold hover:bg-white/40 transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className={cn(
        "relative w-full flex-1 transition-all duration-700 bg-background",
        hasSearched ? "min-h-[55vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Mode Toggle */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-[90vw] md:max-w-sm">
          <div className="bg-white p-1 rounded-full flex gap-1 shadow-md border border-border">
            <button
              onClick={() => handleModeChange('tourist')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-all",
                mode === 'tourist' 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="w-4 h-4" /> Tourist favorites
            </button>
            <button
              onClick={() => handleModeChange('hidden')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold transition-all",
                mode === 'hidden' 
                  ? "bg-accent text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-4 h-4" /> Hidden gems
            </button>
          </div>
        </div>

        <div className="w-full h-full min-h-[500px]">
          <InteractiveMap 
            places={filteredPlaces} 
            selectedPlace={selectedPlace}
            onPlaceSelect={handlePlaceSelect}
          />
        </div>

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