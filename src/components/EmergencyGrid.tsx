"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        <p className="text-on-surface-variant font-medium">Loading emergency protocols...</p>
      </section>
    );
  }

  if (displayProtocols.length === 0) {
    return (
      <section className="py-20 px-4 max-w-6xl mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center">
          <SearchX size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">No instructions found</h2>
          <p className="text-on-surface-variant mt-1">Try searching for simpler keywords like "pain", "tooth", or "bleed".</p>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {displayProtocols.map((protocol) => {
        return (
          <Link key={protocol.id} href={`/trauma/${protocol.id}`} className="block h-full">
            <div className="group h-full bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="aspect-square overflow-hidden">
                <Image 
                  src={protocol.thumbnail} 
                  alt={language === 'kn' ? protocol.title.kn : protocol.title.en} 
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized={protocol.thumbnail.startsWith('/api/')}
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-sm md:text-xl font-bold text-on-surface leading-tight md:leading-snug">
                  {language === 'kn' ? protocol.title.kn : protocol.title.en}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
