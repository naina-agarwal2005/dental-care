
"use client";

import React, { useState, useEffect } from 'react';
import './globals.css';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

function BottomNav() {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <div className="md:hidden fixed bottom-4 left-6 right-6 z-[100]">
      <Link 
        href="/locate" 
        className="flex items-center justify-center gap-2 py-2.5 px-6 w-full bg-accent text-white rounded-xl shadow-xl border border-white/20 active:scale-[0.98] transition-all"
      >
        <MapPin size={16} fill="currentColor" className="text-white" />
        <span className="font-headline font-black uppercase tracking-widest text-[10px]">
          {t.nav.locate}
        </span>
      </Link>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen selection:bg-accent/30 bg-[#F8FAFC]">
        <LanguageProvider>
          {children}
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
