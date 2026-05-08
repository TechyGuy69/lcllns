
"use client"

import React from 'react';
import Image from 'next/image';
import { Place } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, MapPin, Sparkles, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  className?: string;
  mode?: 'tourist' | 'hidden';
}

export function PlaceCard({ place, onClick, className, mode = 'tourist' }: PlaceCardProps) {
  // Description-based logic for "Why this place?"
  const getRecommendationReason = () => {
    if (mode === 'hidden') {
      return "Loved by locals, low crowd";
    }
    return "Highly rated, trending spot";
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden glass-card cursor-pointer flex flex-col rounded-[2.5rem] border-0 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <Badge className="bg-white/95 text-primary border-0 font-bold uppercase tracking-widest text-[8px] px-3 py-1 rounded-full shadow-sm">
            {place.category}
          </Badge>
          {mode === 'hidden' ? (
            <Badge className="bg-accent text-white border-0 font-bold uppercase tracking-widest text-[8px] px-3 py-1 rounded-full shadow-lg">
              Hidden Gem
            </Badge>
          ) : (
            <Badge className="bg-amber-600 text-white border-0 font-bold uppercase tracking-widest text-[8px] px-3 py-1 rounded-full shadow-lg">
              Popular
            </Badge>
          )}
        </div>
      </div>

      <div className="p-8 md:p-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-xl md:text-2xl font-headline font-bold text-primary leading-tight group-hover:text-accent transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-[12px] font-bold text-amber-600 shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            {place.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
          <MapPin className="w-3 h-3 text-accent" />
          {place.city}
        </div>

        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-6">
          {place.description}
        </p>

        {/* Intelligence Feature */}
        <div className="bg-secondary/30 rounded-2xl p-4 mb-6 flex items-start gap-3 border border-secondary/50">
          <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <span className="text-[10px] font-bold text-primary/70 leading-tight">
            {getRecommendationReason()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-5 mt-auto border-t border-border/50">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">
            <Users className="w-3.5 h-3.5 opacity-60" />
            {place.crowdLevel} Crowd
          </div>
          
          <div className="flex items-center gap-1.5 text-accent text-[9px] font-bold uppercase tracking-tighter">
            <Sparkles className="w-3.5 h-3.5" />
            {place.authenticityScore}% Local
          </div>
        </div>
      </div>
    </Card>
  );
}
