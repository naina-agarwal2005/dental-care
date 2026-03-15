
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Share2, PhoneCall } from 'lucide-react';
import { INSTRUCTIONAL_VIDEOS } from "@/lib/mock-data";
import { useLanguage } from '@/context/LanguageContext';

export default function VideoLibrary() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto" id="videos">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="max-w-xl">
          <h2 className="text-3xl font-headline font-bold text-primary mb-2">{t.videoLibrary.title}</h2>
          <p className="text-muted-foreground">{t.videoLibrary.subtitle}</p>
        </div>
        <Button variant="outline" className="shrink-0">{t.videoLibrary.viewFull}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INSTRUCTIONAL_VIDEOS.map((video) => (
          <Card key={video.id} className="group border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-md bg-muted">
                <Image 
                  src={video.thumbnail} 
                  alt={video.title} 
                  fill
                  className="object-cover transition-transform group-hover:scale-105 duration-500"
                  data-ai-hint="dental care"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 flex items-center justify-center text-primary shadow-xl">
                    <Play fill="currentColor" size={24} className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Clock size={10} /> {video.duration}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors mb-2">{video.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.videoLibrary.team}</span>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 bg-primary/5 rounded-2xl p-8 border border-primary/10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
          <PhoneCall size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">{t.videoLibrary.hotlineTitle}</h3>
        <p className="text-muted-foreground max-w-md mb-6">{t.videoLibrary.hotlineSub}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-destructive hover:bg-destructive/90 text-white px-8 h-14 text-xl font-black">
            {t.videoLibrary.callBtn}
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 border-primary text-primary hover:bg-primary/10">
            {t.videoLibrary.triageBtn}
          </Button>
        </div>
      </div>
    </section>
  );
}
