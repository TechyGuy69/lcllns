
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
    <main className="relative h-screen w-full bg-black overflow-hidden selection:bg-accent/30 selection:text-white">
      
      {/* Home Page Section */}
      <section className={cn(
        "absolute inset-0 z-10 transition-transform duration-1000 ease-in-out",
        isExploring ? "-translate-y-full" : "translate-y-0"
      )}>
        
        {/* Carousel Background */}
        {HERO_IMAGES.map((img, idx) => (
          <div 
            key={img.url}
            className={cn(
              "absolute inset-0 transition-opacity duration-[2000ms] ease-in-out",
              heroIndex === idx ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
            style={{ transitionProperty: 'opacity, transform' }}
          >
            <Image 
              src={img.url}
              alt="India Landscapes"
              fill
              priority={idx === 0}
              className="object-cover brightness-[0.7]"
              data-ai-hint={img.hint}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 hero-overlay z-[1]" />

        {/* Home Screen Content */}
        <div className="relative z-10 h-full w-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
          
          {/* Top Branding Area */}
          <header className="w-full flex justify-start items-center">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tighter drop-shadow-xl opacity-90 hover:opacity-100 transition-opacity cursor-default">
              LocalLens
            </span>
          </header>

          {/* Center Content - IMPACTFUL Headline */}
          <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-4 max-w-5xl mx-auto space-y-6 md:space-y-10">
            <div className="space-y-4 md:space-y-6">
              <h1 className="font-headline font-bold text-white tracking-tight leading-[1] text-6xl md:text-8xl lg:text-[10rem] animate-in fade-in slide-in-from-bottom-12 duration-1000">
                See India <br />
                <span className="italic font-normal opacity-90">differently.</span>
              </h1>
              
              <p className="text-sm md:text-lg text-white/80 font-medium max-w-xl mx-auto leading-relaxed text-shadow-soft animate-in fade-in duration-1000 delay-300">
                Skip the tour buses. Find the places locals actually love — from hidden cafés to sacred spots tourists never reach.
              </p>
            </div>

            {/* Search Bar Area */}
            <div className="w-full max-w-3xl mx-auto animate-in zoom-in-95 duration-700 delay-500">
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-1.5 md:p-2.5 flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:bg-white/15 focus-within:bg-white/20 focus-within:ring-2 focus-within:ring-white/20">
                <div className="pl-5 md:pl-7 text-white/50">
                  <Search className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                  placeholder="Quiet trails in Munnar..."
                  className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-base md:text-xl h-12 md:h-14 placeholder:text-white/30 text-white font-medium"
                />
                <Button 
                  onClick={onExplore}
                  className="rounded-full bg-[#346b51] hover:bg-[#2a5641] text-white h-11 md:h-14 px-6 md:px-10 font-bold text-[10px] md:text-xs tracking-[0.2em] gap-2 shadow-lg shrink-0 mr-0.5 transition-all hover:scale-105 active:scale-95"
                >
                  EXPLORE <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Shortcuts */}
          <div className="w-full max-w-2xl mx-auto pb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {SHORTCUTS.map((shortcut) => (
                <button 
                  key={shortcut.label}
                  onClick={() => handleShortcutClick(shortcut.query)}
                  className="px-5 py-2.5 md:px-8 md:py-3.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/70 text-[9px] md:text-[10px] font-bold hover:bg-white/10 hover:text-white transition-all uppercase tracking-[0.2em] shadow-lg"
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
