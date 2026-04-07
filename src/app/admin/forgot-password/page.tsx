"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldPlus, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your admin email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to process request");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError("Network or server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#caf0f8]/20 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldPlus className="h-10 w-10 text-primary" />
            <span className="font-headline font-black text-2xl tracking-tighter text-primary">
              Tooth Aids <span className="text-secondary">Admin</span>
            </span>
          </Link>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl mb-4">
          <CardHeader className="space-y-1 pb-8 pt-10 text-center">
            <CardTitle className="text-2xl font-black font-headline tracking-tight text-slate-800">
              Reset Password
            </CardTitle>
            <p className="text-sm font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Enter your admin email address and we'll send you a link to reset your password.
            </p>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-800">Check Your Email</h3>
                  <p className="text-sm text-slate-500">
                    If an account exists for <span className="font-semibold text-slate-700">{email}</span>, we have sent a password reset link.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-bold"
                >
                  Try another email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
                    <>Send Reset Link <ArrowRight size={16} className="ml-2" /></>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Link href="/admin" className="block text-center text-xs text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-widest mt-6">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
