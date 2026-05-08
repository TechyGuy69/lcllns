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
    if (hasSearched) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
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
    <main className="relative min-h-screen w-full bg-background flex flex-col">
      
      {/* Hero Section */}
      <section className={cn(
        "relative w-full transition-all duration-1000 ease-in-out shrink-0 overflow-hidden",
        hasSearched ? "h-[35vh] md:h-[40vh]" : "h-screen"
      )}>
        {/* Carousel Images */}
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={img.url}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2500ms] ease-in-out",
              heroIndex === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
            style={{ transitionProperty: 'opacity, transform' }}
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
        
        {/* Soft Dark Gradient Overlay */}
        <div className="absolute inset-0 hero-overlay" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
          <div className={cn(
            "transition-all duration-1000 transform max-w-4xl",
            hasSearched ? "scale-50 opacity-0 pointer-events-none h-0" : "scale-100 opacity-100"
          )}>
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
              The Art of Travel in India
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-headline font-bold text-white mb-6 md:mb-10 tracking-tight leading-[0.9] text-shadow-md">
              See India <br /><span className="italic font-normal serif">differently.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-12 md:mb-20 leading-relaxed text-shadow-sm">
              Escape the tourist trails. Discover the quiet sanctuaries, local haunts, and sacred spots where India truly lives.
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className={cn(
            "w-full max-w-3xl transition-all duration-700 ease-in-out",
            hasSearched ? "mt-4" : ""
          )}>
            <div className="glass rounded-full p-2 md:p-3 flex items-center shadow-2xl border-white/50">
              <div className="pl-4 md:pl-6 text-primary/40">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Find a hidden cafe or quiet trail..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-lg md:text-2xl h-10 md:h-16 placeholder:text-primary/30 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-10 md:h-14 px-6 md:px-10 font-bold text-xs md:text-base tracking-wide gap-3 group transition-all"
              >
                <span>Explore</span> <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
            
            {!hasSearched && (
              <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s}
                    onClick={() => { setSearchQuery(s); onExplore(); }}
                    className="px-5 py-2 md:px-7 md:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-semibold hover:bg-white/30 transition-all text-shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {!hasSearched && (
            <div className="absolute bottom-12 hidden md:flex items-center gap-16 lg:gap-24 text-white/70 animate-in fade-in duration-1000 delay-700">
              <div className="text-center group cursor-default">
                <div className="text-2xl lg:text-3xl font-headline font-bold text-white group-hover:text-accent transition-colors">24</div>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60 mt-1">Gems</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center group cursor-default">
                <div className="text-2xl lg:text-3xl font-headline font-bold text-white group-hover:text-accent transition-colors">12</div>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60 mt-1">States</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center group cursor-default">
                <div className="text-2xl lg:text-3xl font-headline font-bold text-white group-hover:text-accent transition-colors">AI</div>
                <div className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60 mt-1">Insights</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discovery Section (Map + Results) */}
      <section className={cn(
        "relative w-full flex-1 transition-opacity duration-700 bg-background",
        hasSearched ? "min-h-[60vh] opacity-100" : "h-0 opacity-0 pointer-events-none"
      )}>
        {/* Mode Toggle Overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
          <div className="glass p-1.5 rounded-full flex gap-1.5 shadow-xl border-white/60">
            <button
              onClick={() => handleModeChange('tourist')}
              className={cn(
                "flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all",
                mode === 'tourist' 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="w-4 h-4" /> Tourist
            </button>
            <button
              onClick={() => handleModeChange('hidden')}
              className={cn(
                "flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all",
                mode === 'hidden' 
                  ? "bg-accent text-white shadow-md" 
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