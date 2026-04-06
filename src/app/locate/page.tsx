
"use client";

import React from 'react';
import Link from 'next/link';
import ClinicLocator from '@/components/ClinicLocator';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LocatePage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#caf0f8] shadow-sm shadow-[#0077b6]/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <Link href="/">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              {language === 'kn' ? 'ಆಸ್ಪತ್ರೆಗಳ ಸ್ಥಳಗಳು' : 'Hospital Locations'}
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
      </header>

      <main className="pb-32">
        <div className="bg-gradient-to-b from-white to-[#F8FAFC] border-b border-[#caf0f8]/30 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#03045e] tracking-tight">
              {language === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ತುರ್ತು ಕೇಂದ್ರಗಳು' : 'Verified Emergency Centers'}
            </h2>
          </div>
        </div>

        <ClinicLocator />

        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-[#caf0f8]/20 border border-[#caf0f8]/60 rounded-3xl p-6 md:p-8 flex gap-4 md:gap-6 items-start shadow-lg shadow-[#0077b6]/5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#90e0ef]/30 rounded-full flex items-center justify-center text-[#0077b6] shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#03045e] text-base md:text-lg">
                {language === 'kn' ? 'ಭೌಗೋಳಿಕ ಟಿಪ್ಪಣಿ' : 'Geospatial Note'}
              </h3>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed mt-1.5">
                {language === 'kn' 
                  ? 'ಟೂತ್ ಎಯ್ಡ್ಸ್ ಹತ್ತಿರದ ಸೌಲಭ್ಯಗಳನ್ನು ಗುರುತಿಸಲು ಲೈವ್ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಬಳಸುತ್ತದೆ. ದೂರವನ್ನು ಪಾಯಿಂಟ್-ಟು-ಪಾಯಿಂಟ್ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.' 
                  : 'Tooth Aids uses live coordinates to identify the closest facilities. Distances are calculated point-to-point. Traffic conditions may affect travel time.'}
              </p>
            </div>
          </div>
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
