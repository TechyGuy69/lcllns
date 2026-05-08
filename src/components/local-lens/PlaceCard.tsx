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
        "group relative overflow-hidden glass-card cursor-pointer border-0 shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 backdrop-blur-md text-primary border-0 font-bold uppercase tracking-wider text-[10px]">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-2xl font-headline font-bold text-primary leading-tight group-hover:text-accent transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
            <Star className="w-4 h-4 fill-current" />
            {place.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5" />
          <span>{place.city}</span>
        </div>

        <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">
          {place.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", getCrowdColor(place.crowdLevel))}>
            <Users className="w-3.5 h-3.5" />
            {place.crowdLevel}
          </div>
          
          <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Authenticity: {place.authenticityScore}
          </div>
        </div>
      </div>
    </Card>
  );
}
