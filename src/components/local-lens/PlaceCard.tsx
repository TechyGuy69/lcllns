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
        "group relative overflow-hidden glass-card cursor-pointer flex flex-col rounded-3xl",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-48 md:h-52 w-full overflow-hidden shrink-0">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 text-primary border-0 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full shadow-sm">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-xl font-headline font-bold text-primary leading-tight">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
            <Star className="w-3.5 h-3.5 fill-current" />
            {place.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          {place.city}
        </div>

        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-6">
          {place.description}
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-border">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <Users className="w-3.5 h-3.5 opacity-60" />
            {place.crowdLevel}
          </div>
          
          <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {place.authenticityScore}% Local
          </div>
        </div>
      </div>
    </Card>
  );
}