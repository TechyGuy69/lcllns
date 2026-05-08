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

const HERO_IMAGES = [
  { url: "https://picsum.photos/seed/india-hero-1/1920/1080", hint: "taj mahal" },
  { url: "https://picsum.photos/seed/india-hero-2/1920/1080", hint: "varanasi ghats" },
  { url: "https://picsum.photos/seed/india-hero-3/1920/1080", hint: "jaipur fort" },
  { url: "https://picsum.photos/seed/india-hero-4/1920/1080", hint: "munnar tea" }
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

  // Auto-playing Carousel
  useEffect(() => {
    if (hasSearched) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [hasSearched]);

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
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background selection:bg-accent/20">
      
      {/* Hero Section */}
      <section className={cn(
        "relative w-full transition-all duration-1000 ease-in-out z-10 overflow-hidden",
        hasSearched ? "h-[35vh] md:h-[30vh]" : "h-screen"
      )}>
        {/* Carousel Images */}
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={img.url}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2000ms] ease-in-out",
              heroIndex === idx ? "opacity-100" : "opacity-0"
            )}
          >
            <Image 
              src={img.url}
              alt="Discover India"
              fill
              priority={idx === 0}
              className="object-cover"
              data-ai-hint={img.hint}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 hero-gradient flex flex-col items-center justify-center px-6 text-center">
          <div className={cn(
            "transition-all duration-1000 transform",
            hasSearched ? "scale-50 opacity-0 pointer-events-none h-0 overflow-hidden" : "scale-100 opacity-100"
          )}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 md:mb-10">
              India's Anti-Tourist Guide
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-9xl font-headline font-bold text-white mb-4 md:mb-8 tracking-tight leading-[1.1]">
              See India <br className="hidden sm:block" /><span className="italic font-normal">differently.</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed">
              Skip the tour buses. Find the places locals actually love — from hidden cafés to sacred spots tourists never reach.
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className={cn(
            "w-full max-w-3xl transition-all duration-700",
            hasSearched ? "mt-4" : ""
          )}>
            <div className="glass rounded-full p-1.5 md:p-2 flex items-center shadow-2xl">
              <div className="pl-4 md:pl-6 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Quiet trails in Munnar..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-base md:text-xl h-10 md:h-14 placeholder:text-muted-foreground/50 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-10 md:h-12 px-6 md:px-8 font-bold text-xs md:text-sm tracking-wide gap-2 group transition-all"
              >
                <span className="hidden sm:inline">Explore</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {!hasSearched && (
              <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s}
                    onClick={() => { setSearchQuery(s); onExplore(); }}
                    className="px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] md:text-sm font-medium hover:bg-white/20 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {!hasSearched && (
            <div className="hidden md:flex absolute bottom-12 items-center gap-12 lg:gap-20 text-white/80 animate-in fade-in duration-1000 delay-500">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-headline font-bold">20+</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">Places</div>
              </div>
              <div className="text-center border-x border-white/20 px-12 lg:px-20">
                <div className="text-xl lg:text-2xl font-headline font-bold">10+</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-headline font-bold">AI</div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60">Powered</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discovery Section (Map + Results) */}
      <section className={cn(
        "relative w-full transition-opacity duration-700 bg-background",
        hasSearched ? "h-[65vh] md:h-[70vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Mode Toggle Overlay */}
        <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-30">
          <div className="glass p-1 rounded-full flex gap-1 shadow-lg">
            <button
              onClick={() => handleModeChange('tourist')}
              className={cn(
                "flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-bold transition-all",
                mode === 'tourist' 
                  ? "bg-primary text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="w-3.5 h-3.5 md:w-4 md:h-4" /> Tourist
            </button>
            <button
              onClick={() => handleModeChange('hidden')}
              className={cn(
                "flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-bold transition-all",
                mode === 'hidden' 
                  ? "bg-accent text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MapIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /> Hidden Gems
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