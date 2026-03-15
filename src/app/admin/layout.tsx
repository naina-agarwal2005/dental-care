
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, Globe, Lock, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { language } = useLanguage();
  
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    const authStatus = localStorage.getItem('adminAuth') === 'true';
    setIsAuth(authStatus);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (email === "admin@swiftdental.org" && password === "admin123") {
      localStorage.setItem('adminAuth', 'true');
      setIsAuth(true);
      setError("");
      router.refresh();
    } else {
      setError(language === 'en' ? "Invalid credentials." : "ತಪ್ಪು ವಿವರಗಳು.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuth(false);
    window.location.href = '/admin';
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#F8FAFC]" />;
  }

  if (!isAuth) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/5">
              <Lock size={32} />
            </div>
            <CardTitle className="text-2xl font-headline font-black text-slate-900">
              {language === 'en' ? 'Admin Login' : 'ನಿರ್ವಾಹಕರ ಲಾಗಿನ್'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {language === 'en' ? 'Admin Email' : 'ಇಮೇಲ್'}
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@swiftdental.org" 
                    className="h-12 bg-slate-50 border-none rounded-xl pl-11 focus-visible:ring-primary/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {language === 'en' ? 'Access Password' : 'ಪಾಸ್‌ವರ್ಡ್'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 bg-slate-50 border-none rounded-xl pl-11 focus-visible:ring-primary/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-xs text-destructive font-bold mt-2 text-center">{error}</p>}
              </div>

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 rounded-xl font-black shadow-lg shadow-primary/20">
                Enter Dashboard <ArrowRight size={16} className="ml-2" />
              </Button>
              
              <Link href="/" className="block text-center text-[10px] text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest mt-4">
                Back to Website
              </Link>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b h-16 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Heart size={20} fill="currentColor" />
            </div>
            <h1 className="text-sm font-bold font-headline text-slate-900">SwiftDental Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-primary flex items-center gap-1">
              <Globe size={14} /> Site
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-destructive gap-2 h-9 rounded-lg">
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
