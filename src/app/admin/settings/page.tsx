
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Mail,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure system parameters and admin preferences.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                <Bell size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription className="text-xs">Control how alerts are sent to clinicians.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">New Clinic Registration</Label>
                <p className="text-xs text-slate-400 font-medium">Notify when a new hospital requests verification.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Emergency Hotline Alerts</Label>
                <p className="text-xs text-slate-400 font-medium">Broadcast critical alerts for high-severity protocols.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <CardTitle className="text-lg">Security & Access</CardTitle>
                <CardDescription className="text-xs">Manage administrative credentials.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Email</Label>
                <div className="flex gap-4">
                  <Input defaultValue="admin@swiftdental.org" className="h-11 bg-slate-50 border-slate-100 rounded-xl" />
                  <Button variant="outline" className="rounded-xl h-11 px-6 font-bold">Update</Button>
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Access Key</Label>
                <Input type="password" placeholder="••••••••" className="h-11 bg-slate-50 border-slate-100 rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
            <Save size={18} /> Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
