"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList,
  MapPin,
  Plus,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import Link from 'next/link';
import { fetchClinics, fetchTraumas } from '@/lib/api-client';
import { TraumaItem, ClinicItem } from '@/lib/types';

export default function AdminDashboard() {
  const [traumas, setTraumas] = useState<TraumaItem[]>([]);
  const [clinics, setClinics] = useState<ClinicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [passcodeSet, setPasscodeSet] = useState(false);
  const [savedPasscode, setSavedPasscode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [updatingPasscode, setUpdatingPasscode] = useState(false);
  const [passcodeStatus, setPasscodeStatus] = useState({ type: "", message: "" });
  const [showPasscode, setShowPasscode] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchTraumas(), 
      fetchClinics(),
      fetch('/api/admin/settings').then(res => res.json()).catch(() => ({ passcodeSet: false, passcode: "" }))
    ])
      .then(([traumasData, clinicsData, settingsData]) => {
        setTraumas(traumasData);
        setClinics(clinicsData);
        if (settingsData && settingsData.passcodeSet !== undefined) {
          setPasscodeSet(settingsData.passcodeSet);
          setSavedPasscode(settingsData.passcode || "");
        }
      })
      .catch(() => {
        setTraumas([]);
        setClinics([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSavePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setPasscodeStatus({ type: "error", message: "Passcode cannot be empty" });
      return;
    }
    if (passcode.length < 4) {
      setPasscodeStatus({ type: "error", message: "Passcode must be at least 4 characters long" });
      return;
    }
    setUpdatingPasscode(true);
    setPasscodeStatus({ type: "", message: "" });
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasscodeSet(data.passcodeSet);
        setSavedPasscode(passcode);
        setPasscode("");
        setPasscodeStatus({ type: "success", message: "Passcode saved successfully!" });
      } else {
        setPasscodeStatus({ type: "error", message: data.error || "Failed to update passcode" });
      }
    } catch {
      setPasscodeStatus({ type: "error", message: "Connection error" });
    } finally {
      setUpdatingPasscode(false);
    }
  };

  const handleDeletePasscode = async () => {
    if (!window.confirm("Are you sure you want to delete the passcode? This will lock the website for all visitors until a new passcode is configured.")) {
      return;
    }
    setUpdatingPasscode(true);
    setPasscodeStatus({ type: "", message: "" });
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: "" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasscodeSet(false);
        setSavedPasscode("");
        setPasscode("");
        setPasscodeStatus({ type: "success", message: "Passcode deleted successfully. The website is now locked. Enter a new passcode below to unlock it." });
      } else {
        setPasscodeStatus({ type: "error", message: data.error || "Failed to delete passcode" });
      }
    } catch {
      setPasscodeStatus({ type: "error", message: "Connection error" });
    } finally {
      setUpdatingPasscode(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Manage emergency dental care protocols and hospital locations.</p>
      </div>

      {/* Website Access Control Settings */}
      <Card className="border border-[#caf0f8]/60 shadow-lg shadow-[#0077b6]/5 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${passcodeSet ? 'bg-green-500' : 'bg-red-500'}`} />
                <h2 className="text-lg font-bold text-[#03045e] flex items-center gap-2">
                  {passcodeSet ? <Unlock size={18} className="text-green-500" /> : <Lock size={18} className="text-red-500" />}
                  Website Access Passcode
                </h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {passcodeSet 
                  ? "A passcode is currently configured. Visitors must enter this passcode to access the website. You must delete the current passcode before you can set a new one."
                  : "No passcode configured. The website is locked for all visitors with a notice to contact the administrator."}
              </p>
              {passcodeSet && savedPasscode && (
                <div className="flex items-center gap-2 mt-2 pt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Passcode:</span>
                  <span className="text-xs font-bold font-mono text-[#0077b6] bg-[#caf0f8]/30 border border-[#caf0f8]/50 px-2 py-0.5 rounded-md select-all">
                    {savedPasscode}
                  </span>
                </div>
              )}
            </div>
            {passcodeSet ? (
              <div className="w-full md:w-auto flex justify-end shrink-0">
                <Button 
                  onClick={handleDeletePasscode} 
                  disabled={updatingPasscode} 
                  variant="destructive"
                  className="h-11 rounded-xl px-6 font-bold"
                >
                  {updatingPasscode ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  Delete Passcode
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSavePasscode} className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center shrink-0">
                <div className="relative min-w-[200px]">
                  <input 
                    type={showPasscode ? "text" : "password"} 
                    placeholder="Set passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full h-11 px-4 pr-10 border border-[#caf0f8] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077b6] text-slate-900 bg-slate-50/50"
                    disabled={updatingPasscode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button type="submit" disabled={updatingPasscode} className="h-11 rounded-xl bg-[#0077b6] hover:bg-[#00b4d8] text-white px-5 font-bold shrink-0">
                  {updatingPasscode ? <Loader2 size={16} className="animate-spin" /> : "Save Passcode"}
                </Button>
              </form>
            )}
          </div>
          {passcodeStatus.message && (
            <p className={`text-xs font-bold mt-3 ${passcodeStatus.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
              {passcodeStatus.message}
            </p>
          )}
        </CardContent>
      </Card>

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
