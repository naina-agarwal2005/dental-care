"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-on-surface-variant text-center md:text-left">
          © {new Date().getFullYear()} Tooth Aids. For information purposes only. Always consult a professional.
        </p>
        <Link 
          href="/admin" 
          className="text-sm text-on-surface-variant hover:text-tertiary transition-colors font-medium"
        >
          Admin Access
        </Link>
      </div>
    </footer>
  );
}
