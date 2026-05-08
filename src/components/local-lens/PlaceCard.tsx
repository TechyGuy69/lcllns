
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
}

export function PlaceCard({ place, onClick, className }: PlaceCardProps) {
  // Description-based logic for "Why this place?"
  const getRecommendationReason = () => {
    if (place.isHiddenGem) {
      if (place.crowdLevel === 'Low') return "Loved by locals, low crowd";
      return "An authentic pocket of local culture";
    }
    if (place.isTouristFavorite) {
      if (place.rating > 4.5) return "Highly rated, trending spot";
      return "Iconic landmark, must-visit";
    }
    return "Curated for authentic vibes";
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden glass-card cursor-pointer flex flex-col rounded-[2.5rem] border-0 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl",
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
          {place.isHiddenGem ? (
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

      <div className="p-6 md:p-8 flex-1 flex flex-col">
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

        {/* Why this place? Feature */}
        <div className="bg-secondary/30 rounded-2xl p-3 mb-6 flex items-start gap-2 border border-secondary/50">
          <Info className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
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
