"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Eye, EyeOff, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import FloatingBubbles from '@/components/FloatingBubbles';

function UnlockPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passcodeSet, setPasscodeSet] = useState(true); // Default to true while checking
  const [checkingSettings, setCheckingSettings] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if passcode is configured
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.passcodeSet !== undefined) {
          setPasscodeSet(data.passcodeSet);
        }
      })
      .catch(() => {
        // Fallback to active state if request fails
        setPasscodeSet(true);
      })
      .finally(() => {
        setCheckingSettings(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch('/api/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1000);
      } else {
        setError(data.error || "Incorrect passcode. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingSettings) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#caf0f8]/20 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingBubbles />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-3xl tracking-tighter text-primary">
            Tooth Aids
          </h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">
            Emergency Dental Care Platform
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-[#0077b6]/10 rounded-[2rem] overflow-hidden bg-white/85 backdrop-blur-xl">
          <CardHeader className="text-center pt-10 pb-6">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/5 transition-all duration-500 ${success ? 'bg-green-500/10 text-green-600 scale-110' : passcodeSet ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600'}`}>
              {success ? <ShieldCheck size={32} /> : passcodeSet ? <Lock size={32} /> : <AlertTriangle size={32} />}
            </div>
            <CardTitle className="text-xl font-headline font-black text-slate-900">
              {success ? 'Access Granted' : passcodeSet ? 'Enter Passcode' : 'Website Locked'}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              {success ? 'Redirecting you now...' : passcodeSet ? 'Please enter the access code to browse the website' : 'Setup required by administrator'}
            </p>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            {success ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : !passcodeSet ? (
              <div className="space-y-6 text-center">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50">
                  <p className="text-sm font-semibold text-amber-850 leading-relaxed text-center">
                    This website is currently locked. The administrator has not yet configured the website passcode.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="passcode" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Site Passcode
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      id="passcode" 
                      type={showPasscode ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="h-12 bg-slate-50 border-none rounded-xl pl-11 pr-11 focus-visible:ring-primary/10 text-slate-900 text-base"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error && <p className="text-xs text-destructive font-bold mt-2 text-center">{error}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#00b4d8] hover:bg-[#0077b6] text-white rounded-full font-black shadow-lg shadow-[#00b4d8]/20 transition-all active:scale-[0.98]"
                  disabled={isSubmitting || !passcode}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Unlock Website"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <UnlockPageContent />
    </Suspense>
  );
}
