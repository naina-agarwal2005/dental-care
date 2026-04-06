
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, LocateFixed, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ClinicItem } from '@/lib/types';
import { fetchClinics } from '@/lib/api-client';

const ITEMS_PER_PAGE = 6;

export default function ClinicLocator() {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    fetchClinics()
      .then(setClinics)
      .finally(() => setLoading(false));
    
    // Request location permission on page load (mobile-friendly)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(location);
          // Automatically sort by proximity on load
          fetchClinics(location.lat, location.lng).then(setClinics);
        },
        (error) => {
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, []);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(location);
        fetchClinics(location.lat, location.lng).then((sortedClinics) => {
          setClinics(sortedClinics);
        });
        setIsLocating(false);
        setCurrentPage(1); // Reset to first page when sorting
      },
      (error) => {
        setIsLocating(false);
        if (error.code === 1) {
          alert('Location permission denied. Please enable location access in your browser settings.');
        } else if (error.code === 2) {
          alert('Location unavailable. Please check your device settings.');
        } else if (error.code === 3) {
          alert('Location request timed out. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const openInGoogleMaps = (clinic: ClinicItem) => {
    // Use original Maps URL if available, otherwise fallback to directions URL
    const url = clinic.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;
    window.open(url, '_blank');
  };

  // Pagination calculations
  const totalPages = Math.ceil(clinics.length / ITEMS_PER_PAGE);
  const paginatedClinics = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return clinics.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [clinics, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of clinic list
    document.getElementById('clinic-locator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="py-8 bg-slate-50" id="clinic-locator">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="space-y-3">
          <div className="flex justify-start">
            <Button 
              onClick={handleLocateUser} 
              variant="outline" 
              className="rounded-xl border-primary text-primary font-bold h-11 px-6 shadow-sm bg-white"
              disabled={isLocating}
            >
              {isLocating ? "Locating..." : <><LocateFixed size={18} className="mr-2" /> Sort by Proximity</>}
            </Button>
          </div>
          
          {userLocation && (
            <p className="text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg inline-block font-medium">
              Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
          
          {locationError && !userLocation && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg inline-block font-medium">
              Location access not granted. Click "Sort by Proximity" to enable.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {loading && <p className="text-sm text-slate-500">Loading clinics...</p>}
          {!loading && clinics.length === 0 && (
            <p className="text-sm text-slate-500">No clinics available.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedClinics.map((clinic) => (
              <Card key={clinic.id} className="border rounded-2xl bg-white">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-lg font-black text-slate-900">{clinic.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
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
                      <a href={`tel:${clinic.contactNumber.replace(/[^0-9]/g, '')}`}>Call</a>
                    </Button>
                    <Button
                      onClick={() => openInGoogleMaps(clinic)}
                      variant="default"
                      size="sm"
                      className="flex-1 h-10 bg-[#0077b6] hover:bg-[#00b4d8] text-white rounded-xl font-bold shadow-md shadow-[#0077b6]/20"
                    >
                      <ExternalLink size={14} className="mr-2" /> Open in Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {!loading && clinics.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
                <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, clinics.length)}</span> of{' '}
                <span className="font-bold text-slate-900">{clinics.length}</span> clinics
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full h-9 w-9 p-0 border-slate-300 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={`rounded-full h-9 w-9 p-0 font-bold ${
                        currentPage === page 
                          ? 'bg-[#0077b6] hover:bg-[#00b4d8] text-white shadow-md shadow-[#0077b6]/20' 
                          : 'border-slate-300 text-slate-600 hover:border-[#0077b6] hover:text-[#0077b6]'
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-9 w-9 p-0 border-slate-300 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
