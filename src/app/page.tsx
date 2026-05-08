
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

  const brandLogo = PlaceHolderImages.find(img => img.id === 'brand-logo');

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
        {/* Branding - Top Left */}
        <div className="absolute top-6 left-6 z-[20] flex items-center gap-3">
          {brandLogo && (
            <div className="relative w-8 h-8">
              <Image 
                src={brandLogo.imageUrl} 
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          )}
          <span className="text-white font-headline font-bold text-lg tracking-tight text-shadow-soft">
            LocalLens
          </span>
        </div>

        {/* Gemini AI Badge - Top Right */}
        <div className="absolute top-6 right-6 z-[20]">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 shadow-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest">Gemini AI</span>
          </div>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10 pb-20">
          <div className="mb-6 transform animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-10">
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em]">
                IN INDIA&apos;S ANTI-TOURIST GUIDE
              </span>
            </div>
            
            <h1 className="font-headline font-bold text-white tracking-tight leading-[1.1] text-6xl md:text-8xl mb-8 text-shadow-strong">
              See India <br />
              <span className="opacity-90 italic">differently.</span>
            </h1>
            
            <p className="text-sm md:text-lg text-white/80 font-medium max-w-xl mx-auto leading-relaxed text-shadow-soft px-4">
              Skip the tour buses. Find the places locals actually love — from hidden cafés to sacred spots tourists never reach.
            </p>
          </div>

          <div className="w-full max-w-2xl px-4 animate-in zoom-in-95 duration-700 delay-300">
            <div className="bg-white rounded-full p-1 flex items-center shadow-2xl overflow-hidden mb-6">
              <div className="pl-5 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Quiet trails in Munnar..."
                className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-sm md:text-base h-12 md:h-14 placeholder:text-gray-300 text-gray-800 font-medium"
              />
              <Button 
                onClick={onExplore}
                className="rounded-full bg-[#346b51] hover:bg-[#2a5641] text-white h-11 md:h-12 px-8 font-bold text-xs tracking-wider gap-2 shadow-lg shrink-0 mr-1"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {SHORTCUTS.map((shortcut) => (
                <button 
                  key={shortcut.label}
                  onClick={() => handleShortcutClick(shortcut.query)}
                  className="px-5 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white/90 text-[10px] font-bold hover:bg-white/10 transition-all uppercase tracking-wider"
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="absolute bottom-10 inset-x-0 z-[10] flex justify-center items-center gap-12 md:gap-24 opacity-60">
          <div className="text-center">
            <div className="text-white font-headline font-bold text-xl mb-1">20+</div>
            <div className="text-white/60 text-[9px] uppercase tracking-widest font-bold">Places</div>
          </div>
          <div className="text-center">
            <div className="text-white font-headline font-bold text-xl mb-1">10</div>
            <div className="text-white/60 text-[9px] uppercase tracking-widest font-bold">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-white font-headline font-bold text-xl mb-1 flex items-center justify-center gap-1">AI</div>
            <div className="text-white/60 text-[9px] uppercase tracking-widest font-bold">Powered</div>
          </div>
        </div>
      </section>

      {/* Discovery Page Section */}
      <section className={cn(
        "absolute inset-0 z-20 bg-background transition-transform duration-1000 ease-in-out flex flex-col overflow-hidden",
        isExploring ? "translate-x-0" : "translate-x-full"
      )}>
        <header className="relative z-30 flex items-center justify-between px-6 py-4 md:px-12">
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-primary/60 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm"
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
