
"use client";

import React from 'react';
import Link from 'next/link';
import ClinicLocator from '@/components/ClinicLocator';
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Phone, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LocatePage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black hover:text-primary transition-colors uppercase tracking-widest text-slate-500">
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
      </header>

      <main className="pb-32">
        <div className="bg-white border-b py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Emergency Centers</h1>
              <p className="text-sm text-slate-500 font-medium">Automatically sorted by proximity to your current location in Patna.</p>
            </div>
            <div className="flex gap-3">
              <Button className="rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black h-14 px-8 text-lg shadow-xl shadow-destructive/20" asChild>
                <a href="tel:102"><Phone size={20} className="mr-2" /> Call 102</a>
              </Button>
            </div>
          </div>
        </div>

        <ClinicLocator />

        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 flex gap-6 items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h3 className="font-black text-blue-900 text-lg">Geospatial Note</h3>
              <p className="text-sm text-blue-800/80 leading-relaxed mt-1 font-medium">
                SwiftDental uses live coordinates to identify the closest facilities. Distances are calculated point-to-point. Traffic conditions may affect travel time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
