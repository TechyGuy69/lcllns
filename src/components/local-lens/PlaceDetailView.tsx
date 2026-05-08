
"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Place } from '@/lib/mock-data';
import { analyzePlaceForHiddenGem, AnalyzePlaceForHiddenGemOutput } from '@/ai/flows/intelligent-hidden-gem-discovery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  MapPin, 
  Star, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Info,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceDetailViewProps {
  place: Place | null;
  onClose: () => void;
}

export function PlaceDetailView({ place, onClose }: PlaceDetailViewProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzePlaceForHiddenGemOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!place) {
      setAiAnalysis(null);
      setIsAnalyzing(false);
      return;
    }

    // Automatically trigger analysis for premium feel
    const runAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyzePlaceForHiddenGem({ description: place.description });
        setAiAnalysis(result);
      } catch (error) {
        console.error("AI Analysis failed", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [place]);

  if (!place) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] bg-background transition-all duration-700 ease-in-out transform",
        place ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="relative h-full w-full flex flex-col md:flex-row overflow-y-auto no-scrollbar">
        
        {/* Back Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-xl border border-white hover:scale-110 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>

        {/* Visual Column */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-full shrink-0">
          <Image 
            src={place.imageUrl} 
            alt={place.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
          
          <div className="absolute bottom-8 left-8 right-8 text-white md:hidden">
            <h1 className="text-3xl font-headline font-bold mb-2">{place.name}</h1>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-90">
              <MapPin className="w-4 h-4 text-accent" />
              {place.city}
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 bg-background p-8 md:p-16 flex flex-col gap-10">
          <div className="hidden md:block">
            <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20 border-0 px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px]">
              {place.category}
            </Badge>
            <h1 className="text-5xl font-headline font-bold text-primary mb-4 leading-tight">
              {place.name}
            </h1>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              {place.city}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</span>
              <div className="flex items-center gap-1.5 text-lg font-bold text-amber-600">
                <Star className="w-4 h-4 fill-current" />
                {place.rating}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reviews</span>
              <div className="text-lg font-bold text-primary">
                {place.reviews.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crowd</span>
              <div className="flex items-center gap-1.5 text-lg font-bold text-primary">
                <Users className="w-4 h-4 opacity-60" />
                {place.crowdLevel}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Local Feel</span>
              <div className="flex items-center gap-1.5 text-lg font-bold text-accent">
                <Sparkles className="w-4 h-4" />
                {place.authenticityScore}%
              </div>
            </div>
          </div>

          <div className="max-w-2xl">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-4">About this experience</h2>
            <p className="text-lg text-primary/80 font-medium leading-relaxed font-body">
              {place.description}
            </p>
          </div>

          {/* AI Analysis Section */}
          <div className="mt-auto pt-10 border-t border-border/60">
            <div className="bg-accent/5 rounded-[2.5rem] p-8 md:p-10 border border-accent/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-24 h-24 text-accent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-accent text-white p-2 rounded-full shadow-lg shadow-accent/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Intelligent Analysis</h3>
                </div>

                {isAnalyzing ? (
                  <div className="flex flex-col gap-4 animate-pulse">
                    <div className="h-4 w-32 bg-accent/20 rounded-full" />
                    <div className="h-20 w-full bg-accent/10 rounded-2xl" />
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent mb-1">Authenticity Score</span>
                        <span className="text-4xl font-headline font-bold text-accent">{aiAnalysis.authenticityScore}/100</span>
                      </div>
                      <div className="h-10 w-px bg-accent/20 mx-2" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</span>
                        <Badge className={cn(
                          "uppercase tracking-widest text-[9px] px-3 py-1 rounded-full",
                          aiAnalysis.isHiddenGem ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {aiAnalysis.isHiddenGem ? 'Hidden Gem' : 'Tourist Spot'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-3">
                        <Info className="w-3 h-3" /> Expert Reasoning
                      </span>
                      <p className="text-sm md:text-base text-primary/70 font-medium leading-relaxed italic">
                        "{aiAnalysis.reasoning}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setIsAnalyzing(true)}
                    variant="outline"
                    className="rounded-full border-accent/20 hover:bg-accent/5 text-accent font-bold uppercase tracking-widest text-[10px]"
                  >
                    Generate Analysis
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
