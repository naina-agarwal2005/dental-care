
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, MapPin, ArrowUpRight } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Mon', visits: 400 },
  { name: 'Tue', visits: 300 },
  { name: 'Wed', visits: 500 },
  { name: 'Thu', visits: 280 },
  { name: 'Fri', visits: 590 },
  { name: 'Sat', visits: 320 },
  { name: 'Sun', visits: 190 },
];

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-black text-slate-900">Analytics Reports</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time usage metrics for Patna emergency dental portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Page Views', value: '12.4k', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Unique Users', value: '4.8k', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Clinic Queries', value: '892', icon: MapPin, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Avg Session', value: '2:45', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className={stat.bg + " p-2.5 rounded-xl " + stat.color}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl">Weekly Traffic</CardTitle>
          <p className="text-xs text-slate-400 font-medium">Daily visits across all protocols</p>
        </CardHeader>
        <CardContent className="px-0 pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <Bar 
                  dataKey="visits" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
