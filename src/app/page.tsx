
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, ArrowRight, Compass, Sparkles, ChevronLeft } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { PlaceDetailView } from '@/components/local-lens/PlaceDetailView';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
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
  { label: "Mumbai cafés", query: "Mumbai cafe" },
  { label: "Hidden Hampi", query: "Hampi" },
  { label: "Varanasi ghats", query: "Varanasi" },
  { label: "Jaipur gems", query: "Jaipur" },
  { label: "Munnar trails", query: "Munnar" }
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
      } catch (e) {}
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
    <main className="relative min-h-screen w-full bg-black overflow-hidden selection:bg-accent/30 selection:text-white">
      
      {/* Home Page Section */}
      <section className={cn(
        "absolute inset-0 z-10 transition-transform duration-1000 ease-in-out flex items-center justify-center text-center px-6 min-h-screen",
        isExploring ? "-translate-y-full" : "translate-y-0"
      )}>
        
        {/* Background */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((img, idx) => (
            <div 
              key={img.url}
              className={cn(
                "absolute inset-0 transition-opacity duration-[2000ms] ease-in-out",
                heroIndex === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
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
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Branding Logo - Positioned Absolute Relative to Section */}
        <h1 className="absolute top-8 left-8 text-white text-xl md:text-2xl font-bold tracking-tight z-20 opacity-90">
          LocalLens
        </h1>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8">
          
          {/* Heading */}
          <h1 className="text-white text-5xl md:text-8xl font-headline leading-tight drop-shadow-2xl">
            See India <br />
            <span className="italic font-normal opacity-90">differently.</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto leading-relaxed text-shadow-soft">
            Skip the crowds. Discover the quiet sanctuaries and local haunts where India truly lives.
          </p>

          {/* Search Bar */}
          <div className="flex items-center w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl transition-all">
            <div className="pl-4 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onExplore()}
              placeholder="Find a hidden café or quiet trail..."
              className="flex-1 bg-transparent border-0 outline-none px-4 text-base md:text-lg text-gray-800 placeholder:text-gray-400 font-medium h-12"
            />
            <button 
              onClick={onExplore}
              className="bg-[#2d5a44] text-white px-8 h-12 rounded-full hover:bg-[#234735] transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg"
            >
              Explore <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Shortcuts / Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {SHORTCUTS.map((shortcut) => (
              <button 
                key={shortcut.label}
                onClick={() => handleShortcutClick(shortcut.query)}
                className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all shadow-md"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Page Section */}
      <section className={cn(
        "absolute inset-0 z-20 bg-background transition-transform duration-1000 ease-in-out flex flex-col overflow-hidden min-h-screen",
        isExploring ? "translate-y-0" : "translate-y-full"
      )}>
        <header className="relative z-30 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 shrink-0 bg-background/80 backdrop-blur-md border-b border-border/10">
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-primary/70 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all bg-white/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border/20 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
          </button>

          <div className="bg-white/90 backdrop-blur-xl p-1 rounded-full flex gap-1 shadow-md border border-border/40 w-full max-w-[140px] md:max-w-xs">
            <button
              onClick={() => setMode('tourist')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'tourist' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-primary/60"
              )}
            >
              <Compass className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Tourist</span>
            </button>
            <button
              onClick={() => setMode('hidden')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'hidden' ? "bg-accent text-white shadow-sm" : "text-muted-foreground hover:text-accent/60"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Hidden</span>
            </button>
          </div>
          
          <div className="w-10" />
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
