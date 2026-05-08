
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRight, Compass, Sparkles, ChevronLeft } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { PlaceDetailView } from '@/components/local-lens/PlaceDetailView';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit, getDocs, addDoc } from 'firebase/firestore';

const HERO_IMAGES = [
  {
    url: "https://picsum.photos/seed/taj-sunrise/1920/1080",
    hint: "taj mahal sunrise"
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

const SHORTCUTS = [
  { label: "MUMBAI CAFÉS", query: "Mumbai cafe" },
  { label: "HIDDEN HAMPI", query: "Hampi" },
  { label: "VARANASI GHATS", query: "Varanasi" }
];

export default function LocalLensApp() {
  const db = useFirestore();
  const placesCollection = useMemo(() => (db ? collection(db, 'places') : null), [db]);
  const { data: firestorePlaces, loading: firestoreLoading } = useCollection(placesCollection);

  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'tourist' | 'hidden'>('tourist');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    async function seedData() {
      if (!db) return;
      try {
        const q = query(collection(db, 'places'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          const promises = MOCK_PLACES.map(place => {
            const { id, ...data } = place;
            return addDoc(collection(db, 'places'), data);
          });
          await Promise.all(promises);
        }
      } catch (e) {
        // Silent fail
      }
    }
    seedData();
  }, [db]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const places = useMemo(() => {
    if (firestorePlaces && firestorePlaces.length > 0) {
      return firestorePlaces.filter((p: any) => p.lat && p.lng) as Place[];
    }
    return MOCK_PLACES;
  }, [firestorePlaces]);

  const filteredPlaces = useMemo(() => {
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    
    return places.filter((place) => {
      const matchesMode = mode === 'tourist' ? place.isTouristFavorite : place.isHiddenGem;
      if (queryWords.length === 0) return matchesMode;
      const searchableText = `${place.name} ${place.city} ${place.category} ${place.description}`.toLowerCase();
      const matchesSearch = queryWords.every(word => searchableText.includes(word));
      return matchesSearch && matchesMode;
    });
  }, [searchQuery, mode, places]);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
  };

  const closePlaceDetail = () => {
    setSelectedPlace(null);
  };

  const onExplore = () => {
    setIsExploring(true);
    setIsPanelExpanded(true);
  };

  const goHome = () => {
    setIsExploring(false);
    setSearchQuery('');
    setSelectedPlace(null);
    setIsPanelExpanded(false);
  };

  const handleShortcutClick = (query: string) => {
    setSearchQuery(query);
    onExplore();
  };

  return (
    <main className="relative h-screen w-full bg-background overflow-hidden">
      
      {/* Home Page Section */}
      <section className={cn(
        "absolute inset-0 z-10 transition-transform duration-1000 ease-in-out bg-black",
        isExploring ? "-translate-x-full" : "translate-x-0"
      )}>
        
        {/* Carousel Background */}
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
        
        <div className="absolute inset-0 hero-overlay z-[1]" />

        {/* Home Screen Content */}
        <div className="relative z-10 h-full w-full flex flex-col justify-between px-6 py-10 md:px-12 md:py-16">
          
          {/* Top Branding Area */}
          <header className="w-full flex justify-start items-center">
            <span className="text-xl md:text-3xl font-bold text-white tracking-tighter drop-shadow-2xl">
              LocalLens
            </span>
          </header>

          {/* Center Content - IMPACTFUL Headline */}
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full px-4">
            <h1 className="font-headline font-bold text-white tracking-tight leading-[0.85] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              See India <br />
              <span className="italic font-normal opacity-90">differently.</span>
            </h1>
            
            <p className="text-sm md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed text-shadow-soft opacity-80 animate-in fade-in duration-1000 delay-300 px-4">
              Skip the tour buses. Find the places locals actually love — from <br className="hidden md:block" />
              hidden cafés to sacred spots tourists never reach.
            </p>
          </div>

          {/* Bottom Area - Search & Shortcuts */}
          <div className="w-full max-w-4xl mx-auto pb-4 md:pb-8 px-4">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-1.5 md:p-2 flex items-center shadow-2xl overflow-hidden mb-6 md:mb-10 animate-in zoom-in-95 duration-700 delay-500">
              <div className="pl-5 md:pl-7 text-white/60">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Quiet trails in Munnar..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-base md:text-2xl h-12 md:h-20 placeholder:text-white/30 text-white font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-[#346b51] hover:bg-[#2a5641] text-white h-11 md:h-16 px-8 md:px-14 font-bold text-[10px] md:text-xs tracking-[0.2em] gap-3 shadow-lg shrink-0 mr-0.5 transition-all hover:scale-105 active:scale-95"
              >
                EXPLORE <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
              {SHORTCUTS.map((shortcut) => (
                <button 
                  key={shortcut.label}
                  onClick={() => handleShortcutClick(shortcut.query)}
                  className="px-4 py-2 md:px-8 md:py-4 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white/80 text-[8px] md:text-[11px] font-bold hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Page Section */}
      <section className={cn(
        "absolute inset-0 z-20 bg-background transition-transform duration-1000 ease-in-out flex flex-col overflow-hidden",
        isExploring ? "translate-x-0" : "translate-x-full"
      )}>
        <header className="relative z-30 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 shrink-0 bg-background/50 backdrop-blur-sm border-b border-border/10">
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-[9px] md:text-[10px] uppercase tracking-[0.15em] transition-all bg-white/70 backdrop-blur-md px-4 py-2.5 md:px-5 md:py-3 rounded-full border border-white/50 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back Home</span>
          </button>

          <div className="bg-white/95 backdrop-blur-xl p-1 rounded-full flex gap-1 shadow-md border border-border/40 w-full max-w-[150px] md:max-w-xs">
            <button
              onClick={() => setMode('tourist')}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-1.5 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all",
                mode === 'tourist' ? "bg-primary text-white" : "text-muted-foreground"
              )}
            >
              <Compass className="w-3.5 h-3.5 md:w-4 md:h-4" /> Tourist
            </button>
            <button
              onClick={() => setMode('hidden')}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-1.5 md:py-2.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] transition-all",
                mode === 'hidden' ? "bg-accent text-white" : "text-muted-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" /> Hidden
            </button>
          </div>
          
          <div className="w-10 md:w-20" />
        </header>

        <div className="flex-1 relative">
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
        </div>
      </section>

      <PlaceDetailView 
        place={selectedPlace} 
        onClose={closePlaceDetail} 
      />

      <Toaster />
    </main>
  );
}
