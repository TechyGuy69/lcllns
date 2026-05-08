
"use client"

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Compass, Sparkles, ChevronLeft } from 'lucide-react';
import { InteractiveMap } from '@/components/local-lens/InteractiveMap';
import { ResultsPanel } from '@/components/local-lens/ResultsPanel';
import { PlaceDetailView } from '@/components/local-lens/PlaceDetailView';
import { MOCK_PLACES, Place } from '@/lib/mock-data';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit, getDocs, addDoc } from 'firebase/firestore';

const STATIC_HERO_IMAGE = "https://i.ibb.co/yB718YNK/dicson-s-Pw8-Rq-YTdn0-unsplash.jpg";

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
  const { data: firestorePlaces } = useCollection(placesCollection);

  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'tourist' | 'hidden'>('tourist');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isExploring, setIsExploring] = useState(false);

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
        // Silent error for seeding
      }
    }
    seedData();
  }, [db]);

  const allPlaces = useMemo(() => {
    if (firestorePlaces && firestorePlaces.length > 0) {
      return firestorePlaces.filter((p: any) => p.lat && p.lng) as Place[];
    }
    return MOCK_PLACES;
  }, [firestorePlaces]);

  const filteredPlaces = useMemo(() => {
    const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    
    // 1. Initial filter based on mode
    const modeMatches = allPlaces.filter((place) => {
      if (mode === 'tourist') {
        return (place.rating >= 4.2 && place.reviewCount > 800);
      } else {
        return (place.reviewCount < 300 || place.tags.includes('hidden') || place.tags.includes('local'));
      }
    });

    // 2. If no search query, return mode-matched places
    if (queryWords.length === 0) return modeMatches;

    // 3. Scoring System for Intelligent Search
    const scored = modeMatches.map(place => {
      let score = 0;
      const name = place.name.toLowerCase();
      const city = place.city.toLowerCase();
      const cat = place.category.toLowerCase();
      const desc = place.description.toLowerCase();
      const tags = place.tags.map(t => t.toLowerCase());

      queryWords.forEach(word => {
        // Category match (+3)
        if (cat.includes(word)) score += 3;
        
        // Tag match (+2)
        if (tags.some(t => t.includes(word))) score += 2;
        
        // Name, City, or Description match (+1)
        if (name.includes(word) || city.includes(word) || desc.includes(word)) score += 1;
        
        // Intent detection boost (+2)
        const isHiddenIntent = ['hidden', 'quiet', 'peaceful', 'local', 'gem'].includes(word);
        const isPopularIntent = ['popular', 'tourist', 'famous', 'trending'].includes(word);
        
        if (isHiddenIntent && (tags.includes('hidden') || tags.includes('local'))) {
          score += 2;
        }
        if (isPopularIntent && (tags.includes('popular') || tags.includes('tourist'))) {
          score += 2;
        }
      });

      return { ...place, searchScore: score };
    });

    // 4. Filter by score > 0, sort by score, and limit to top 20
    return scored
      .filter(p => p.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 20);
  }, [searchQuery, mode, allPlaces]);

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
      
      {/* Landing View */}
      <section className={cn(
        "absolute inset-0 z-10 transition-transform duration-1000 ease-in-out min-h-screen flex items-center justify-center",
        isExploring ? "-translate-y-full" : "translate-y-0"
      )}>
        
        {/* Static Background Layer */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <Image
            src={STATIC_HERO_IMAGE}
            alt="Authentic India"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45 z-10" />
        </div>

        {/* Branding */}
        <div className="absolute top-6 left-6 text-white text-xl font-bold tracking-tight z-30 animate-in fade-in duration-1000">
          LocalLens
        </div>

        {/* Content */}
        <div className="relative z-30 w-full max-w-5xl px-6 flex flex-col items-center text-center space-y-12">
          
          <div className="space-y-6">
            <h1 className="text-white text-7xl md:text-9xl font-headline leading-[1.05] tracking-tighter drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              See India <br />
              <span className="italic font-normal">differently.</span>
            </h1>
            
            <p className="text-white/85 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed text-shadow-soft font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Skip the crowds. Discover the quiet sanctuaries and local haunts where India truly lives.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-10 w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
            {/* Fancy Search Bar with Clear Glass Transition */}
            <div className="w-full flex items-center bg-white rounded-full p-1.5 border border-white/20 shadow-2xl max-w-2xl transition-all duration-700 ease-in-out group focus-within:bg-white/10 focus-within:backdrop-blur-2xl focus-within:ring-2 focus-within:ring-white/30">
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
                placeholder="Find a hidden café or quiet trail..."
                className="flex-1 bg-transparent outline-none text-gray-800 focus:text-white transition-colors duration-500 px-6 text-sm md:text-lg h-12 md:h-14 placeholder:text-gray-400 focus:placeholder:text-white/50"
              />
              <button 
                onClick={onExplore}
                className="bg-green-700 text-white px-8 md:px-10 h-12 md:h-14 rounded-full hover:bg-green-600 active:scale-95 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg mr-2"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {SHORTCUTS.map((shortcut) => (
                <button 
                  key={shortcut.label}
                  onClick={() => handleShortcutClick(shortcut.query)}
                  className="px-6 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/5 text-white/90 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 hover:text-white transition-all active:scale-95"
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore View */}
      <section className={cn(
        "absolute inset-0 z-20 bg-background transition-transform duration-1000 ease-in-out flex flex-col overflow-hidden min-h-screen",
        isExploring ? "translate-y-0" : "translate-y-full"
      )}>
        <header className="relative z-30 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 shrink-0 bg-background/80 backdrop-blur-md border-b border-border/10">
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-primary/70 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] transition-all bg-white/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border/20 shadow-sm"
          >
            <Compass className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
          </button>

          <div className="bg-white/90 backdrop-blur-xl p-1 rounded-full flex gap-1 shadow-md border border-border/40 w-full max-w-[140px] md:max-w-xs">
            <button
              onClick={() => {
                setMode('tourist');
                setSelectedPlace(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                mode === 'tourist' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-primary/60"
              )}
            >
              <Compass className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Tourist</span>
            </button>
            <button
              onClick={() => {
                setMode('hidden');
                setSelectedPlace(null);
              }}
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
            mode={mode}
          />
          
          <ResultsPanel 
            places={filteredPlaces}
            mode={mode}
            isExpanded={isPanelExpanded}
            setIsExpanded={setIsPanelExpanded}
            onPlaceClick={handlePlaceSelect}
            selectedPlaceId={selectedPlace?.id}
          />
        </div>
      </section>

      {/* Place Detail Overlay */}
      <PlaceDetailView 
        place={selectedPlace} 
        onClose={closePlaceDetail} 
      />

      <Toaster />
    </main>
  );
}
