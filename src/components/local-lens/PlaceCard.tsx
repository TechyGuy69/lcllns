"use client"

import React from 'react';
import Image from 'next/image';
import { Place } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Star, MapPin, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  className?: string;
}

export function PlaceCard({ place, onClick, className }: PlaceCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden glass-card cursor-pointer flex flex-col rounded-[2rem] border-0",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-40 md:h-48 w-full overflow-hidden shrink-0">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 text-primary border-0 font-bold uppercase tracking-widest text-[9px] px-3 py-1 rounded-full shadow-sm">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="text-lg md:text-xl font-headline font-bold text-primary leading-tight">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 shrink-0">
            <Star className="w-3 h-3 fill-current" />
            {place.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 text-accent" />
          {place.city}
        </div>

        <p className="text-xs md:text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-4">
          {place.description}
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">
            <Users className="w-3 h-3 opacity-60" />
            {place.crowdLevel} Crowd
          </div>
          
          <div className="flex items-center gap-1.5 text-accent text-[9px] font-bold uppercase tracking-tighter">
            <Sparkles className="w-3 h-3" />
            {place.authenticityScore}% Local
          </div>
        </div>
      </div>
    </Card>
  );
}