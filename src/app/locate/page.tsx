"use client";

import React from 'react';
import Link from 'next/link';
import ClinicLocator from '@/components/ClinicLocator';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Footer from '@/components/Footer';
import FloatingBubbles from '@/components/FloatingBubbles';

export default function LocatePage() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <FloatingBubbles />
      
      {/* Header - Consistent with other pages */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-surface-container-high">
              <Link href="/">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <Link href="/" className="text-2xl font-bold text-primary font-headline">
              Tooth Aids
            </Link>
          </div>
          
          {/* Language Switcher - Consistent */}
          <div className="bg-surface-container-high p-1 rounded-full flex items-center">
            <button 
              onClick={() => setLanguage('kn')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${language === 'kn' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              ಕನ್ನಡ
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${language === 'en' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            >
              English
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 flex-1">
        {/* Page Title */}
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tight leading-tight">
            {language === 'kn' ? 'ಹತ್ತಿರದ ದಂತ ಚಿಕಿತ್ಸಾಲಯಗಳು' : 'Nearby Dental Clinics'}
          </h1>
          <p className="mt-4 text-on-surface-variant max-w-2xl text-lg">
            {language === 'kn' 
              ? 'ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿ ಲಭ್ಯವಿರುವ ದಂತ ಚಿಕಿತ್ಸಾಲಯಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.'
              : 'Find dental clinics available near your location.'}
          </p>
          <div className="h-1.5 w-24 bg-secondary rounded-full mt-4"></div>
        </div>

        <ClinicLocator />
      </main>

      <Footer />
    </div>
  );
}
