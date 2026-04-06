
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Video, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createTrauma } from '@/lib/api-client';

function getYouTubeVideoId(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

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
    <div className="w-full space-y-8 pb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-100">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-black text-slate-900">Create Trauma Protocol</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base font-bold text-[#03045e]">Title (English)*</Label>
                  <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. Severe Tooth Pain" className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-bold text-[#03045e]">Title (Kannada)*</Label>
                  <Input value={titleKn} onChange={(e) => setTitleKn(e.target.value)} placeholder="ಶೀರ್ಷಿಕೆ" className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">First-Aid Procedures</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddStep} className="rounded-full h-10 px-6 bg-[#caf0f8]/30 border-[#90e0ef] text-[#0077b6] hover:bg-[#90e0ef]/30 font-bold">
                <Plus size={14} className="mr-1" /> Add Step
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="p-6 bg-[#caf0f8]/10 rounded-[2rem] border border-[#90e0ef]/40 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#0077b6] font-black text-lg">Step {index + 1}</h3>
                    {steps.length > 1 && (
                      <button 
                        onClick={() => handleRemoveStep(index)}
                        className="text-[#00b4d8] hover:text-destructive transition-colors flex items-center gap-1 text-sm font-bold"
                      >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm uppercase font-bold text-[#03045e] tracking-widest">Instruction (EN)*</Label>
                        <Textarea 
                          placeholder="Describe step in English..." 
                          value={step.en} 
                          onChange={(e) => updateStep(index, 'en', e.target.value)}
                          className="rounded-3xl bg-white min-h-[100px] border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm p-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm uppercase font-bold text-[#03045e] tracking-widest">Instruction (KN)*</Label>
                        <Textarea 
                          placeholder="ಕನ್ನಡದಲ್ಲಿ ಸೂಚನೆ..." 
                          value={step.kn} 
                          onChange={(e) => updateStep(index, 'kn', e.target.value)}
                          className="rounded-3xl bg-white min-h-[100px] border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm p-4"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm uppercase font-bold text-[#03045e] tracking-widest">Step Image URL (Optional)</Label>
                      <Input 
                        placeholder="https://image-link.com" 
                        value={step.imageUrl}
                        onChange={(e) => updateStep(index, 'imageUrl', e.target.value)}
                        className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm"
                      />
                      {step.imageUrl && (
                        <div className="pt-2">
                          <img src={step.imageUrl} alt={`Step ${index + 1} preview`} className="rounded-3xl w-full max-w-sm aspect-video object-cover shadow-sm border border-[#caf0f8]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Media Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base font-bold text-[#03045e]"><Video size={18} className="text-[#0077b6]" /> Main YouTube URL*</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" required />
                {videoUrl && !getYouTubeVideoId(videoUrl) && (
                  <p className="text-sm text-destructive font-semibold px-2 mt-1">Invalid YouTube URL. Unable to generate preview.</p>
                )}
                {getYouTubeVideoId(videoUrl) && (
                  <div className="pt-2">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(videoUrl)}`}
                      className="rounded-3xl w-full aspect-video shadow-sm border border-[#caf0f8]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base font-bold text-[#03045e]"><ImageIcon size={18} className="text-[#0077b6]" /> Thumbnail URL*</Label>
                <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://image-link.com" className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" required />
              </div>
              {thumbnail && (
                <img src={thumbnail} alt="Thumbnail preview" className="rounded-3xl w-full aspect-video object-cover shadow-sm border border-[#caf0f8]" />
              )}
            </CardContent>
          </Card>

          {error && <p className="text-base text-destructive">{error}</p>}
          <Button onClick={handlePublish} disabled={isSaving} className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSaving ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> Publish Protocol
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
