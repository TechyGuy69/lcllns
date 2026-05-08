
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const SUGGESTIONS = [
  "Mumbai",
  "Kolkata",
  "Hampi",
  "Jaipur",
  "Munnar"
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

  const logoImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'logo-main'), []);

  // Seed function to populate Firestore with mock data if it's empty
  useEffect(() => {
    async function seedData() {
      if (!db) return;
      try {
        const q = query(collection(db, 'places'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          // Filter out any potential non-place entities and seed correctly
          const validMockPlaces = MOCK_PLACES.filter(p => p.name && p.lat && p.lng);
          const promises = validMockPlaces.map(place => {
            const { id, ...data } = place;
            return addDoc(collection(db, 'places'), data);
          });
          await Promise.all(promises);
        }
      } catch (e) {
        // Silent fail for seeding
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
      // Filter out anything that might have been accidentally seeded as a place but isn't
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
  };

  const goHome = () => {
    setIsExploring(false);
    setSearchQuery('');
    setSelectedPlace(null);
  };

  return (
    <main className="relative h-screen w-full bg-background overflow-hidden">
      
      {/* PERSISTENT BRAND LOGO - Fixed position at top left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[100]">
        {logoImage ? (
          <div 
            className="relative w-40 h-12 md:w-56 md:h-16 cursor-pointer group animate-in fade-in slide-in-from-top-4 duration-1000"
            onClick={goHome}
          >
            <Image 
              src={logoImage.imageUrl}
              alt="LocalLens Logo"
              fill
              className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
              priority
              data-ai-hint={logoImage.imageHint}
            />
          </div>
        ) : (
          <h1 
            className="text-white font-headline text-2xl md:text-3xl font-bold tracking-tight cursor-pointer drop-shadow-xl"
            onClick={goHome}
          >
            LocalLens
          </h1>
        )}
      </div>

      {/* Home Page Section */}
      <section className={cn(
        "absolute inset-0 z-10 transition-transform duration-1000 ease-in-out bg-black",
        isExploring ? "-translate-x-full" : "translate-x-0"
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
        
        <div className="absolute inset-0 hero-overlay z-[1]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 text-center z-10">
          <div className="mb-8 md:mb-12 max-w-4xl transform animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="font-headline font-bold text-white tracking-tight leading-tight text-4xl md:text-7xl mb-4 md:mb-6 text-shadow-strong">
              See India <span className="text-white">differently.</span>
            </h1>
            <p className="text-sm md:text-lg text-white font-medium max-w-xl mx-auto leading-relaxed text-shadow-soft opacity-90">
              Skip the crowds. Discover the quiet sanctuaries and local haunts where India truly lives.
            </p>
          </div>

          <div className="w-full max-w-3xl px-4 animate-in zoom-in-95 duration-700 delay-300">
            <div className="bg-white/95 backdrop-blur-md rounded-full p-1 md:p-1.5 flex items-center shadow-2xl border border-white/40">
              <div className="pl-4 md:pl-5 text-primary/60">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Find a hidden cafe or quiet trail..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-sm md:text-lg h-10 md:h-14 placeholder:text-primary/30 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-accent hover:bg-accent/90 text-white h-10 md:h-14 px-6 md:px-10 font-bold text-[10px] md:text-xs tracking-[0.15em] uppercase gap-2 shadow-lg shrink-0"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {SUGGESTIONS.map((s) => (
                <button 
                  key={s}
                  onClick={() => { 
                    setSearchQuery(s); 
                    setIsExploring(true); 
                  }}
                  className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-[11px] font-bold hover:bg-white/30 transition-all shadow-sm uppercase tracking-widest"
                >
                  {s}
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
        <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12">
          {/* Back button offset to avoid logo collision on mobile */}
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all ml-0 md:ml-48"
          >
            <ChevronLeft className="w-4 h-4" /> Back Home
          </button>

          <div className="bg-white/90 backdrop-blur-xl p-1 rounded-full flex gap-1 shadow-md border border-border/40 w-full max-w-[180px] md:max-w-sm">
            <button
              onClick={() => setMode('tourist')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'tourist' ? "bg-primary text-white" : "text-muted-foreground"
              )}
            >
              <Compass className="w-3.5 h-3.5" /> Tourist
            </button>
            <button
              onClick={() => setMode('hidden')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'hidden' ? "bg-accent text-white" : "text-muted-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" /> Hidden Gems
            </button>
          </div>
          
          <div className="w-20 hidden md:block" />
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
