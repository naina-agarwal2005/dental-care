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
    <html lang="en" className={`${plusJakartaSans.variable} ${beVietnamPro.variable} scroll-smooth`}>
      <body className="min-h-screen selection:bg-secondary-container">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
