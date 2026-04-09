"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import EmergencyGrid from '@/components/EmergencyGrid';
import { MapPin, ArrowRight, Timer, AlertTriangle, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem } from '@/lib/types';
import { fetchTraumas } from '@/lib/api-client';
import Footer from '@/components/Footer';
import FloatingBubbles from '@/components/FloatingBubbles';

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fabBottomPosition, setFabBottomPosition] = useState(24);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTraumas()
      .then(setTraumas)
      .catch(() => setTraumas([]))
      .finally(() => setLoading(false));
  }, []);

  // Handle button sticky behavior - calculate exact position
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      
      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const minMargin = 24;
      
      // Calculate how much the footer is visible
      const footerVisibleHeight = Math.max(0, windowHeight - footerRect.top);
      
      if (footerVisibleHeight > 0) {
        // Footer is visible, push button up
        setFabBottomPosition(footerVisibleHeight + minMargin);
      } else {
        // Footer not visible, keep button at default position
        setFabBottomPosition(minMargin);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Separate protocols by type
  const { firstAidProtocols, dailyCareProtocols } = useMemo(() => {
    return {
      firstAidProtocols: traumas.filter((p) => p.type === 'first_aid' || !p.type),
      dailyCareProtocols: traumas.filter((p) => p.type === 'daily_care'),
    };
  }, [traumas]);

  return (
    <div className="flex flex-col min-h-screen text-on-background relative overflow-x-hidden" style={{ backgroundColor: 'transparent' }}>
      <FloatingBubbles />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto relative z-10">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            Tooth Aids
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
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
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-16 px-6 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 order-2 lg:order-1">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-tight tracking-tight mb-6">
              Tooth Aids
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant mb-8 leading-relaxed max-w-xl">
              {language === 'kn' 
                ? 'ಹಲ್ಲುಗಳ ಆರೋಗ್ಯ ಮತ್ತು ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ. ಇದು ಮಕ್ಕಳ ದಂತ ರಕ್ಷಣೆಗೆ ಒಂದು ಸರಳ ಮಾರ್ಗದರ್ಶಿ.'
                : 'Learn about dental health and first aid. A simple guide to dental care for children.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/about"
                className="bg-gradient-to-r from-tertiary to-tertiary-container text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
              >
                {language === 'kn' ? 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ' : 'Learn More'}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-lg overflow-hidden shadow-xl aspect-video">
              <Image 
                  src="/assets/hero-dental-emergency.png" 
                  alt="Happy children" 
                  fill
                  unoptimized={true}
                  className="object-cover" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Protocol Grids */}
      <main id="protocols" className="max-w-7xl mx-auto px-6 py-16 flex-1 space-y-20 pb-24 relative z-10">
        {/* First Aid Protocols Section */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                {language === 'kn' ? 'ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಕ್ರಮಗಳು' : 'First Aid Protocols'}
              </h2>
            </div>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              {language === 'kn' 
                ? 'ದಂತ ತುರ್ತುಸ್ಥಿತಿಗಳಿಗಾಗಿ ತಕ್ಷಣದ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಸೂಚನೆಗಳು.'
                : 'Immediate first aid instructions for dental emergencies.'}
            </p>
            <div className="h-1.5 w-24 bg-primary rounded-full mt-4"></div>
          </div>
          <EmergencyGrid protocols={firstAidProtocols} loading={loading} />
        </section>

        {/* Daily Care Protocols Section */}
        <section>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Sparkles className="text-secondary w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary">
                {language === 'kn' ? 'ದೈನಂದಿನ ಆರೈಕೆ' : 'Daily Care'}
              </h2>
            </div>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              {language === 'kn' 
                ? 'ಆರೋಗ್ಯಕರ ಹಲ್ಲುಗಳಿಗಾಗಿ ದೈನಂದಿನ ಆರೈಕೆ ಸಲಹೆಗಳು ಮತ್ತು ಅಭ್ಯಾಸಗಳು.'
                : 'Daily care tips and practices for healthy teeth.'}
            </p>
            <div className="h-1.5 w-24 bg-secondary rounded-full mt-4"></div>
          </div>
          <EmergencyGrid protocols={dailyCareProtocols} loading={loading} />
        </section>
      </main>

      {/* Additional Info Bento Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-primary-container text-white p-10 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                {language === 'kn' ? 'ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ನೆನಪಿರಲಿ' : 'Remember in Emergency'}
              </h3>
              <p className="text-lg opacity-90 max-w-lg">
                {language === 'kn' 
                  ? 'ಗಾಬರಿಯಾಗಬೇಡಿ. ಹಲ್ಲನ್ನು ಅದರ ಬೇರಿನ ಭಾಗದಲ್ಲಿ ಮುಟ್ಟಬೇಡಿ. ಕೇವಲ ಅದರ ಕಿರೀಟದ ಭಾಗವನ್ನು ಹಿಡಿದುಕೊಳ್ಳಿ.'
                  : "Don't panic. Don't touch the root of the tooth. Only hold the crown part."}
              </p>
            </div>
            <AlertTriangle className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
          </div>
          <div className="bg-surface-container-high p-8 rounded-xl flex flex-col justify-center border border-outline-variant/20">
            <Timer className="text-tertiary w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">
              {language === 'kn' ? 'ಸಮಯ ಮುಖ್ಯ' : 'Time is Critical'}
            </h3>
            <p className="text-on-surface-variant">
              {language === 'kn' 
                ? 'ಮೊದಲ 60 ನಿಮಿಷಗಳು ಅತ್ಯಂತ ನಿರ್ಣಾಯಕ. ತಕ್ಷಣ ಹತ್ತಿರದ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.'
                : 'The first 60 minutes are crucial. Visit the nearest dentist immediately.'}
            </p>
          </div>
        </div>
      </section>

      {/* Floating Action Button - Properly sticks above footer */}
      <div 
        className="fixed left-4 right-4 md:left-auto md:right-8 z-40 flex justify-center md:justify-end pointer-events-none transition-all duration-150"
        style={{ bottom: `${fabBottomPosition}px` }}
      >
        <Link 
          href="/locate"
          className="pointer-events-auto flex items-center justify-center gap-2 py-3.5 px-8 w-full max-w-sm md:w-auto bg-tertiary hover:bg-tertiary/90 text-white rounded-full shadow-2xl shadow-tertiary/30 active:scale-[0.97] transition-all font-semibold"
        >
          <MapPin size={20} />
          <span>
            {language === 'kn' ? 'ದಂತ ಚಿಕಿತ್ಸಾಲಯ ಹುಡುಕಿ' : 'Find Dental Clinics'}
          </span>
        </Link>
      </div>

      <div ref={footerRef} className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
