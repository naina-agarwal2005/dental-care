
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, MapPin, Phone, ShieldCheck, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { deleteClinic, fetchClinicById, updateClinic } from '@/lib/api-client';
import { ClinicItem } from '@/lib/types';

export default function EditClinicPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clinic, setClinic] = useState<ClinicItem | null>(null);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const id = String(params.id || '');
    if (!id) return;
    fetchClinicById(id).then((data) => {
      setClinic(data);
      setName(data.name);
      setLat(String(data.lat));
      setLng(String(data.lng));
      setContactNumber(data.contactNumber);
    }).catch(() => setClinic(null));
  }, [params.id]);

  const handleUpdate = async () => {
    if (!clinic) return;
    setIsLoading(true);
    try {
      await updateClinic(clinic.id, {
        name,
        lat: Number(lat),
        lng: Number(lng),
        contactNumber,
      });

      toast({
        title: "Clinical Data Updated",
        description: "The clinic details were updated successfully."
      });
      router.push('/admin/clinics');
    } catch (e) {
      toast({
        title: "Failed to update clinic",
        description: e instanceof Error ? e.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!clinic) return;
    await deleteClinic(clinic.id);
    router.push('/admin/clinics');
  };

  if (!clinic) return <div className="p-12 text-center font-bold text-slate-400">Loading clinic data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl bg-white shadow-sm border border-slate-100">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Hospital Profile</h1>
            <p className="text-slate-500 text-sm font-medium">Synchronize information for {clinic.name}.</p>
          </div>
        </div>
        <Button onClick={handleDelete} variant="ghost" className="rounded-xl text-destructive font-bold hover:bg-destructive/5 gap-2 h-12 px-6">
          <Trash2 size={18} /> Remove Hospital
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-primary" /> Core Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hospital Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapPin className="text-accent" /> Mapping & Triage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latitude</Label>
                  <Input value={lat} onChange={(e) => setLat(e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Longitude</Label>
                  <Input value={lng} onChange={(e) => setLng(e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Phone className="text-primary" /> Contact Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hotline</Label>
                  <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Button 
            onClick={handleUpdate}
            disabled={isLoading}
            className="w-full h-16 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Synchronizing..." : <><Save size={20} className="mr-2" /> Update Hospital Profile</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
