
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
        console.error("AI Analysis failed", error);
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
          {/* Back Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 z-[110] bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl border border-white hover:scale-110 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>

          {/* Image Column */}
          <div className="relative w-full md:w-1/2 h-[40vh] md:h-full shrink-0">
            <Image 
              src={place.imageUrl} 
              alt={place.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px]">
                {place.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 leading-tight text-shadow-strong">
                {place.name}
              </h1>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-90">
                <MapPin className="w-5 h-5 text-accent" />
                {place.city}
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 bg-background h-[60vh] md:h-full overflow-y-auto no-scrollbar p-8 md:p-20 flex flex-col gap-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Rating', val: place.rating, icon: <Star className="w-4 h-4 fill-current text-amber-500" /> },
                { label: 'Reviews', val: place.reviews.toLocaleString(), icon: <Users className="w-4 h-4 text-muted-foreground" /> },
                { label: 'Crowd', val: place.crowdLevel, icon: <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">!</div> },
                { label: 'Local Vibe', val: `${place.authenticityScore}%`, icon: <Sparkles className="w-4 h-4 text-accent" /> },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-2 text-xl font-bold text-primary">
                    {stat.icon}
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-3xl">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Discovery Details</h2>
              <p className="text-lg md:text-2xl text-primary/80 font-medium leading-relaxed font-body italic">
                {place.description}
              </p>
            </div>

            {/* AI Analysis Section */}
            <div className="mt-auto pt-12 border-t border-border/60">
              <div className="bg-accent/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-accent/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                  <Sparkles className="w-48 h-48 text-accent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-accent text-white p-2.5 rounded-full shadow-lg shadow-accent/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Expert AI Intelligence</h3>
                  </div>

                  {isAnalyzing ? (
                    <div className="flex flex-col gap-6">
                      <div className="h-6 w-48 bg-accent/10 rounded-full animate-pulse" />
                      <div className="space-y-3">
                        <div className="h-4 w-full bg-accent/5 rounded-full animate-pulse" />
                        <div className="h-4 w-5/6 bg-accent/5 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                      <div className="flex items-center gap-8">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">Authenticity</span>
                          <span className="text-4xl md:text-5xl font-headline font-bold text-accent">{aiAnalysis.authenticityScore}<span className="text-xl">/100</span></span>
                        </div>
                        <div className="h-16 w-px bg-accent/20" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Classification</span>
                          <Badge className={cn(
                            "uppercase tracking-[0.1em] text-[10px] px-5 py-2 rounded-full border-0",
                            aiAnalysis.isHiddenGem ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-muted text-muted-foreground"
                          )}>
                            {aiAnalysis.isHiddenGem ? 'Hidden Gem' : 'Popular Spot'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
                          <span className="bg-accent/10 p-1 rounded-md mr-1"><Info className="w-3 h-3 text-accent inline" /></span> Why we recommend this
                        </span>
                        <p className="text-base md:text-lg text-primary/70 font-medium leading-relaxed italic">
                          "{aiAnalysis.reasoning}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setIsAnalyzing(true)}
                      className="rounded-full bg-accent text-white hover:bg-accent/90 font-bold uppercase tracking-widest text-[10px] px-10 py-6"
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
