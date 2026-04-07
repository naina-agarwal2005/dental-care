"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, MapPin, Play, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { TraumaItem } from '@/lib/types';
import { fetchTraumaById } from '@/lib/api-client';
import Footer from '@/components/Footer';
import FloatingBubbles from '@/components/FloatingBubbles';

function getYouTubeVideoId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

export default function TraumaDetailPage() {
  const params = useParams();
  const { t, language, setLanguage } = useLanguage();
  const [protocol, setProtocol] = useState<TraumaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [fabBottomPosition, setFabBottomPosition] = useState(24);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = String(params.id || "");
    if (!id) return;
    fetchTraumaById(id)
      .then((data) => setProtocol(data))
      .catch(() => setProtocol(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  // Handle button sticky behavior - calculate exact position
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;
      
      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const buttonHeight = 56;
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

  const videoId = protocol ? getYouTubeVideoId(protocol.videoUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : protocol?.videoUrl;

  const totalSteps = protocol?.steps?.length || 0;
  const isDailyCare = protocol?.type === 'daily_care';

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  // Get appropriate section title based on protocol type
  const getSectionTitle = () => {
    if (isDailyCare) {
      return language === 'kn' ? 'ಆರೈಕೆ ಹಂತಗಳು' : 'Care Steps';
    }
    return language === 'kn' ? 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಹಂತಗಳು' : 'First Aid Steps';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container-high"></div>
          <div className="h-4 w-32 bg-surface-container-high rounded"></div>
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-on-surface">Protocol not found</h1>
          <Button asChild>
            <Link href="/">{t.emergencyGrid.backBtn}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = protocol.steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <FloatingBubbles />
      
      {/* Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-outline-variant/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-surface-container-high">
              <Link href="/">
                <ArrowLeft size={20} />
              </Link>
            </Button>
            <h1 className="text-base md:text-lg font-bold text-on-surface truncate">
              {language === 'kn' ? protocol.title.kn : protocol.title.en}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher - Consistent with Home */}
            <div className="flex items-center bg-surface-container-high p-1 rounded-full">
              <button 
                onClick={() => setLanguage('kn')}
                className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${language === 'kn' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                ಕನ್ನಡ
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${language === 'en' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full relative z-10">
        {/* Desktop Layout: 2 Columns with Video and Step Image aligned */}
        <div className="hidden lg:block p-6 pb-24">
          {/* Step Counter with Navigation Arrows */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">
              {language === 'kn' 
                ? `ಹಂತ ${currentStep + 1} / ${totalSteps}`
                : `Step ${currentStep + 1} of ${totalSteps}`}
            </h2>
            
            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className="w-10 h-10 rounded-full border border-outline-variant bg-surface-container-lowest flex items-center justify-center text-on-surface hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous step"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextStep}
                disabled={currentStep === totalSteps - 1}
                className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next step"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Two Column Layout: Video | Step Image */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column: Video */}
            <div className="flex flex-col">
              {embedUrl ? (
                <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-lg bg-on-surface">
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
                <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-lg bg-on-surface group">
                  <Image
                    src={protocol.thumbnail}
                    alt={language === 'kn' ? protocol.title.kn : protocol.title.en}
                    fill
                    className="object-cover opacity-80"
                    unoptimized={protocol.thumbnail.startsWith('/api/')}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-on-surface/30">
                    <a 
                      href={watchUrl} 
                      target="_blank" 
                      className="w-16 h-16 rounded-full bg-white hover:bg-secondary hover:text-white transition-all transform hover:scale-110 flex items-center justify-center text-secondary shadow-xl" 
                      rel="noreferrer"
                    >
                      <Play fill="currentColor" size={28} className="ml-1" />
                    </a>
                    <span className="text-sm font-semibold text-white bg-on-surface/60 px-4 py-2 rounded-full">
                      Watch on YouTube
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Step Image */}
            <div className="flex flex-col">
              {currentStepData?.imageUrl && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-lg bg-surface-container-low">
                  <Image 
                    src={currentStepData.imageUrl} 
                    alt={`Step ${currentStep + 1}`} 
                    fill 
                    className="object-cover"
                    unoptimized={currentStepData.imageUrl.startsWith('/api/')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Two Column Layout: Disclaimer | Step Description */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Left Column: Disclaimer - Fixed height */}
            <div className="flex items-start gap-3 p-4 bg-surface-container-high rounded-md border border-outline-variant/30 h-fit">
              <Info className="w-5 h-5 text-on-surface-variant shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {language === 'kn' 
                  ? 'ಈ ಮಾಹಿತಿಯು ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ. ಇದು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಆರೈಕೆಯನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ.'
                  : 'For educational purposes only. This does not replace professional dental care.'}
              </p>
            </div>

            {/* Right Column: Step Content */}
            <div className="bg-surface-container-lowest rounded-md shadow-md p-6">
              {/* Step Number Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center text-lg font-bold">
                  {currentStep + 1}
                </span>
                <span className="text-sm font-semibold text-secondary uppercase tracking-wide">
                  {language === 'kn' ? `ಹಂತ ${currentStep + 1}` : `Step ${currentStep + 1}`}
                </span>
              </div>
              
              <p className="text-lg leading-relaxed text-on-surface">
                {language === 'kn' ? currentStepData?.text.kn : currentStepData?.text.en}
              </p>

              {/* Step Progress Dots */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-outline-variant/30">
                {protocol.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentStep 
                        ? 'bg-secondary w-6' 
                        : 'bg-outline-variant hover:bg-secondary/50 w-2.5'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout: Scrolling Sections */}
        <div className="lg:hidden pb-24">
          {/* Video Section */}
          <section className="px-4 pt-4 pb-6">
            {embedUrl ? (
              <div className="relative w-full aspect-video rounded overflow-hidden shadow-lg bg-on-surface">
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
              <div className="relative w-full aspect-video rounded overflow-hidden shadow-lg bg-on-surface group">
                <Image
                  src={protocol.thumbnail}
                  alt={language === 'kn' ? protocol.title.kn : protocol.title.en}
                  fill
                  className="object-cover opacity-80"
                  unoptimized={protocol.thumbnail.startsWith('/api/')}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-on-surface/30">
                  <a 
                    href={watchUrl} 
                    target="_blank" 
                    className="w-14 h-14 rounded-full bg-white hover:bg-secondary hover:text-white transition-all flex items-center justify-center text-secondary shadow-xl" 
                    rel="noreferrer"
                  >
                    <Play fill="currentColor" size={24} className="ml-0.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-surface-container-high rounded">
              <Info className="w-4 h-4 text-on-surface-variant shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {language === 'kn' 
                  ? 'ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ. ವೃತ್ತಿಪರ ಆರೈಕೆಯನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ.'
                  : 'For educational purposes only. Does not replace professional care.'}
              </p>
            </div>
          </section>

          {/* Steps Section Header */}
          <div className="px-4 pb-4">
            <h2 className="text-lg font-bold text-primary">
              {getSectionTitle()}
            </h2>
          </div>

          {/* Scrolling Steps */}
          <div className="space-y-4 px-4">
            {protocol.steps.map((step, idx) => (
              <article 
                key={idx} 
                className="bg-surface-container-lowest rounded shadow-md overflow-hidden"
              >
                {/* Step Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-high border-b border-outline-variant/20">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                    {step.stepNumber}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">
                    {language === 'kn' ? `ಹಂತ ${step.stepNumber}` : `Step ${step.stepNumber}`}
                  </span>
                </div>

                {/* Step Image */}
                {step.imageUrl && (
                  <div className="relative w-full aspect-[16/10] bg-surface-container-low">
                    <Image 
                      src={step.imageUrl} 
                      alt={`Step ${step.stepNumber}`} 
                      fill 
                      className="object-cover"
                      unoptimized={step.imageUrl.startsWith('/api/')}
                    />
                  </div>
                )}

                {/* Step Text */}
                <div className="p-4">
                  <p className="text-base leading-relaxed text-on-surface">
                    {language === 'kn' ? step.text.kn : step.text.en}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

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

      {/* Footer */}
      <div ref={footerRef} className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
