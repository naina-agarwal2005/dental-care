"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList,
  MapPin,
  Plus,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { fetchClinics, fetchTraumas } from '@/lib/api-client';
import { TraumaItem, ClinicItem } from '@/lib/types';

export default function AdminDashboard() {
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTraumas(), fetchClinics()])
      .then(([traumasData, clinicsData]) => {
        setTraumas(traumasData);
        setClinics(clinicsData);
      })
      .catch(() => {
        setTraumas([]);
        setClinics([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Manage emergency dental care protocols and hospital locations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-[#caf0f8]/60 shadow-lg shadow-[#0077b6]/5 bg-white rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#caf0f8]/50 flex items-center justify-center">
                <ClipboardList size={20} className="text-[#0077b6]" />
              </div>
              {loading ? (
                <Loader2 size={24} className="animate-spin text-[#0077b6]" />
              ) : (
                <span className="text-3xl font-black text-[#03045e]">{traumas.length}</span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-3">Protocols</p>
          </CardContent>
        </Card>

        <Card className="border border-[#caf0f8]/60 shadow-lg shadow-[#0077b6]/5 bg-white rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#caf0f8]/50 flex items-center justify-center">
                <MapPin size={20} className="text-[#0077b6]" />
              </div>
              {loading ? (
                <Loader2 size={24} className="animate-spin text-[#0077b6]" />
              ) : (
                <span className="text-3xl font-black text-[#03045e]">{clinics.length}</span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-3">Hospitals</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Protocols Card */}
        <Card className="border border-[#caf0f8]/60 shadow-lg shadow-[#0077b6]/10 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-[#caf0f8]/30 bg-[#caf0f8]/10 p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#03045e] flex items-center gap-2">
                <ClipboardList size={20} className="text-[#0077b6]" />
                Emergency Protocols
              </CardTitle>
              <Button asChild size="sm" className="rounded-full h-9 px-4 bg-[#0077b6] hover:bg-[#00b4d8] font-bold">
                <Link href="/admin/traumas/new">
                  <Plus size={16} className="mr-1" /> Add New
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 size={24} className="animate-spin text-[#0077b6]" />
              </div>
            ) : traumas.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No protocols yet</div>
            ) : (
              <div className="divide-y divide-[#caf0f8]/30">
                {traumas.slice(0, 4).map((trauma) => (
                  <Link 
                    key={trauma.id} 
                    href={`/admin/traumas/${trauma.id}/edit`}
                    className="flex items-center justify-between p-4 hover:bg-[#caf0f8]/10 transition-colors min-h-[80px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={trauma.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{trauma.title.en}</p>
                        <p className="text-xs text-slate-500">{trauma.numberOfFirstAidSteps} steps</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
            {traumas.length > 0 && (
              <div className="p-4 border-t border-[#caf0f8]/30 bg-slate-50/50">
                <Button asChild variant="ghost" className="w-full rounded-full font-bold text-[#0077b6] hover:bg-[#caf0f8]/30">
                  <Link href="/admin/traumas">
                    View All Protocols <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hospitals Card */}
        <Card className="border border-[#caf0f8]/60 shadow-lg shadow-[#0077b6]/10 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-[#caf0f8]/30 bg-[#caf0f8]/10 p-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#03045e] flex items-center gap-2">
                <MapPin size={20} className="text-[#0077b6]" />
                Hospital Locations
              </CardTitle>
              <Button asChild size="sm" className="rounded-full h-9 px-4 bg-[#0077b6] hover:bg-[#00b4d8] font-bold">
                <Link href="/admin/clinics/new">
                  <Plus size={16} className="mr-1" /> Add New
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 size={24} className="animate-spin text-[#0077b6]" />
              </div>
            ) : clinics.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No hospitals yet</div>
            ) : (
              <div className="divide-y divide-[#caf0f8]/30">
                {clinics.slice(0, 4).map((clinic) => (
                  <Link 
                    key={clinic.id} 
                    href={`/admin/clinics/${clinic.id}/edit`}
                    className="flex items-center justify-between p-4 hover:bg-[#caf0f8]/10 transition-colors min-h-[80px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#caf0f8]/30 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-[#0077b6]" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{clinic.name}</p>
                        <p className="text-xs text-slate-500">{clinic.contactNumber}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
            {clinics.length > 0 && (
              <div className="p-4 border-t border-[#caf0f8]/30 bg-slate-50/50">
                <Button asChild variant="ghost" className="w-full rounded-full font-bold text-[#0077b6] hover:bg-[#caf0f8]/30">
                  <Link href="/admin/clinics">
                    View All Hospitals <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
