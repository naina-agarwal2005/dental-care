
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import EmergencyGrid from '@/components/EmergencyGrid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem } from '@/lib/types';
import { fetchTraumas } from '@/lib/api-client';

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);

  useEffect(() => {
    fetchTraumas().then(setTraumas).catch(() => setTraumas([]));
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
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="font-headline font-black text-xl tracking-tighter text-primary">
              SwiftDental
            </Link>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-slate-200"
                onClick={() => setIsSearchOpen((prev) => !prev)}
              >
                {isSearchOpen ? <X size={16} /> : <Search size={16} />}
              </Button>

              <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 hidden md:flex items-center gap-2 font-bold rounded-xl h-9 px-4" asChild>
                <Link href="/locate">
                  <MapPin size={16} fill="currentColor" />
                  {t.nav.locate}
                </Link>
              </Button>

              {/* Language Switcher Toggle */}
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

          {isSearchOpen && (
            <div className="pb-4">
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

      <main className="flex-1">
        <div id="symptoms">
           <EmergencyGrid protocols={filteredProtocols} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
         
          
          <div>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li>
                <Link href="/admin" className="text-primary hover:underline font-black uppercase tracking-widest text-[10px]">
                  {t.nav.admin}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-50 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} SwiftDental. {t.footer.copyright}
        </div>
      </footer>
    </div>
  );
}
