
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

    const runAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyzePlaceForHiddenGem({ description: place.description });
        setAiAnalysis(result);
      } catch (error) {
        // AI Analysis failed silently
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [place]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] bg-background transition-transform duration-700 ease-in-out transform flex flex-col md:flex-row overflow-hidden shadow-2xl",
        place ? "translate-x-0" : "translate-x-full"
      )}
    >
      {place && (
        <>
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-[110] bg-white/90 backdrop-blur-md p-2.5 md:p-3 rounded-full shadow-2xl border border-white hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </button>

          <div className="relative w-full md:w-1/2 h-[40vh] md:h-full shrink-0">
            <Image 
              src={place.image} 
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/70 md:to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
              <Badge className="mb-3 md:mb-4 bg-white/20 backdrop-blur-md text-white border-white/30 px-3 py-1 md:px-4 md:py-1.5 rounded-full font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[8px] md:text-[10px]">
                {place.category}
              </Badge>
              <h1 className="text-3xl md:text-6xl font-headline font-bold mb-2 md:mb-4 leading-tight text-shadow-strong">
                {place.name}
              </h1>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-90">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                {place.city}
              </div>
            </div>
          </div>

          <div className="flex-1 bg-background h-[60vh] md:h-full overflow-y-auto no-scrollbar p-6 md:p-12 lg:p-20 flex flex-col gap-8 md:gap-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
              {[
                { label: 'Rating', val: typeof place.rating === 'number' ? place.rating.toFixed(1) : place.rating, icon: <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current text-amber-500" /> },
                { label: 'Reviews', val: (place.reviewCount || 0).toLocaleString(), icon: <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" /> },
                { label: 'Crowd', val: place.crowdLevel, icon: <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] md:text-[10px] font-bold">!</div> },
                { label: 'Experience', val: place.tags.includes('hidden') ? 'Authentic' : 'Trending', icon: <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" /> },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1 md:gap-2 min-w-0 overflow-hidden">
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-muted-foreground truncate block">{stat.label}</span>
                  <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-lg lg:text-xl font-bold text-primary truncate">
                    <span className="shrink-0">{stat.icon}</span>
                    <span className="truncate">{stat.val}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-3xl">
              <h2 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-4 md:mb-6">Discovery Details</h2>
              <p className="text-sm md:text-xl lg:text-2xl text-primary/80 font-medium leading-relaxed font-body italic">
                {place.description}
              </p>
            </div>

            <div className="mt-auto pt-8 md:pt-12 border-t border-border/60">
              <div className="bg-accent/5 rounded-[1.5rem] md:rounded-[3rem] p-5 md:p-12 border border-accent/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                  <Sparkles className="w-32 h-32 md:w-48 md:h-48 text-accent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                    <div className="bg-accent text-white p-2 md:p-2.5 rounded-full shadow-lg shadow-accent/20">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h3 className="text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-primary">Expert AI Intelligence</h3>
                  </div>

                  {isAnalyzing ? (
                    <div className="flex flex-col gap-4 md:gap-6">
                      <div className="h-5 w-32 md:h-6 md:w-48 bg-accent/10 rounded-full animate-pulse" />
                      <div className="space-y-2 md:space-y-3">
                        <div className="h-3 w-full bg-accent/5 rounded-full animate-pulse" />
                        <div className="h-3 w-5/6 bg-accent/5 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-12">
                        <div>
                          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-accent mb-1 md:mb-2 block">Authenticity</span>
                          <span className="text-3xl md:text-5xl font-headline font-bold text-accent">{aiAnalysis.authenticityScore}<span className="text-base md:text-xl">/100</span></span>
                        </div>
                        <div className="hidden sm:block h-10 md:h-16 w-px bg-accent/20" />
                        <div>
                          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 md:mb-2 block">Classification</span>
                          <Badge className={cn(
                            "uppercase tracking-[0.05em] md:tracking-[0.1em] text-[7px] md:text-[10px] px-3 py-1 md:px-5 md:py-2 rounded-full border-0",
                            aiAnalysis.isHiddenGem ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-muted text-muted-foreground"
                          )}>
                            {aiAnalysis.isHiddenGem ? 'Hidden Gem' : 'Popular Spot'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl border border-white">
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                          <span className="bg-accent/10 p-1 rounded-md"><Info className="w-2.5 h-2.5 md:w-3 md:h-3 text-accent" /></span> Why we recommend this
                        </span>
                        <p className="text-xs md:text-base lg:text-lg text-primary/70 font-medium leading-relaxed italic">
                          "{aiAnalysis.reasoning}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setIsAnalyzing(true)}
                      className="rounded-full bg-accent text-white hover:bg-accent/90 font-bold uppercase tracking-widest text-[8px] md:text-[10px] px-8 py-4 md:px-10 md:py-6"
                    >
                      Run Fresh Analysis
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
