
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
        
        {/* Branding Branding */}
        <div className="absolute top-10 left-10 md:top-12 md:left-12 z-[100] pointer-events-none">
          <span className="text-3xl md:text-5xl font-headline font-bold text-white text-shadow-strong tracking-tighter">
            LocalLens
          </span>
        </div>

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
        
        <div className="absolute inset-0 hero-overlay z-[1]" />

        {/* Home Screen Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10 w-full max-w-7xl mx-auto">
          
          <div className="mb-8 transform animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
            <h1 className="font-headline font-bold text-white tracking-tight leading-[1.0] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 text-shadow-strong">
              See India <br />
              <span className="opacity-90 italic">differently.</span>
            </h1>
            
            <p className="text-sm md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed text-shadow-soft px-4 mb-12">
              Skip the tour buses. Find the places locals actually love — from <br className="hidden md:block" />
              hidden cafés to sacred spots tourists never reach.
            </p>
          </div>

          <div className="w-full max-w-4xl mt-auto pb-20 animate-in zoom-in-95 duration-700 delay-300">
            {/* Blurred Search Bar */}
            <div className="bg-black/40 backdrop-blur-[30px] border border-white/10 rounded-full p-2 flex items-center shadow-2xl overflow-hidden mb-8">
              <div className="pl-6 md:pl-8 text-white/50">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Quiet trails in Munnar..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-base md:text-xl h-12 md:h-16 placeholder:text-white/30 text-white font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-[#346b51] hover:bg-[#2a5641] text-white h-12 md:h-14 px-8 md:px-12 font-bold text-[10px] md:text-xs tracking-[0.2em] gap-3 shadow-lg shrink-0 mr-1 transition-all hover:scale-105 active:scale-95"
              >
                EXPLORE <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {SHORTCUTS.map((shortcut) => (
                <button 
                  key={shortcut.label}
                  onClick={() => handleShortcutClick(shortcut.query)}
                  className="px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-black/30 backdrop-blur-md border border-white/5 text-white/80 text-[9px] md:text-[11px] font-bold hover:bg-white/10 transition-all uppercase tracking-[0.15em]"
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
        <header className="relative z-30 flex items-center justify-between px-8 py-6 md:px-12 md:py-8 shrink-0">
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-[10px] md:text-[11px] uppercase tracking-[0.15em] transition-all bg-white/70 backdrop-blur-md px-5 py-3 md:px-7 md:py-3.5 rounded-full border border-white/50 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Back Home</span>
          </button>

          <div className="bg-white/95 backdrop-blur-xl p-1 rounded-full flex gap-1 shadow-md border border-border/40 w-full max-w-[180px] md:max-w-xs">
            <button
              onClick={() => setMode('tourist')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'tourist' ? "bg-primary text-white" : "text-muted-foreground"
              )}
            >
              <Compass className="w-4 h-4" /> Tourist
            </button>
            <button
              onClick={() => setMode('hidden')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'hidden' ? "bg-accent text-white" : "text-muted-foreground"
              )}
            >
              <Sparkles className="w-4 h-4" /> Hidden
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
