"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Edit3, 
  Trash2,
  ArrowLeft,
  Navigation2,
  Loader2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';
import { ClinicItem } from '@/lib/types';
import { deleteClinic, fetchClinics } from '@/lib/api-client';

const ITEMS_PER_PAGE = 5;

export default function ClinicManagementPage() {
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    fetchClinics()
      .then(setClinics)
      .catch(() => setClinics([]))
      .finally(() => setLoading(false));
  }, []);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredClinics = useMemo(() => {
    if (!search.trim()) return clinics;
    const query = search.toLowerCase();
    return clinics.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.contactNumber.toLowerCase().includes(query)
    );
  }, [clinics, search]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredClinics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClinics = filteredClinics.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hospital?')) return;
    setDeletingId(id);
    try {
      await deleteClinic(id);
      setClinics((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete hospital:', error);
      alert('Failed to delete hospital. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 w-full mx-auto">
        {/* Back Button and Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <Link href="/admin">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Hospital Locations</h1>
        </div>

        {/* Subtitle and Action Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-slate-500 text-base">Manage registered emergency dental centers.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-6 rounded-full font-bold text-sm shadow-lg shadow-primary/20 w-full md:w-auto">
            <Link href="/admin/clinics/new"><Plus size={18} className="mr-2" /> Add Hospital</Link>
          </Button>
        </div>

        {/* Table Section */}
        <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-transparent p-4 md:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-[#caf0f8] gap-4">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00b4d8] group-focus-within:text-primary" size={14} />
                <Input 
                  placeholder="Search hospitals by name or contact..." 
                  className="pl-10 h-12 w-full bg-[#caf0f8]/20 border-transparent hover:bg-[#caf0f8]/40 focus:bg-white rounded-full text-base focus-visible:ring-primary/20 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto bg-white">
            <Table>
              <TableHeader className="bg-[#caf0f8]/20">
                <TableRow className="border-none">
                  <TableHead className="px-6 md:px-8 text-sm font-bold uppercase tracking-widest text-[#0077b6]">Hospital Name</TableHead>
                  <TableHead className="text-sm font-bold uppercase tracking-widest text-[#0077b6]">Contact</TableHead>
                  <TableHead className="hidden md:table-cell text-sm font-bold uppercase tracking-widest text-[#0077b6]">Location</TableHead>
                  <TableHead className="w-[200px] text-sm font-bold uppercase tracking-widest text-[#0077b6] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="animate-spin text-primary" />
                        <p className="text-slate-500 font-medium">Loading hospitals...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredClinics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center">
                      <p className="text-slate-500 font-medium">No hospitals found</p>
                    </TableCell>
                  </TableRow>
                ) : paginatedClinics.map((clinic) => (
                  <TableRow key={clinic.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group">
                    <TableCell className="px-6 md:px-8 py-4 md:py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#caf0f8]/30 flex items-center justify-center shrink-0">
                          <MapPin size={18} className="text-[#0077b6]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{clinic.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-base text-slate-700 font-medium">
                        <Phone size={14} className="text-[#0077b6]" />
                        {clinic.contactNumber}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-slate-500 font-medium">
                      {clinic.lat.toFixed(4)}, {clinic.lng.toFixed(4)}
                    </TableCell>
                    <TableCell className="px-4 md:px-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full h-11 w-11 shadow-sm border-slate-200 text-slate-600 hover:text-[#0077b6] hover:bg-[#caf0f8]/30 hover:border-[#90e0ef]"
                              onClick={() => window.open(clinic.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`, '_blank')}
                              disabled={deletingId !== null}
                            >
                              <Navigation2 size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open in Maps</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              asChild 
                              size="icon" 
                              variant="outline" 
                              className="rounded-full h-11 w-11 shadow-sm border-slate-200 text-slate-600 hover:text-[#0077b6] hover:bg-[#caf0f8]/30 hover:border-[#90e0ef]"
                              disabled={deletingId !== null}
                            >
                              <Link href={`/admin/clinics/${clinic.id}/edit`}>
                                <Edit3 size={18} />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Hospital</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="rounded-full h-11 w-11 shadow-sm"
                              onClick={() => handleDelete(clinic.id)}
                              disabled={deletingId !== null}
                            >
                              {deletingId === clinic.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Hospital</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 font-medium order-2 sm:order-1">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredClinics.length)} of {filteredClinics.length} hospitals
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 rounded-full text-sm border-slate-200 px-6 flex-1 sm:flex-none font-bold disabled:opacity-50" 
                  disabled={currentPage === 1 || loading}
                  onClick={handlePrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600 font-medium px-2">
                  {currentPage} / {totalPages || 1}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 rounded-full text-sm border-slate-200 px-6 flex-1 sm:flex-none font-bold disabled:opacity-50" 
                  disabled={currentPage >= totalPages || loading}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
