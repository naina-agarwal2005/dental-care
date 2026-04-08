import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '600', '700', '800'],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vietnam',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title:{ 
    default: 'Tooth Aids - Emergency Dental Care Guide',
    template: '%s | Tooth Aids'
  },
  description: 'Quick first-aid instructions for dental emergencies. Find nearby emergency dental centers quickly.',
  keywords: ['dental emergency', 'tooth pain', 'first aid', 'dental care', 'pediatric dental care', 'tooth aches', 'child dental health'],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toothaids.com',
    title: 'Tooth Aids - Emergency Dental Care Guide',
    description: 'Learn about dental health and immediate first aid instructions for dental emergencies.',
    siteName: 'Tooth Aids',
    images: [
      {
        url: '/assets/hero-dental-emergency.png', // Or a specific OG image you create
        width: 1200,
        height: 630,
        alt: 'Tooth Aids - Dental Emergency Care',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: 'https://toothaids.com' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Tooth Aids",
    "description": "Emergency dental care guide and first aid instructions.",
    "medicalAudience": "Patient",
    "url": "https://toothaids.com"
  };
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${beVietnamPro.variable} scroll-smooth`}>
      <body className="min-h-screen selection:bg-secondary-container">
        {/* This tag is invisible to users, but visible to Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}