"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldPlus, LogOut, Globe, Lock, ArrowRight, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    setMounted(true);
    // Verify session on mount
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      setIsAuth(data.authenticated === true);
    } catch {
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuth(true);
        router.refresh();
      } else {
        setError(language === 'en' ? data.error || "Invalid credentials." : "ತಪ್ಪು ವಿವರಗಳು.");
      }
    } catch {
      setError(language === 'en' ? "Connection error. Please try again." : "ಸಂಪರ್ಕ ದೋಷ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setIsAuth(false);
      window.location.href = '/admin';
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthRoute = pathname === '/admin/forgot-password' || pathname === '/admin/reset-password';

  if (isAuthRoute) {
    return <>{children}</>;
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
                    placeholder="admin@example.com" 
                    className="h-12 bg-slate-50 border-none rounded-xl pl-11 focus-visible:ring-primary/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {language === 'en' ? 'Access Password' : 'ಪಾಸ್‌ವರ್ಡ್'}
                  </Label>
                  <Link 
                    href="/admin/forgot-password"
                    className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="h-12 bg-slate-50 border-none rounded-xl pl-11 pr-11 focus-visible:ring-primary/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-xs text-destructive font-bold mt-2 text-center">{error}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 rounded-full font-black shadow-lg shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Enter Dashboard <ArrowRight size={16} className="ml-2" /></>
                )}
              </Button>
              
              <Link href="/" className="block text-center text-xs text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest mt-4">
                Back to Website
              </Link>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#caf0f8]/20 to-white">
      <header className="bg-white border-b border-[#caf0f8] h-16 sticky top-0 z-50 shadow-sm shadow-[#0077b6]/5">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-2 shrink-0">
              <ShieldPlus className="h-7 w-7 text-primary" />
              <span className="font-headline font-black text-xl tracking-tighter text-primary inline-block">
                Tooth Aids
              </span>
            </Link>
            <span className="text-sm font-bold text-slate-500 ml-1 sm:ml-2">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-primary flex items-center gap-1.5">
              <Globe size={18} /> Site
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-slate-500 hover:text-destructive gap-2 h-10 px-4 rounded-full font-bold">
              <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-[1600px] w-full mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
