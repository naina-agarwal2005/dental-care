
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Video, Image as ImageIcon, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createTrauma } from '@/lib/api-client';

export default function NewTraumaPage() {
  const router = useRouter();
  const [titleEn, setTitleEn] = useState('');
  const [titleKn, setTitleKn] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState([{ en: "", kn: "", imageUrl: "" }]);

  const handleAddStep = () => {
    setSteps([...steps, { en: "", kn: "", imageUrl: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: 'en' | 'kn' | 'imageUrl', value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handlePublish = async () => {
    setError('');
    setIsSaving(true);
    try {
      await createTrauma({
        title: { en: titleEn, kn: titleKn },
        videoUrl,
        thumbnail,
        steps: steps.map((step, index) => ({
          stepNumber: index + 1,
          text: { en: step.en, kn: step.kn },
          imageUrl: step.imageUrl,
        })),
      });
      router.push('/admin/traumas');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create trauma');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-black text-slate-900">Create Trauma Protocol</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">Title (English)*</Label>
                  <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. Severe Tooth Pain" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">Title (Kannada)*</Label>
                  <Input value={titleKn} onChange={(e) => setTitleKn(e.target.value)} placeholder="ಶೀರ್ಷಿಕೆ" className="rounded-xl" required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">First-Aid Procedures</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddStep} className="rounded-lg h-9">
                <Plus size={14} className="mr-1" /> Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md">
                    {index + 1}
                  </div>
                  {steps.length > 1 && (
                    <button 
                      onClick={() => handleRemoveStep(index)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Instruction (EN)*</Label>
                        <Textarea 
                          placeholder="Describe step in English..." 
                          value={step.en} 
                          onChange={(e) => updateStep(index, 'en', e.target.value)}
                          className="rounded-xl bg-white min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Instruction (KN)*</Label>
                        <Textarea 
                          placeholder="ಕನ್ನಡದಲ್ಲಿ ಸೂಚನೆ..." 
                          value={step.kn} 
                          onChange={(e) => updateStep(index, 'kn', e.target.value)}
                          className="rounded-xl bg-white min-h-[80px]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Step Image URL (Optional)</Label>
                      <Input 
                        placeholder="https://image-link.com" 
                        value={step.imageUrl}
                        onChange={(e) => updateStep(index, 'imageUrl', e.target.value)}
                        className="rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Media Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold text-slate-500"><Video size={14} /> Main YouTube URL</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold text-slate-500"><ImageIcon size={14} /> Thumbnail URL</Label>
                <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://image-link.com" className="rounded-xl" />
              </div>
              <div className="p-4 bg-slate-100 rounded-xl aspect-video flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed">
                Asset Preview
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handlePublish} disabled={isSaving} className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
            <Save size={18} className="mr-2" /> {isSaving ? 'Publishing...' : 'Publish Protocol'}
          </Button>
        </div>
      </div>
    </div>
  );
}
