
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, MapPin, Phone, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { deleteClinic, fetchClinicById, updateClinic } from '@/lib/api-client';
import { ClinicItem } from '@/lib/types';

function extractCoordinatesFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Pattern 1 (HIGHEST PRIORITY): !3d (latitude) and !4d (longitude) - Most accurate place coordinates
    const pattern1Lat = /!3d(-?\d+\.\d+)/;
    const pattern1Lng = /!4d(-?\d+\.\d+)/;
    const match1Lat = url.match(pattern1Lat);
    const match1Lng = url.match(pattern1Lng);
    if (match1Lat && match1Lng) {
      return { lat: parseFloat(match1Lat[1]), lng: parseFloat(match1Lng[1]) };
    }

    // Pattern 2: /@lat,lng,zoom or /@lat,lng
    const pattern2 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match2 = url.match(pattern2);
    if (match2) {
      return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };
    }

    // Pattern 3: ?q=lat,lng
    const pattern3 = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match3 = url.match(pattern3);
    if (match3) {
      return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) };
    }

    // Pattern 4: /maps/search/.../@lat,lng
    const pattern4 = /search\/[^/]+\/@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match4 = url.match(pattern4);
    if (match4) {
      return { lat: parseFloat(match4[1]), lng: parseFloat(match4[2]) };
    }

    return null;
  } catch (e) {
    return null;
  }
}

export default function EditClinicPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clinic, setClinic] = useState<ClinicItem | null>(null);
  const [name, setName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const handleMapsUrlChange = (url: string) => {
    setMapsUrl(url);
    const coords = extractCoordinatesFromGoogleMapsUrl(url);
    if (coords) {
      setLat(coords.lat.toString());
      setLng(coords.lng.toString());
    }
  };

  useEffect(() => {
    const id = String(params.id || '');
    if (!id) return;
    fetchClinicById(id).then((data) => {
      setClinic(data);
      setName(data.name);
      setLat(String(data.lat));
      setLng(String(data.lng));
      setContactNumber(data.contactNumber);
      setMapsUrl(data.mapsUrl || ''); // Load existing Maps URL if available
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
        mapsUrl, // Store the original Google Maps URL
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
    if (!confirm('Are you sure you want to delete this hospital?')) return;
    setIsDeleting(true);
    try {
      await deleteClinic(clinic.id);
      router.push('/admin/clinics');
    } catch (error) {
      toast({
        title: "Failed to delete hospital",
        description: "Please try again.",
      });
      setIsDeleting(false);
    }
  };

  if (!clinic) return <div className="p-12 text-center font-bold text-slate-400">Loading clinic data...</div>;

  return (
    <div className="w-full space-y-8 pb-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-black text-slate-900">Edit Hospital Profile</h1>
        </div>
        <Button 
          onClick={handleDelete} 
          variant="ghost" 
          className="rounded-full text-destructive font-bold hover:bg-destructive/5 gap-2 h-11 px-6 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Removing...
            </>
          ) : (
            <>
              <Trash2 size={18} /> Remove Hospital
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-bold text-[#03045e]">Hospital Name*</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-bold text-[#03045e]">Google Maps Link*</Label>
              <Input 
                value={mapsUrl} 
                onChange={(e) => handleMapsUrlChange(e.target.value)} 
                placeholder="Paste Google Maps link (coordinates will be auto-extracted)" 
                className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" 
                required 
              />
              <p className="text-xs text-slate-500 mt-1 px-2">
                Paste any Google Maps link - coordinates will be automatically extracted
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">Latitude</Label>
                <Input 
                  value={lat} 
                  onChange={(e) => setLat(e.target.value)} 
                  placeholder="Auto-filled" 
                  className="rounded-full bg-slate-50 h-10 px-4 border-slate-200 text-sm" 
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">Longitude</Label>
                <Input 
                  value={lng} 
                  onChange={(e) => setLng(e.target.value)} 
                  placeholder="Auto-filled" 
                  className="rounded-full bg-slate-50 h-10 px-4 border-slate-200 text-sm" 
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-bold text-[#03045e]">Emergency Hotline*</Label>
              <Input 
                value={contactNumber} 
                onChange={(e) => setContactNumber(e.target.value)} 
                placeholder="10-digit number" 
                maxLength={10}
                pattern="[0-9]{10}"
                className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" 
              />
              <p className="text-xs text-slate-500 mt-1 px-2">
                Maximum 10 digits
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleUpdate}
          disabled={isLoading || isDeleting}
          className="h-12 px-8 rounded-full font-bold text-base shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" /> Update Hospital
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
