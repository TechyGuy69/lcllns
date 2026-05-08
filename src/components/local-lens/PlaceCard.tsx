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
      case 'Low': return 'text-emerald-700 bg-emerald-100';
      case 'Medium': return 'text-amber-700 bg-amber-100';
      case 'High': return 'text-rose-700 bg-rose-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden glass-card cursor-pointer border-0 shadow-lg flex flex-col",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-48 md:h-56 w-full overflow-hidden shrink-0">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        
        <div className="absolute top-3 right-3 md:top-4 md:right-4">
          <Badge className="bg-white/90 backdrop-blur-md text-primary border-0 font-bold uppercase tracking-wider text-[8px] md:text-[10px]">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between space-y-3 md:space-y-4">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-xl md:text-2xl font-headline font-bold text-primary leading-tight group-hover:text-accent transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-1 text-xs md:text-sm font-bold text-amber-600 shrink-0">
              <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              {place.rating}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>{place.city}</span>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border/50">
          <div className={cn("flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider", getCrowdColor(place.crowdLevel))}>
            <Users className="w-3 h-3 md:w-3.5 md:h-3.5" />
            {place.crowdLevel}
          </div>
          
          <div className="flex items-center gap-1 text-accent text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Auth: {place.authenticityScore}
          </div>
        </div>
      </div>
    </Card>
  );
}