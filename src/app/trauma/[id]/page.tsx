
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, ChevronLeft, MapPin, Play } from 'lucide-react';
import { TraumaItem } from '@/lib/types';
import { fetchTraumaById } from '@/lib/api-client';

function getYouTubeVideoId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

export default function TraumaDetailPage() {
  const params = useParams();
  const { t, language, setLanguage } = useLanguage();
  const [protocol, setProtocol] = useState<TraumaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = String(params.id || "");
    if (!id) return;
    fetchTraumaById(id)
      .then((data) => setProtocol(data))
      .catch(() => setProtocol(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const videoId = protocol ? getYouTubeVideoId(protocol.videoUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : protocol?.videoUrl;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>;
  }

  if (!protocol) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Protocol not found</h1>
          <Button asChild>
            <Link href="/">{t.emergencyGrid.backBtn}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 md:pb-12">
      <div className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
            <ChevronLeft size={18} /> {t.emergencyGrid.backBtn}
          </Link>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${language === 'kn' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-headline font-black text-slate-900 tracking-tighter">
                {language === 'kn' ? protocol.title.kn : protocol.title.en}
              </h1>
            </div>

            <div className="space-y-4">
              {embedUrl ? (
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border-4 border-white">
                  <iframe
                    src={embedUrl}
                    title={language === 'kn' ? protocol.title.kn : protocol.title.en}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 group border-4 border-white">
                  <Image
                    src={protocol.thumbnail}
                    alt={language === 'kn' ? protocol.title.kn : protocol.title.en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <a href={watchUrl} target="_blank" className="w-16 h-16 rounded-full bg-white/90 hover:bg-primary hover:text-white transition-all transform hover:scale-110 flex items-center justify-center text-primary shadow-xl" rel="noreferrer">
                      <Play fill="currentColor" size={32} className="ml-1" />
                    </a>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">Watch on YouTube</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] p-5 md:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 md:gap-3 text-destructive mb-6 md:mb-8">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-base md:text-xl font-black uppercase tracking-tight">{t.emergencyGrid.urgentActions}</h2>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                {protocol.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 md:gap-6 group">
                    <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-destructive/5 text-destructive flex items-center justify-center font-black text-sm md:text-lg border border-destructive/10 group-hover:bg-destructive group-hover:text-white transition-colors duration-300">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-3 pt-0.5 md:pt-1">
                      {step.imageUrl && (
                        <div className="relative w-full aspect-[16/10] md:aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200">
                          <Image src={step.imageUrl} alt={`Step ${step.stepNumber}`} fill className="object-cover" />
                        </div>
                      )}
                      <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
                        {language === 'kn' ? step.text.kn : step.text.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-6 hidden md:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-accent rounded-[2rem] p-8 text-white shadow-xl shadow-accent/20">
                <h3 className="text-2xl font-black mb-4 leading-tight">Professional Assistance</h3>
                <p className="text-white/80 mb-8 font-medium">
                  Immediate clinical care is required. Locate the nearest verified center in Patna.
                </p>
                <Button asChild size="lg" className="w-full h-14 bg-white text-accent hover:bg-white/90 rounded-2xl font-black text-lg shadow-lg">
                  <Link href="/locate">
                    <MapPin size={20} className="mr-2" /> {t.emergencyGrid.findClinicBtn}
                  </Link>
                </Button>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Patna Ambulance</p>
                  <p className="text-5xl font-black text-primary tracking-tighter">102</p>
                </div>
                <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl font-bold border-slate-100 hover:bg-slate-50 text-slate-900" asChild>
                  <a href="tel:102">Call Service Directly</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
