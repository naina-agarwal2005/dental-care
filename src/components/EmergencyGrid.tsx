
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SearchX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem } from '@/lib/types';

interface EmergencyGridProps {
  protocols?: TraumaItem[];
}

export default function EmergencyGrid({ protocols }: EmergencyGridProps) {
  const { t, language } = useLanguage();
  const displayProtocols = protocols || [];

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
                className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 bg-card overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-video md:aspect-[4/3] bg-muted overflow-hidden">
                  <Image 
                    src={protocol.thumbnail} 
                    alt={language === 'kn' ? protocol.title.kn : protocol.title.en} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base md:text-xl group-hover:text-primary transition-colors leading-tight">
                    {language === 'kn' ? protocol.title.kn : protocol.title.en}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-primary font-black text-[10px] md:text-xs uppercase tracking-widest">
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
