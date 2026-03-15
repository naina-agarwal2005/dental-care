
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  ClipboardList,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { fetchClinics, fetchTraumas } from '@/lib/api-client';

export default function AdminDashboard() {
  const [traumaCount, setTraumaCount] = useState(0);
  const [clinicCount, setClinicCount] = useState(0);

  useEffect(() => {
    Promise.all([fetchTraumas(), fetchClinics()])
      .then(([traumas, clinics]) => {
        setTraumaCount(traumas.length);
        setClinicCount(clinics.length);
      })
      .catch(() => {
        setTraumaCount(0);
        setClinicCount(0);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-primary/5 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-primary/70 uppercase tracking-widest">Trauma Protocols</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{traumaCount}</p>
            </div>
            <ClipboardList size={24} className="text-primary" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-accent/10 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-widest">Clinics</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{clinicCount}</p>
            </div>
            <MapPin size={24} className="text-accent" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600 font-medium">Manage trauma protocols and clinics from dedicated pages.</div>
          <div className="flex gap-3">
            <Button asChild className="rounded-xl">
              <Link href="/admin/traumas">Manage Traumas</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin/clinics">Manage Clinics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
