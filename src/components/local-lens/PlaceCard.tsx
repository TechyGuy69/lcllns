"use client"

import React from 'react';
import Image from 'next/image';
import { Place } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, Users, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  className?: string;
}

export function PlaceCard({ place, onClick, className }: PlaceCardProps) {
  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden glass-card cursor-pointer border-0 flex flex-col rounded-[2rem]",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-56 md:h-64 w-full overflow-hidden shrink-0">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 backdrop-blur-md text-primary border-0 font-bold uppercase tracking-[0.15em] text-[9px] px-3 py-1">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-2xl md:text-3xl font-headline font-bold text-primary leading-[1.1] group-hover:text-accent transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600 shrink-0">
              <Star className="w-4 h-4 fill-current" />
              {place.rating}
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>{place.city}</span>
          </div>

          <p className="text-sm md:text-base text-muted-foreground font-light line-clamp-2 leading-relaxed italic">
            "{place.description}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border/40">
          <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border", getCrowdColor(place.crowdLevel))}>
            <Users className="w-3.5 h-3.5" />
            {place.crowdLevel} Crowd
          </div>
          
          <div className="flex items-center gap-2 text-accent text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {place.authenticityScore}% Authentic
          </div>
        </div>
      </div>
    </Card>
  );
}