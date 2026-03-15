
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TrainingManagementPage() {
  const trainingModules = [
    { title: "Standard Trauma Response", status: "Published", version: "v1.2", category: "Clinical" },
    { title: "Pediatric Dental Anxiety", status: "Draft", version: "v0.9", category: "Patient Care" },
    { title: "Abscess Identification", status: "Published", version: "v2.1", category: "Diagnostics" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-slate-900">Training Modules</h1>
          <p className="text-slate-500 text-sm mt-1">Educate staff and manage internal clinical training protocols.</p>
        </div>
        <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90">
          <Plus size={18} className="mr-2" /> Create Module
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Active Staff Modules</h2>
        {trainingModules.map((module, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer group bg-white">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black text-slate-900 truncate">{module.title}</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{module.category} • {module.version}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary" className="text-[10px] font-black h-6 px-3 rounded-lg uppercase tracking-widest">{module.status}</Badge>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Last Modified 2 Days Ago</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
