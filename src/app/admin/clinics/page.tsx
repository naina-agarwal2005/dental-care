"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Navigation2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { ClinicItem } from '@/lib/types';
import { deleteClinic, fetchClinics } from '@/lib/api-client';

export default function ClinicManagementPage() {
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    fetchClinics().then(setClinics).catch(() => setClinics([]));
  }, []);

  const filteredClinics = useMemo(() => {
    if (!search.trim()) return clinics;
    const query = search.toLowerCase();
    return clinics.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.contactNumber.toLowerCase().includes(query)
    );
  }, [clinics, search]);

  const handleDelete = async (id: string) => {
    await deleteClinic(id);
    setClinics((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-black text-slate-900">Hospital Locations</h1>
          <p className="text-slate-500 text-sm mt-1">Manage Patna's registered emergency dental centers.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-6 rounded-xl font-bold text-sm shadow-md w-full md:w-auto">
          <Link href="/admin/clinics/new"><Plus size={18} className="mr-2" /> Add Hospital</Link>
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" size={16} />
        <Input
          placeholder="Search clinics by name or contact..."
          className="pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm focus-visible:ring-primary/10 shadow-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClinics.map((clinic) => (
          <Card key={clinic.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{clinic.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" /> {clinic.lat}, {clinic.lng}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border-slate-100 shadow-xl w-44">
                    <DropdownMenuItem asChild className="gap-2 text-xs font-bold py-2.5">
                      <Link href={`/admin/clinics/${clinic.id}/edit`}>
                        <Edit3 size={14} className="text-slate-400" /> Edit Clinic
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs font-bold py-2.5" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`, '_blank')}>
                      <Navigation2 size={14} className="text-slate-400" /> Open in Maps
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs font-bold py-2.5 text-destructive" onClick={() => handleDelete(clinic.id)}>
                      <Trash2 size={14} /> Remove Hospital
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Phone size={14} className="text-primary" /> {clinic.contactNumber}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredClinics.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No clinics found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
