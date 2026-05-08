"use client"

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Map as MapIcon, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  mode: 'tourist' | 'hidden';
  setMode: (mode: 'tourist' | 'hidden') => void;
}

export function SearchOverlay({ searchQuery, setSearchQuery, mode, setMode }: SearchOverlayProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <div className="glass rounded-full p-2 flex flex-col md:flex-row items-center gap-2">
        {/* Mode Toggle */}
        <div className="flex bg-white/5 rounded-full p-1 self-stretch md:self-auto">
          <button
            onClick={() => setMode('tourist')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
              mode === 'tourist' 
                ? "bg-primary text-white shadow-lg" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Tourist</span>
          </button>
          <button
            onClick={() => setMode('hidden')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
              mode === 'hidden' 
                ? "bg-accent text-accent-foreground shadow-lg" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Hidden Gems</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cafes, parks, cities..."
            className="bg-transparent border-0 ring-0 focus-visible:ring-0 text-lg h-12 pl-12 placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}