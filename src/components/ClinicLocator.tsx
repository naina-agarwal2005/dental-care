
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, LocateFixed, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ClinicItem } from '@/lib/types';
import { fetchClinics } from '@/lib/api-client';

export default function ClinicLocator() {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinics()
      .then(setClinics)
      .finally(() => setLoading(false));
  }, []);

  const handleLocateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(location);
        fetchClinics(location.lat, location.lng).then(setClinics);
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <section className="py-8 bg-slate-50" id="clinic-locator">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-black text-slate-900 leading-none">{t.clinicLocator.title}</h2>
            <p className="text-slate-500 mt-2 font-medium">{t.clinicLocator.subtitle}</p>
          </div>
          <Button 
            onClick={handleLocateUser} 
            variant="outline" 
            className="rounded-xl border-primary text-primary font-bold h-11 px-6 shadow-sm bg-white"
            disabled={isLocating}
          >
            {isLocating ? "Locating..." : <><LocateFixed size={18} className="mr-2" /> Sort by Proximity</>}
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-sm text-slate-500">Loading clinics...</p>}
          {!loading && clinics.length === 0 && (
            <p className="text-sm text-slate-500">No clinics available.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="border rounded-2xl bg-white">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-lg font-black text-slate-900">{clinic.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {clinic.lat}, {clinic.lng}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      <Phone size={14} /> <span>{clinic.contactNumber}</span>
                    </div>
                    {typeof clinic.distanceKm === 'number' && (
                      <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-md font-black">
                        {clinic.distanceKm} km away
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl font-bold" asChild>
                      <a href={`tel:${clinic.contactNumber.replace(/[^0-9]/g, '')}`}>Call Center</a>
                    </Button>
                    <Button
                      onClick={() => openInGoogleMaps(clinic.lat, clinic.lng)}
                      variant="default"
                      size="sm"
                      className="flex-1 h-10 bg-accent hover:bg-accent/90 rounded-xl font-bold"
                    >
                      <ExternalLink size={14} className="mr-2" /> Open in Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
