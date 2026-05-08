"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRight, Compass, Sparkles, ChevronLeft } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const HERO_IMAGES = [
  {
    url: "https://picsum.photos/seed/taj-sunrise/1920/1080",
    hint: "taj mahal"
  },
  {
    url: "https://picsum.photos/seed/varanasi-ghats/1920/1080",
    hint: "varanasi india"
  },
  {
    url: "https://picsum.photos/seed/himalaya-peaks/1920/1080",
    hint: "himalayas mountains"
  },
  {
    url: "https://picsum.photos/seed/kerala-backwaters/1920/1080",
    hint: "kerala boat"
  }
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
  const [isExploring, setIsExploring] = useState(false);
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
        place.category.toLowerCase().includes(query);

      const matchesMode = 
        mode === 'tourist' ? place.isTouristFavorite : place.isHiddenGem;

      return matchesSearch && matchesMode;
    });
  }, [searchQuery, mode]);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setIsPanelExpanded(false);
  };

  const onExplore = () => {
    setIsExploring(true);
  };

  const goHome = () => {
    setIsExploring(false);
    setSearchQuery('');
    setSelectedPlace(null);
  };

  return (
    <main className="relative min-h-screen w-full bg-background flex flex-col overflow-x-hidden">
      
      {/* Home / Hero Section */}
      <section className={cn(
        "relative w-full transition-all duration-1000 ease-in-out shrink-0",
        isExploring ? "h-[30vh] md:h-[40vh]" : "h-screen"
      )}>
        {/* Background Carousel */}
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
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-overlay z-[1]" />

        {/* Back Button (Only when exploring) */}
        {isExploring && (
          <button 
            onClick={goHome}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Home
          </button>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center z-10">
          <div className={cn(
            "transition-all duration-1000 transform max-w-4xl",
            isExploring ? "mb-2 md:mb-4 scale-90" : "mb-8 md:mb-12"
          )}>
            <h1 className={cn(
              "font-headline font-bold text-white tracking-tight leading-tight text-shadow-strong transition-all duration-700",
              isExploring ? "text-2xl md:text-4xl" : "text-5xl md:text-8xl mb-4 md:mb-6"
            )}>
              See India <span className="italic font-normal">differently.</span>
            </h1>
            {!isExploring && (
              <p className="text-sm md:text-xl text-white/90 font-medium max-w-xl mx-auto leading-relaxed text-shadow-soft animate-in fade-in duration-1000 delay-300">
                Skip the crowds. Discover the quiet sanctuaries and local haunts where India truly lives.
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className={cn(
            "w-full max-w-3xl px-4 transition-all duration-700",
            isExploring ? "translate-y-0" : "animate-in zoom-in-95"
          )}>
            <div className="glass rounded-full p-1 md:p-1.5 flex items-center shadow-xl">
              <div className="pl-4 md:pl-5 text-primary/60">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
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
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-10 md:h-14 px-6 md:px-10 font-bold text-sm md:text-base tracking-wide gap-2 shadow-lg shrink-0"
              >
                <span className="hidden sm:inline">Explore</span> <ArrowRight className="w-4 h-4 md:w-5 h-5" />
              </Button>
            </div>
            
            {!isExploring && (
              <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s}
                    onClick={() => { setSearchQuery(s); setIsExploring(true); }}
                    className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs font-bold hover:bg-white/30 transition-all shadow-sm uppercase tracking-widest"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className={cn(
        "relative w-full flex-1 transition-all duration-700 bg-background overflow-hidden",
        isExploring ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none h-0"
      )}>
        {/* View Toggle */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[90vw] md:max-w-sm">
          <div className="bg-white/80 backdrop-blur-xl p-1 rounded-full flex gap-1 shadow-lg border border-border/40">
            <button
              onClick={() => { setMode('tourist'); setSelectedPlace(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                mode === 'tourist' 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="w-4 h-4" /> Tourist
            </button>
            <button
              onClick={() => { setMode('hidden'); setSelectedPlace(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                mode === 'hidden' 
                  ? "bg-accent text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-4 h-4" /> Hidden Gems
            </button>
          </div>
        </div>

        <div className="w-full h-full min-h-[500px] md:min-h-[600px]">
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