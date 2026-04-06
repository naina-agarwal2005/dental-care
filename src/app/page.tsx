
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import EmergencyGrid from '@/components/EmergencyGrid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, MapPin, ShieldPlus } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem } from '@/lib/types';
import { fetchTraumas } from '@/lib/api-client';

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTraumas()
      .then(setTraumas)
      .catch(() => setTraumas([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredProtocols = useMemo(() => {
    if (!search.trim()) return traumas;
    const query = search.toLowerCase().trim();
    return traumas.filter((p) => 
      p.title.en.toLowerCase().includes(query) ||
      p.title.kn.toLowerCase().includes(query)
    );
  }, [search, traumas]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#caf0f8] shadow-sm shadow-[#0077b6]/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <ShieldPlus className="h-7 w-7 text-primary" />
              <span className="font-headline font-black text-xl tracking-tighter text-primary inline-block">
                Tooth Aids
              </span>
            </Link>
            
            {/* Desktop Permanent Search Bar */}
            <div className="hidden md:block flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <Input 
                type="text"
                placeholder={t.hero.searchPlaceholder}
                className="h-10 rounded-full border border-slate-200 shadow-sm text-slate-900 text-sm bg-slate-50 focus:bg-white hover:bg-slate-100 transition-colors focus-visible:ring-primary/20 pl-11 pr-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors"
                onClick={() => setIsSearchOpen((prev) => !prev)}
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </Button>

              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 hidden md:flex items-center gap-2 font-bold rounded-full h-9 px-4 text-primary-foreground" asChild>
                <Link href="/locate">
                  <MapPin size={16} fill="currentColor" />
                  {t.nav.locate}
                </Link>
              </Button>

              {/* Language Switcher Toggle */}
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

          {isSearchOpen && (
            <div className="pb-4 md:hidden">
              <div className="max-w-md w-full relative ml-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <Input 
                  type="text"
                  placeholder={t.hero.searchPlaceholder}
                  className="h-12 rounded-full border border-slate-200 shadow-sm text-slate-900 text-sm bg-white focus-visible:ring-primary/20 pl-11 pr-11"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 bg-gradient-to-b from-[#caf0f8]/20 to-white relative flex flex-col">
        <div id="symptoms" className="pt-8 md:pt-12 flex-1">
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#03045e] text-center">
              {language === 'kn' ? 'ತುರ್ತು ದಂತ ಚಿಕಿತ್ಸೆ ಮಾರ್ಗದರ್ಶಿ' : 'Emergency Dental Care Guide'}
            </h1>
            <p className="text-sm md:text-base text-slate-600 text-center mt-2 max-w-2xl mx-auto">
              {language === 'kn' 
                ? 'ನಿಮ್ಮ ದಂತ ತುರ್ತುಸ್ಥಿತಿಗೆ ತ್ವರಿತ ಸಹಾಯ ಸೂಚನೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ' 
                : 'Select your dental emergency for quick help instructions'}
            </p>
          </div>
           <EmergencyGrid protocols={filteredProtocols} loading={loading} />
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Tooth Aids. {t.footer.copyright}
          </div>
          <Link href="/admin" className="text-primary hover:underline font-black uppercase tracking-widest text-xs">
            {t.nav.admin}
          </Link>
        </div>
      </footer>
    </div>
  );
}
