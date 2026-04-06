import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '600', '700', '900'],
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Tooth Aids - Emergency Dental Care Guide',
  description: 'Quick first-aid instructions for dental emergencies. Find nearby emergency dental centers.',
  keywords: ['dental emergency', 'tooth pain', 'first aid', 'dental care'],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSans.variable} scroll-smooth`}>
      <body className="font-body antialiased min-h-screen selection:bg-accent/30 bg-[#F8FAFC]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
