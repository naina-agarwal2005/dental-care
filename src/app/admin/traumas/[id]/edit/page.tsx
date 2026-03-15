
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Video, Save } from 'lucide-react';
import { fetchTraumaById, updateTrauma } from '@/lib/api-client';
import { TraumaItem } from '@/lib/types';

export default function EditTraumaPage() {
  const params = useParams();
  const router = useRouter();
  const [trauma, setTrauma] = useState<TraumaItem | null>(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleKn, setTitleKn] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [steps, setSteps] = useState([{ en: "", kn: "", imageUrl: "" }]);

  useEffect(() => {
    const id = String(params.id || '');
    if (!id) return;
    fetchTraumaById(id).then((data) => {
      setTrauma(data);
      setTitleEn(data.title.en);
      setTitleKn(data.title.kn);
      setVideoUrl(data.videoUrl);
      setThumbnail(data.thumbnail);
      setSteps(data.steps.map((step) => ({ en: step.text.en, kn: step.text.kn, imageUrl: step.imageUrl || '' })));
    }).catch(() => setTrauma(null));
  }, [params.id]);

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

  const handleUpdate = async () => {
    if (!trauma) return;
    setError('');
    setIsSaving(true);
    try {
      await updateTrauma(trauma.id, {
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
      setError(e instanceof Error ? e.message : 'Failed to update trauma');
    } finally {
      setIsSaving(false);
    }
  };

  if (!trauma) return <div>Protocol not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-black text-slate-900">Edit: {trauma.title.en}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Protocol Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Title (Kannada)</Label>
                  <Input value={titleKn} onChange={(e) => setTitleKn(e.target.value)} placeholder="ಶೀರ್ಷಿಕೆ" className="rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">First-Aid Steps</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddStep} className="rounded-lg">
                <Plus size={14} className="mr-1" /> Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-black text-xs shadow-md">
                    {index + 1}
                  </div>
                  <button 
                    onClick={() => handleRemoveStep(index)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Instruction (EN)</Label>
                      <Textarea 
                        value={step.en} 
                        onChange={(e) => updateStep(index, 'en', e.target.value)}
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Instruction (KN)</Label>
                      <Textarea 
                        value={step.kn} 
                        onChange={(e) => updateStep(index, 'kn', e.target.value)}
                        className="rounded-xl bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Step Image URL (Optional)</Label>
                      <Input 
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
              <CardTitle className="text-lg">Media & Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Video size={14} /> YouTube URL</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="rounded-xl" />
              </div>
              <img src={thumbnail} className="rounded-xl w-full aspect-video object-cover" />
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleUpdate} disabled={isSaving} className="w-full h-12 rounded-xl font-bold shadow-lg flex items-center gap-2">
            <Save size={18} /> {isSaving ? 'Updating...' : 'Update Protocol'}
          </Button>
        </div>
      </div>
    </div>
  );
}
