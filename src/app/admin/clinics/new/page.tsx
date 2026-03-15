
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { createClinic } from '@/lib/api-client';

export default function NewClinicPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await createClinic({
        name,
        lat: Number(lat),
        lng: Number(lng),
        contactNumber,
      });

      toast({
        title: "Clinic Registered",
        description: "The new clinic has been added successfully."
      });
      router.push('/admin/clinics');
    } catch (e) {
      toast({
        title: "Failed to save clinic",
        description: e instanceof Error ? e.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl bg-white shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Register New Hospital</h1>
          <p className="text-slate-500 text-sm font-medium">Add a verified emergency center to the Patna clinical map.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-primary" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hospital/Clinic Name*</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AIIMS Patna Dental Department" className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapPin className="text-accent" /> Geospatial Coordinates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latitude*</Label>
                  <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 25.5645" className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Longitude*</Label>
                  <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="e.g. 85.0883" className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Phone className="text-primary" /> Contact & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Emergency Hotline*</Label>
                  <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="0612-XXXXXXX" className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full h-16 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Processing..." : <><Save size={20} className="mr-2" /> Save Hospital</>}
          </Button>

          <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs font-bold text-blue-900 leading-relaxed">
              Coordinates are used for closest-to-farthest sorting from user location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
