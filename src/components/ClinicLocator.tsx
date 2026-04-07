"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, LocateFixed, ExternalLink, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ClinicItem } from '@/lib/types';
import { fetchClinics } from '@/lib/api-client';

const ITEMS_PER_PAGE = 6;

export default function ClinicLocator() {
  const { language } = useLanguage();
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
    <section className="py-8" id="clinic-locator">
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
        {/* Sort Button & Location Info */}
        <div className="space-y-3">
          <div className="flex justify-start">
            <Button 
              onClick={handleLocateUser} 
              variant="outline" 
              className="rounded-full border-primary text-primary font-bold h-11 px-6 shadow-sm bg-surface-container-lowest hover:bg-surface-container-high"
              disabled={isLocating}
            >
              {isLocating ? "Locating..." : <><LocateFixed size={18} className="mr-2" /> {language === 'kn' ? 'ಸಮೀಪದಿಂದ ವಿಂಗಡಿಸಿ' : 'Sort by Proximity'}</>}
            </Button>
          </div>
          
          {userLocation && (
            <p className="text-xs text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg inline-block font-medium">
              {language === 'kn' ? 'ನಿಮ್ಮ ಸ್ಥಳ:' : 'Your location:'} {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
          
          {locationError && !userLocation && (
            <div className="flex items-center gap-3 bg-surface-container-high border border-outline-variant/30 px-4 py-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                <LocateFixed size={18} className="text-on-surface-variant" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">
                  {language === 'kn' ? 'ಸ್ಥಳ ಪ್ರವೇಶ ನೀಡಲಾಗಿಲ್ಲ' : 'Location access not granted'}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {language === 'kn' ? 'ಸಮೀಪದ ಚಿಕಿತ್ಸಾಲಯಗಳನ್ನು ಹುಡುಕಲು "ಸಮೀಪದಿಂದ ವಿಂಗಡಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click "Sort by Proximity" to find nearby clinics'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high"></div>
              <p className="text-on-surface-variant">{language === 'kn' ? 'ಚಿಕಿತ್ಸಾಲಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading clinics...'}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && clinics.length === 0 && (
          <div className="py-12 text-center">
            <MapPin className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
            <p className="text-on-surface-variant">{language === 'kn' ? 'ಯಾವುದೇ ಚಿಕಿತ್ಸಾಲಯಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No clinics available.'}</p>
          </div>
        )}

        {/* Clinic Cards */}
        <div className="grid grid-cols-1 gap-4">
          {paginatedClinics.map((clinic) => (
            <div 
              key={clinic.id} 
              className="group relative bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_20px_40px_rgba(0,30,44,0.06)] hover:scale-[1.01] transition-all duration-300 ease-out flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Clinic Info */}
              <div className="flex items-center gap-5">
                {/* Icon */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-1">{clinic.name}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Phone size={14} className="text-secondary" />
                    <span className="font-medium">{clinic.contactNumber}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <a 
                  href={`tel:${clinic.contactNumber.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3.5 md:py-4 rounded-full font-bold hover:scale-105 transition-transform duration-300"
                >
                  <Phone size={18} />
                  <span className="md:hidden">{language === 'kn' ? 'ಕರೆ' : 'Call'}</span>
                </a>
                <button 
                  onClick={() => openInGoogleMaps(clinic)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-tertiary to-tertiary-container text-white px-6 py-3.5 md:py-4 rounded-full font-bold shadow-md hover:scale-105 transition-transform duration-300"
                >
                  <ExternalLink size={18} />
                  <span className="md:hidden">{language === 'kn' ? 'ನಕ್ಷೆ' : 'Directions'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {!loading && clinics.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30">
            <div className="text-sm text-on-surface-variant font-medium">
              {language === 'kn' ? 'ತೋರಿಸುತ್ತಿದೆ' : 'Showing'}{' '}
              <span className="font-bold text-on-surface">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span>{' '}
              {language === 'kn' ? 'ರಿಂದ' : 'to'}{' '}
              <span className="font-bold text-on-surface">{Math.min(currentPage * ITEMS_PER_PAGE, clinics.length)}</span>{' '}
              {language === 'kn' ? 'ಒಟ್ಟು' : 'of'}{' '}
              <span className="font-bold text-on-surface">{clinics.length}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full h-9 w-9 p-0 border-outline-variant disabled:opacity-50"
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
                        ? 'bg-secondary hover:bg-secondary/90 text-white shadow-md shadow-secondary/20' 
                        : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
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
                className="rounded-full h-9 w-9 p-0 border-outline-variant disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
