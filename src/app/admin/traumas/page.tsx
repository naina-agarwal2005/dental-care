
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Edit3,
  Trash2,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem, ProtocolType } from '@/lib/types';
import { deleteTrauma, fetchTraumas } from '@/lib/api-client';
import Link from 'next/link';

const ITEMS_PER_PAGE = 5;

export default function TraumaManagementPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProtocolType | 'all'>('all');
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    fetchTraumas()
      .then(setTraumas)
      .catch(() => setTraumas([]))
      .finally(() => setLoading(false));
  }, []);

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  const labels = {
    en: {
      title: "Manage Protocols",
      subtitle: "Update first-aid and daily care instructions for dental health.",
      newBtn: "New Protocol",
      search: "Search protocols...",
      colPreview: "Preview",
      colTitle: "Title & Description",
      colType: "Type",
      colUpdated: "Last Updated",
      showing: "Showing",
      protocols: "clinical protocols",
      edit: "Edit Protocol",
      delete: "Delete Protocol",
      all: "All",
      firstAid: "First Aid",
      dailyCare: "Daily Care"
    },
    kn: {
      title: "ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
      subtitle: "ದಂತ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮತ್ತು ದೈನಂದಿನ ಆರೈಕೆ ಸೂಚನೆಗಳನ್ನು ನವೀಕರಿಸಿ.",
      newBtn: "ಹೊಸ ಪ್ರೋಟೋಕಾಲ್",
      search: "ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
      colPreview: "ಪೂರ್ವವೀಕ್ಷಣೆ",
      colTitle: "ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಣೆ",
      colType: "ಪ್ರಕಾರ",
      colUpdated: "ಕೊನೆಯ ನವೀಕರಣ",
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
      protocols: "ಕ್ಲಿನಿಕಲ್ ಪ್ರೋಟೋಕಾಲ್‌ಗಳು",
      edit: "ಪ್ರೋಟೋಕಾಲ್ ಎಡಿಟ್ ಮಾಡಿ",
      delete: "ಪ್ರೋಟೋಕಾಲ್ ಅಳಿಸಿ",
      all: "ಎಲ್ಲಾ",
      firstAid: "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ",
      dailyCare: "ದೈನಂದಿನ ಆರೈಕೆ"
    }
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  const filteredProtocols = useMemo(() => {
    let filtered = traumas;
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }
    
    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter((p) => 
        p.title.en.toLowerCase().includes(query) ||
        p.title.kn.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [search, typeFilter, traumas]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProtocols.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProtocols = filteredProtocols.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this protocol?')) return;
    setDeletingId(id);
    try {
      await deleteTrauma(id);
      setTraumas((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete protocol:', error);
      alert('Failed to delete protocol. Please try again.');
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
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t.title}</h1>
        </div>

        {/* Subtitle and Action Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-slate-500 text-base">{t.subtitle}</p>
        <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-6 rounded-full font-bold text-sm shadow-lg shadow-primary/20 w-full md:w-auto">
          <Link href="/admin/traumas/new"><Plus size={18} className="mr-2" /> {t.newBtn}</Link>
        </Button>
      </div>

      {/* Table Section */}
      <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-transparent p-4 md:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-[#caf0f8] gap-4">
          <div className="flex flex-1 items-center gap-4 flex-wrap">
            <div className="relative group flex-1 min-w-[200px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00b4d8] group-focus-within:text-primary" size={14} />
               <Input 
                 placeholder={t.search} 
                 className="pl-10 h-12 w-full bg-[#caf0f8]/20 border-transparent hover:bg-[#caf0f8]/40 focus:bg-white rounded-full text-base focus-visible:ring-primary/20 transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  typeFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.all}
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('first_aid')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  typeFilter === 'first_aid'
                    ? 'bg-primary text-white'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {t.firstAid}
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('daily_care')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  typeFilter === 'daily_care'
                    ? 'bg-secondary text-white'
                    : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                }`}
              >
                {t.dailyCare}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-[#caf0f8]/20">
              <TableRow className="border-none">
                <TableHead className="px-6 md:px-8 text-sm font-bold uppercase tracking-widest text-[#0077b6] w-[280px]">{t.colPreview}</TableHead>
                <TableHead className="text-sm font-bold uppercase tracking-widest text-[#0077b6]">{t.colTitle}</TableHead>
                <TableHead className="hidden md:table-cell text-sm font-bold uppercase tracking-widest text-[#0077b6]">{t.colType}</TableHead>
                <TableHead className="hidden md:table-cell text-sm font-bold uppercase tracking-widest text-[#0077b6]">{t.colUpdated}</TableHead>
                <TableHead className="w-[140px] text-sm font-bold uppercase tracking-widest text-[#0077b6] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="animate-spin text-primary" />
                      <p className="text-slate-500 font-medium">Loading protocols...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProtocols.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <p className="text-slate-500 font-medium">No protocols found</p>
                  </TableCell>
                </TableRow>
              ) : paginatedProtocols.map((protocol) => (
                <TableRow key={protocol.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group align-top">
                  <TableCell className="px-6 md:px-8 py-4 md:py-5">
                    <div className="w-44 h-24 md:w-60 md:h-32 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm relative">
                      <Image src={protocol.thumbnail} alt={protocol.title.en} fill className="object-cover" sizes="(max-width: 768px) 176px, 240px" unoptimized={protocol.thumbnail.startsWith('/api/')} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] md:max-w-md">
                      <p className="font-bold text-slate-900 text-base">{language === 'kn' ? protocol.title.kn : protocol.title.en}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{protocol.numberOfFirstAidSteps} steps</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      protocol.type === 'daily_care' 
                        ? 'bg-secondary/10 text-secondary' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {protocol.type === 'daily_care' ? t.dailyCare : t.firstAid}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-base text-slate-500 font-medium">
                    {protocol.updatedAt ? new Date(protocol.updatedAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="px-4 md:px-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            asChild 
                            size="icon" 
                            variant="outline" 
                            className="rounded-full h-11 w-11 shadow-sm border-slate-200 text-slate-600 hover:text-[#0077b6] hover:bg-[#caf0f8]/30 hover:border-[#90e0ef]"
                            disabled={deletingId !== null}
                          >
                            <Link href={`/admin/traumas/${protocol.id}/edit`}>
                              <Edit3 size={18} />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.edit}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="rounded-full h-11 w-11 shadow-sm"
                            onClick={() => handleDelete(protocol.id)}
                            disabled={deletingId !== null}
                          >
                            {deletingId === protocol.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.delete}</p>
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
              {t.showing} {startIndex + 1}-{Math.min(endIndex, filteredProtocols.length)} of {filteredProtocols.length} {t.protocols}
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
