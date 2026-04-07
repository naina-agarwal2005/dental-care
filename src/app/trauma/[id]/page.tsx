
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, ArrowLeft, MapPin, Play } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white/90 backdrop-blur-md border-b border-[#caf0f8] shadow-sm shadow-[#0077b6]/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <Link href="/">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              {language === 'kn' ? protocol.title.kn : protocol.title.en}
            </h1>
          </div>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all ${language === 'kn' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto pb-8 relative flex flex-col min-h-[calc(100vh-80px)]">

        <div className="w-full max-w-6xl mx-auto flex-1 px-0 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT: STEPS */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="px-4 md:px-0">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-[#caf0f8]">
                  <div className="w-10 h-10 rounded-full bg-[#caf0f8]/50 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-[#0077b6]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#03045e]">
                    {t.emergencyGrid.urgentActions}
                  </h2>
                </div>
                
                {/* Steps List */}
                <div className="divide-y divide-[#caf0f8]/30">
                  {protocol.steps.map((step, idx) => (
                    <div key={idx} className={`group ${idx === 0 ? 'pb-6' : 'py-6'}`}>
                      {/* Step Number Label */}
                      <h3 className="text-lg md:text-xl font-semibold text-[#0077b6] mb-4">
                        {language === 'kn' ? `ಹಂತ ${step.stepNumber}` : `Step ${step.stepNumber}`}
                      </h3>

                      {/* Step Image */}
                      {step.imageUrl && (
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#caf0f8]/50 shadow-md bg-white mb-6">
                          <Image 
                            src={step.imageUrl} 
                            alt={`Step ${step.stepNumber}`} 
                            fill 
                            className="object-cover"
                            unoptimized={step.imageUrl.startsWith('/api/')}
                          />
                        </div>
                      )}

                      {/* Step Description */}
                      <p className="text-base md:text-lg leading-relaxed text-slate-700">
                        {language === 'kn' ? step.text.kn : step.text.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: VIDEO */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24 px-4 md:px-0">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#caf0f8]">
                  <div className="w-10 h-10 rounded-full bg-[#caf0f8]/50 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 text-[#0077b6]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#03045e]">
                    {language === 'kn' ? 'ವೀಡಿಯೊ ಗೈಡ್' : 'Video Guide'}
                  </h2>
                </div>

                {/* Video Embed */}
                {embedUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-2 border-[#caf0f8]/50">
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
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900 group border-2 border-[#caf0f8]/50">
                    <Image
                      src={protocol.thumbnail}
                      alt={language === 'kn' ? protocol.title.kn : protocol.title.en}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/20">
                      <a 
                        href={watchUrl} 
                        target="_blank" 
                        className="w-20 h-20 rounded-full bg-white hover:bg-[#0077b6] hover:text-white transition-all transform hover:scale-110 flex items-center justify-center text-[#0077b6] shadow-2xl group-hover:shadow-primary/50" 
                        rel="noreferrer"
                      >
                        <Play fill="currentColor" size={36} className="ml-1" />
                      </a>
                      <span className="text-sm font-bold uppercase tracking-widest text-white bg-slate-900/50 px-4 py-2 rounded-full">
                        Watch on YouTube
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Mobile Locate Button */}
        <div className="md:hidden sticky bottom-6 z-40 px-4 pb-2 w-full pointer-events-none flex justify-center mt-8">
          <Link 
            href="/locate" 
            className="pointer-events-auto flex items-center justify-center gap-2 py-3.5 px-8 w-full max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-2xl shadow-primary/30 border border-primary/20 active:scale-[0.95] transition-all"
          >
            <MapPin size={18} fill="currentColor" className="text-primary-foreground" />
            <span className="font-headline font-semibold text-sm whitespace-nowrap">
              {t.nav.locate}
            </span>
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-[#caf0f8]/50 py-6">
        <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Tooth Aids. {t.footer.copyright}
          </div>
          <Link href="/admin" className="text-[#0077b6] hover:text-[#03045e] font-black uppercase tracking-widest text-xs transition-colors">
            {t.nav.admin}
          </Link>
        </div>
      </footer>
    </div>
  );
}
