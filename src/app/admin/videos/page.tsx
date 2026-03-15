"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Edit3, 
  Trash2,
  Video as VideoIcon,
  Clock,
  ExternalLink
} from 'lucide-react';
import { INSTRUCTIONAL_VIDEOS } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function VideoManagementPage() {
  const [videos] = useState(INSTRUCTIONAL_VIDEOS);
  const [search, setSearch] = useState("");

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;
    const query = search.toLowerCase();
    return videos.filter(v => 
      v.title.toLowerCase().includes(query) || 
      v.category.toLowerCase().includes(query)
    );
  }, [videos, search]);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-black text-slate-900">Video Library</h1>
          <p className="text-slate-500 text-sm mt-1">Manage first-aid and routine instructional content.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 h-11 px-6 rounded-xl font-bold text-sm shadow-md w-full md:w-auto">
          <Plus size={18} className="mr-2" /> Add New Video
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-none shadow-sm rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-1 md:space-y-2">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center">
            <VideoIcon size={20} />
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900">{videos.length}</p>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Videos</p>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-1 md:space-y-2">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Play size={20} />
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900">{videos.filter(v => v.status === 'Active').length}</p>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Content</p>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-1 md:space-y-2">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Clock size={20} />
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900">{videos.filter(v => v.status === 'Pending Review').length}</p>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Review</p>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center space-y-1 md:space-y-2">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-500 rounded-xl md:rounded-2xl flex items-center justify-center">
            <ExternalLink size={20} />
          </div>
          <p className="text-xl md:text-2xl font-black text-slate-900">4.8k</p>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Views</p>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-[1.5rem] md:rounded-3xl overflow-hidden">
        <CardHeader className="bg-white p-4 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-50 gap-4">
          <div className="flex-1">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary" size={14} />
               <Input 
                 placeholder="Search library..." 
                 className="pl-10 h-10 w-full sm:w-64 bg-slate-50/50 border-slate-100 rounded-xl text-xs focus-visible:ring-primary/10" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 border-slate-200 text-slate-500 hover:text-slate-900 flex-1 sm:flex-none">
              <Filter size={14} className="mr-2" /> Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="px-6 md:px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Preview</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Video Information</TableHead>
                <TableHead className="hidden md:table-cell text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group">
                  <TableCell className="px-6 md:px-8 py-4 md:py-5">
                    <div className="relative w-20 md:w-24 aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm group">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Play size={16} className="text-white fill-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/60 text-[8px] font-bold text-white px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] md:max-w-xs">
                      <p className="font-bold text-slate-900 text-sm leading-tight">{video.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate">{video.url}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[10px] font-bold border-slate-200 text-slate-600 bg-white shadow-sm">
                      {video.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        video.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-orange-500 animate-pulse"
                      )} />
                      <span className="text-xs font-bold text-slate-700">{video.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 md:px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl w-40">
                        <DropdownMenuItem className="gap-2 text-xs font-bold py-2.5 px-3">
                          <Edit3 size={14} className="text-slate-400" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs font-bold py-2.5 px-3">
                          <ExternalLink size={14} className="text-slate-400" /> View Live
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs font-bold py-2.5 px-3 text-destructive hover:text-destructive">
                          <Trash2 size={14} /> Delete Video
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredVideos.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No videos found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
