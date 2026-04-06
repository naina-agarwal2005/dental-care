
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchX, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem } from '@/lib/types';

interface EmergencyGridProps {
  protocols?: TraumaItem[];
  loading?: boolean;
}

export default function EmergencyGrid({ protocols, loading }: EmergencyGridProps) {
  const { t, language } = useLanguage();
  const displayProtocols = protocols || [];

  if (loading) {
    return (
      <section className="py-20 px-4 max-w-6xl mx-auto text-center flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-slate-500 font-medium">Loading emergency protocols...</p>
      </section>
    );
  }

  if (displayProtocols.length === 0) {
    return (
      <section className="py-20 px-4 max-w-6xl mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
          <SearchX size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">No instructions found</h2>
          <p className="text-slate-500 mt-1">Try searching for simpler keywords like "pain", "tooth", or "bleed".</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-12 px-4 max-w-6xl mx-auto" id="symptoms">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {displayProtocols.map((protocol) => {
          return (
            <Link key={protocol.id} href={`/trauma/${protocol.id}`} className="block h-full">
              <Card 
                className="h-full group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-primary/30 bg-card overflow-hidden rounded-[1.5rem]"
              >
                <div className="relative aspect-[4/3] md:aspect-video bg-muted overflow-hidden">
                  <Image 
                    src={protocol.thumbnail} 
                    alt={language === 'kn' ? protocol.title.kn : protocol.title.en} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="p-3 pb-1 md:p-4 md:pb-2">
                  <CardTitle className="text-sm md:text-lg group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {language === 'kn' ? protocol.title.kn : protocol.title.en}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
                  <div className="flex items-center text-primary font-black text-[10px] md:text-xs uppercase tracking-widest mt-1 md:mt-2">
                    {t.emergencyGrid.viewInstructions}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
