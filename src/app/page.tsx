"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRight, MapPin, Compass, Map as MapIcon, Sparkles } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HERO_IMAGES = [
  { url: "https://picsum.photos/seed/india-lux-1/1920/1080", hint: "luxury palace" },
  { url: "https://picsum.photos/seed/india-lux-2/1920/1080", hint: "kerala backwaters" },
  { url: "https://picsum.photos/seed/india-lux-3/1920/1080", hint: "himalayan view" },
  { url: "https://picsum.photos/seed/india-lux-4/1920/1080", hint: "goa heritage" }
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
    }, 6000);
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
    if (!searchQuery && !hasSearched) {
      setSearchQuery("Top Gems");
    }
    setHasSearched(true);
  };

  return (
    <main className="relative min-h-screen w-full bg-background flex flex-col overflow-x-hidden">
      
      {/* Hero Section - Fixed height logic */}
      <section className={cn(
        "relative w-full transition-all duration-1000 ease-in-out shrink-0",
        hasSearched ? "h-[40vh] md:h-[45vh]" : "h-screen min-h-[600px]"
      )}>
        {/* Carousel Images */}
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={img.url}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2000ms] ease-in-out",
              heroIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-110"
            )}
          >
            <Image 
              src={img.url}
              alt="India"
              fill
              priority={idx === 0}
              className="object-cover"
              data-ai-hint={img.hint}
            />
          </div>
        ))}
        
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 hero-overlay" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center z-10">
          <div className={cn(
            "transition-all duration-1000 transform max-w-5xl",
            hasSearched ? "scale-75 opacity-0 h-0 pointer-events-none mb-0" : "scale-100 opacity-100 mb-8 md:mb-12"
          )}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
              India's best kept secrets
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-headline font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight text-shadow-premium">
              See India <br /><span className="italic font-normal serif">differently.</span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed text-shadow-premium opacity-80">
              Skip the tourist trails. Discover the quiet sanctuaries, local haunts, and sacred spots where India truly lives.
            </p>
          </div>

          {/* Search Bar - Scaled properly */}
          <div className={cn(
            "w-full max-w-2xl md:max-w-3xl transition-all duration-700 ease-in-out px-4",
            hasSearched ? "mt-4" : ""
          )}>
            <div className="glass rounded-full p-1.5 md:p-2 flex items-center shadow-2xl border-white/60">
              <div className="pl-4 md:pl-6 text-primary/40">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Find a hidden cafe or quiet trail..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-base md:text-xl h-10 md:h-14 placeholder:text-primary/30 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-10 md:h-12 px-5 md:px-8 font-bold text-xs md:text-sm tracking-wide gap-2 group transition-all shrink-0"
              >
                <span>Explore</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {!hasSearched && (
              <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s}
                    onClick={() => { setSearchQuery(s); onExplore(); }}
                    className="px-4 py-1.5 md:px-6 md:py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-semibold hover:bg-white/30 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Stats Bar */}
          {!hasSearched && (
            <div className="mt-12 md:mt-20 flex items-center gap-8 md:gap-16 text-white/70 animate-in fade-in duration-1000 delay-700">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-headline font-bold text-white">24</div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60">Gems</div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl md:text-2xl font-headline font-bold text-white">12</div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60">States</div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl md:text-2xl font-headline font-bold text-white">AI</div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-60">Score</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discovery Section - Warm Background fixed */}
      <section className={cn(
        "relative w-full flex-1 transition-all duration-700 bg-background",
        hasSearched ? "min-h-[60vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Mode Toggle */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[90vw] md:max-w-md">
          <div className="glass p-1 rounded-full flex gap-1 shadow-lg border-white/80">
            <button
              onClick={() => handleModeChange('tourist')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold transition-all",
                mode === 'tourist' 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="w-3.5 h-3.5" /> Tourist Mainstays
            </button>
            <button
              onClick={() => handleModeChange('hidden')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold transition-all",
                mode === 'hidden' 
                  ? "bg-accent text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" /> Hidden Gems
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