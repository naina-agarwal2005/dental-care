"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, GraduationCap, Users, Heart, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';
import Footer from '@/components/Footer';
import FloatingBubbles from '@/components/FloatingBubbles';

export default function AboutPage() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />
      
      {/* Header */}
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
          
          <div className="flex items-center bg-surface-container-high p-1 rounded-full">
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

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-6">
              {language === 'kn' ? 'ಟೂತ್ ಎಯ್ಡ್ಸ್ ಬಗ್ಗೆ' : 'About Tooth Aids'}
            </h1>
            <div className="h-1.5 w-24 bg-secondary rounded-full"></div>
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Left: Description */}
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-on-surface-variant leading-relaxed">
                  {language === 'kn' 
                    ? 'ಟೂತ್ ಎಯ್ಡ್ಸ್ ಒಂದು ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆಯಾಗಿದ್ದು, ಮಕ್ಕಳು, ಪೋಷಕರು ಮತ್ತು ಶಿಕ್ಷಕರಿಗೆ ಹಲ್ಲಿನ ಆರೋಗ್ಯ ಮತ್ತು ಪ್ರಥಮ ಚಿಕಿತ್ಸೆಯ ಬಗ್ಗೆ ಜಾಗೃತಿ ಮೂಡಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.'
                    : 'Tooth Aids is an educational platform designed to raise awareness about dental health and first aid among children, parents, and teachers.'}
                </p>
                
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  {language === 'kn'
                    ? 'ನಮ್ಮ ಗುರಿಯು ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ದಂತ ತುರ್ತುಸ್ಥಿತಿಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಮತ್ತು ಉತ್ತಮ ಮೌಖಿಕ ನೈರ್ಮಲ್ಯ ಅಭ್ಯಾಸಗಳನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಜ್ಞಾನ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ನೀಡುವುದು. ಸರಳ, ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿಗಳ ಮೂಲಕ, ಹಲ್ಲಿನ ಆಘಾತಗಳು ಮತ್ತು ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಗಳಿಗೆ ಸೂಕ್ತ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಲು ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.'
                    : 'Our goal is to empower everyone with the knowledge and confidence to handle dental emergencies and maintain good oral hygiene practices. Through simple, step-by-step guides, we help you respond appropriately to dental trauma and common issues.'}
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">
                    {language === 'kn' ? 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ' : 'First Aid'}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {language === 'kn' 
                      ? 'ದಂತ ತುರ್ತುಸ್ಥಿತಿಗಳಿಗೆ ತಕ್ಷಣದ ಪ್ರತಿಕ್ರಿಯೆ ಮಾರ್ಗದರ್ಶಿಗಳು'
                      : 'Immediate response guides for dental emergencies'}
                  </p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">
                    {language === 'kn' ? 'ದೈನಂದಿನ ಆರೈಕೆ' : 'Daily Care'}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {language === 'kn' 
                      ? 'ಆರೋಗ್ಯಕರ ಹಲ್ಲುಗಳಿಗಾಗಿ ದೈನಂದಿನ ಅಭ್ಯಾಸಗಳು'
                      : 'Daily practices for healthy teeth'}
                  </p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-tertiary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-tertiary" />
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">
                    {language === 'kn' ? 'ಮಕ್ಕಳಿಗಾಗಿ' : 'For Children'}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {language === 'kn' 
                      ? 'ಮಕ್ಕಳಿಗೆ ಸುಲಭವಾಗಿ ಅರ್ಥವಾಗುವ ವಿಷಯ'
                      : 'Content designed to be easily understood by children'}
                  </p>
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                  <div className="w-12 h-12 bg-primary-container/30 rounded-full flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">
                    {language === 'kn' ? 'ಶಿಕ್ಷಕರಿಗಾಗಿ' : 'For Educators'}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {language === 'kn' 
                      ? 'ಶಾಲೆಗಳಲ್ಲಿ ಬಳಸಬಹುದಾದ ಸಂಪನ್ಮೂಲಗಳು'
                      : 'Resources that can be used in schools'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Doctor Info */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-lg border border-outline-variant/20">
                {/* Doctor Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-container/30 to-secondary-container/30 flex items-center justify-center relative">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-surface-container-high border-4 border-white shadow-lg flex items-center justify-center mb-4">
                      <GraduationCap className="w-16 h-16 text-primary/40" />
                    </div>
                    <p className="text-sm text-on-surface-variant italic">
                      {language === 'kn' ? 'ಚಿತ್ರ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ' : 'Photo coming soon'}
                    </p>
                  </div>
                </div>
                
                {/* Doctor Info */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Dr. Akshatha B S
                  </h2>
                  <p className="text-secondary font-semibold mb-4">
                    {language === 'kn' ? 'ಪೀಡೋಡಾಂಟಿಕ್ಸ್ ವಿಭಾಗ' : 'Department of Pedodontics'}
                  </p>
                  
                  <div className="space-y-3 text-on-surface-variant">
                    <p className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></span>
                      <span>V S Dental College & Hospital</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></span>
                      <span>VV Puram, Bangalore</span>
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-outline-variant/20">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {language === 'kn'
                        ? 'ಈ ಯೋಜನೆಯು ಮಕ್ಕಳ ದಂತ ಆರೋಗ್ಯ ಜಾಗೃತಿಯನ್ನು ಉತ್ತೇಜಿಸಲು ಮತ್ತು ದಂತ ತುರ್ತುಸ್ಥಿತಿಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಸಮುದಾಯಕ್ಕೆ ಅಧಿಕಾರ ನೀಡಲು Dr. Akshatha B S ಅವರ ಉಪಕ್ರಮವಾಗಿದೆ.'
                        : 'This project is an initiative by Dr. Akshatha B S to promote dental health awareness among children and empower the community to handle dental emergencies effectively.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-primary-container/20 to-secondary-container/20 rounded-2xl p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              {language === 'kn' ? 'ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Explore Our Protocols'}
            </h2>
            <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
              {language === 'kn'
                ? 'ನಮ್ಮ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮತ್ತು ದೈನಂದಿನ ಆರೈಕೆ ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.'
                : 'Browse our collection of first aid and daily care protocols to be prepared for any situation.'}
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              {language === 'kn' ? 'ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ನೋಡಿ' : 'View Protocols'}
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
