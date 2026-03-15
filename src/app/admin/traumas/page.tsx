
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Edit3,
  Trash2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from '@/context/LanguageContext';
import { TraumaItem } from '@/lib/types';
import { deleteTrauma, fetchTraumas } from '@/lib/api-client';
import Link from 'next/link';

export default function TraumaManagementPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);

  React.useEffect(() => {
    fetchTraumas().then(setTraumas).catch(() => setTraumas([]));
  }, []);

  const labels = {
    en: {
      title: "Manage Protocols",
      subtitle: "Update first-aid instructions for dental emergencies.",
      newBtn: "New Protocol",
      search: "Search protocols...",
      colPreview: "Preview",
      colTitle: "Title & Description",
      colUpdated: "Last Updated",
      showing: "Showing",
      protocols: "clinical protocols",
      edit: "Edit Protocol",
      delete: "Delete Protocol"
    },
    kn: {
      title: "ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
      subtitle: "ದಂತ ತುರ್ತುಸ್ಥಿತಿಗಳಿಗಾಗಿ ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಸೂಚನೆಗಳನ್ನು ನವೀಕರಿಸಿ.",
      newBtn: "ಹೊಸ ಪ್ರೋಟೋಕಾಲ್",
      search: "ಪ್ರೋಟೋಕಾಲ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
      colPreview: "ಪೂರ್ವವೀಕ್ಷಣೆ",
      colTitle: "ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಣೆ",
      colUpdated: "ಕೊನೆಯ ನವೀಕರಣ",
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
      protocols: "ಕ್ಲಿನಿಕಲ್ ಪ್ರೋಟೋಕಾಲ್‌ಗಳು",
      edit: "ಪ್ರೋಟೋಕಾಲ್ ಎಡಿಟ್ ಮಾಡಿ",
      delete: "ಪ್ರೋಟೋಕಾಲ್ ಅಳಿಸಿ"
    }
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  const filteredProtocols = useMemo(() => {
    if (!search.trim()) return traumas;
    const query = search.toLowerCase();
    return traumas.filter((p) => 
      p.title.en.toLowerCase().includes(query) ||
      p.title.kn.toLowerCase().includes(query)
    );
  }, [search, traumas]);

  const handleDelete = async (id: string) => {
    await deleteTrauma(id);
    setTraumas((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-black text-slate-900">{t.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{t.subtitle}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-6 rounded-xl font-bold text-sm shadow-md w-full md:w-auto">
          <Link href="/admin/traumas/new"><Plus size={18} className="mr-2" /> {t.newBtn}</Link>
        </Button>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-white p-4 md:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-slate-50 gap-4">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative group flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" size={14} />
               <Input 
                 placeholder={t.search} 
                 className="pl-10 h-10 w-full bg-slate-50/50 border-slate-100 rounded-xl text-sm focus-visible:ring-primary/10"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="px-6 md:px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 w-[280px]">{t.colPreview}</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.colTitle}</TableHead>
                <TableHead className="hidden md:table-cell text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.colUpdated}</TableHead>
                <TableHead className="w-[220px] text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProtocols.map((protocol) => (
                <TableRow key={protocol.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group align-top">
                  <TableCell className="px-6 md:px-8 py-4 md:py-5">
                    <div className="w-44 h-24 md:w-60 md:h-32 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
                      <img src={protocol.thumbnail} alt={protocol.title.en} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] md:max-w-md">
                      <p className="font-bold text-slate-900 text-sm">{language === 'kn' ? protocol.title.kn : protocol.title.en}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{protocol.numberOfFirstAidSteps} steps</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-slate-500 font-medium">
                    {protocol.updatedAt ? new Date(protocol.updatedAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="px-4 md:px-8">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="rounded-lg h-8 text-xs">
                        <Link href={`/admin/traumas/${protocol.id}/edit`}>
                          <Edit3 size={13} className="mr-1" /> Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-lg h-8 text-xs"
                        onClick={() => handleDelete(protocol.id)}
                      >
                        <Trash2 size={13} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-medium order-2 sm:order-1">{t.showing} {filteredProtocols.length} {t.protocols}</p>
            <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs border-slate-200 flex-1 sm:flex-none" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs border-slate-200 flex-1 sm:flex-none" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
