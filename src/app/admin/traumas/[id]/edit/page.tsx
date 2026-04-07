
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Video, Save, Loader2 } from 'lucide-react';
import { fetchTraumaById, updateTrauma } from '@/lib/api-client';
import { TraumaItem, ProtocolType } from '@/lib/types';
import { ImageUpload } from '@/components/ImageUpload';

function getYouTubeVideoId(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function EditTraumaPage() {
  const params = useParams();
  const router = useRouter();
  const [trauma, setTrauma] = useState<TraumaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [titleEn, setTitleEn] = useState('');
  const [titleKn, setTitleKn] = useState('');
  const [protocolType, setProtocolType] = useState<ProtocolType>('first_aid');
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
      setProtocolType(data.type || 'first_aid');
      setVideoUrl(data.videoUrl);
      setThumbnail(data.thumbnail);
      setSteps(data.steps.map((step) => ({ en: step.text.en, kn: step.text.kn, imageUrl: step.imageUrl || '' })));
    }).catch(() => setTrauma(null))
      .finally(() => setIsLoading(false));
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
        type: protocolType,
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

  if (isLoading) return <div className="w-full p-8 text-center text-[#03045e] font-bold">Loading Protocol...</div>;
  if (!trauma && !isLoading) return <div className="w-full p-8 text-center text-destructive font-bold">Protocol not found.</div>;

  return (
    <div className="w-full space-y-8 pb-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-100">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-black text-slate-900">Edit Trauma Protocol</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Protocol Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-bold text-[#03045e]">Protocol Type*</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setProtocolType('first_aid')}
                    className={`flex-1 h-12 rounded-full font-bold transition-all ${
                      protocolType === 'first_aid'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-[#caf0f8]/30 text-[#03045e] border border-[#caf0f8] hover:bg-[#caf0f8]/50'
                    }`}
                  >
                    First Aid
                  </button>
                  <button
                    type="button"
                    onClick={() => setProtocolType('daily_care')}
                    className={`flex-1 h-12 rounded-full font-bold transition-all ${
                      protocolType === 'daily_care'
                        ? 'bg-secondary text-white shadow-lg'
                        : 'bg-[#caf0f8]/30 text-[#03045e] border border-[#caf0f8] hover:bg-[#caf0f8]/50'
                    }`}
                  >
                    Daily Care
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base font-bold text-[#03045e]">Title (English)</Label>
                  <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-bold text-[#03045e]">Title (Kannada)</Label>
                  <Input value={titleKn} onChange={(e) => setTitleKn(e.target.value)} placeholder="ಶೀರ್ಷಿಕೆ" className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">First-Aid Steps</CardTitle>
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
                    <div className="space-y-2">
                      <Label className="text-sm uppercase font-bold text-[#03045e] tracking-widest">Instruction (EN)</Label>
                      <Textarea 
                        value={step.en} 
                        onChange={(e) => updateStep(index, 'en', e.target.value)}
                        className="rounded-3xl bg-white min-h-[100px] border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm p-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm uppercase font-bold text-[#03045e] tracking-widest">Instruction (KN)</Label>
                      <Textarea 
                        value={step.kn} 
                        onChange={(e) => updateStep(index, 'kn', e.target.value)}
                        className="rounded-3xl bg-white min-h-[100px] border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm p-4"
                      />
                    </div>
                    <ImageUpload
                      label="Step Image (Optional)"
                      value={step.imageUrl}
                      onChange={(url) => updateStep(index, 'imageUrl', url)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg shadow-[#0077b6]/10 border border-[#caf0f8]/60 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Media & Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-base font-bold text-[#03045e]"><Video size={18} className="text-[#0077b6]" /> YouTube URL*</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." className="rounded-full bg-white h-12 px-6 border-[#caf0f8] focus-visible:ring-[#00b4d8]/30 shadow-sm" required />
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
              <ImageUpload
                label="Thumbnail*"
                value={thumbnail}
                onChange={setThumbnail}
              />
            </CardContent>
          </Card>

          {error && <p className="text-base text-destructive">{error}</p>}
          <Button onClick={handleUpdate} disabled={isSaving} className="w-full h-14 rounded-full font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save size={18} /> Update Protocol
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
