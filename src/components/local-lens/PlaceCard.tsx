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
      case 'Low': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'High': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden glass-card cursor-pointer border-0",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={place.imageUrl} 
          alt={place.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className="bg-primary/80 backdrop-blur-md text-white border-0">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3 relative">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-headline font-semibold text-foreground leading-tight group-hover:text-accent transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            {place.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4" />
          <span>{place.city}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {place.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold", getCrowdColor(place.crowdLevel))}>
              <Users className="w-3.5 h-3.5" />
              {place.crowdLevel}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Auth Score: {place.authenticityScore}
          </div>
        </div>
      </div>
    </Card>
  );
}
