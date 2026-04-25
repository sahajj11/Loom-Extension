"use client";

import { supabase } from '@/lib/supabase';
import { Suspense, useEffect, useState } from 'react';

function PreviewContent() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [copied,setCopied]=useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false);
const [isSaved, setIsSaved] = useState(false);

const [isSharing, setIsSharing] = useState(false);
const [shareUrl, setShareUrl] = useState<string | null>(null);



const handleShare = async () => {
  if (!videoUrl) return;
  setIsSharing(true);

  try {
    // 1. Convert Base64 to Blob
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const fileName = `rec-${Date.now()}.webm`;

    // 2. Upload to Supabase Storage (Assumes a bucket named 'recordings')
    const { data, error } = await supabase.storage
      .from('recordings')
      .upload(fileName, blob, {
        contentType: 'video/webm',
        cacheControl: '3600',
      });

    if (error) throw error;

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recordings')
      .getPublicUrl(fileName);

    // 4. Copy to clipboard
    await navigator.clipboard.writeText(publicUrl);
    setShareUrl(publicUrl);
    alert("Public link copied to clipboard!");

    
    
  } catch (err) {
    console.error("Sharing failed:", err);
    alert("Check your Supabase bucket permissions (set to public).");
  } finally {
    setIsSharing(false);
  }
};

// const handleSave = async () => {
//   if (!videoUrl) return;
  
//   setIsSaving(true);
//   try {
//     const { saveToGallery } = await import('@/lib/db'); // Dynamic import
//     await saveToGallery(videoUrl);
//     setIsSaved(true);
//     setTimeout(() => setIsSaved(false), 3000); // Reset after 3 seconds
//   } catch (err) {
//     console.error("Save failed:", err);
//     alert("Storage full or permission denied.");
//   } finally {
//     setIsSaving(false);
//   }
// }

// Inside your PreviewContent component in app/preview/page.tsx

const handleSave = async () => {
  if (!videoUrl) return;
  
  setIsSaving(true);
  
  try {
    // 1. Create a temporary link element
    const link = document.createElement("a");
    
    // 2. Set the download name (e.g., Capital-Capture-162345.webm)
    const fileName = `Capital-Capture-${new Date().getTime()}.webm`;
    
    link.href = videoUrl;
    link.download = fileName;
    
    // 3. Append to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. Update UI state
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    
    // OPTIONAL: Still save to IndexedDB if you want it in the Gallery too
    const { saveToGallery } = await import('@/lib/db');
    await saveToGallery(videoUrl);
    
  } catch (err) {
    console.error("Download failed:", err);
    alert("Could not download the video.");
  } finally {
    setIsSaving(false);
  }
};

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "VIDEO_DATA") {
        setVideoUrl(event.data.payload);
        setLoading(false);
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 p-6 md:p-12 font-sans">
      <main className="max-w-5xl mx-auto">
        
        {/* Navigation / Top Bar */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Capital Capture</span>
          </div>
          <div className="flex gap-3">
            
           <button 
  onClick={handleSave}
  disabled={isSaving || isSaved || !videoUrl}
  className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg ${
    isSaved 
      ? "bg-green-500 text-white shadow-green-100" 
      : "bg-indigo-600 hover:bg-indigo -700 text-white shadow-violet-200"
  } disabled:opacity-50`}
>
  {isSaving ? (
    "Processing..."
  ) : isSaved ? (
    <>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
      Downloaded
    </>
  ) : (
    <>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      Download to Device
    </>
  )}
</button>

{shareUrl && (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-4 rounded-2xl bg-violet-50 border border-violet-100 flex flex-col md:flex-row items-center gap-4">
      <div className="flex-1 w-full">
        <p className="text-[10px] uppercase tracking-widest font-bold text-violet-400 mb-1 ml-1">Public Share Link</p>
        <div className="relative group w-full">
          <input 
            readOnly 
            value={shareUrl} 
            className="w-full bg-white border border-violet-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute right-2 top-1.5 px-3 py-1 bg-violet-600 text-white text-xs rounded-md font-bold hover:bg-violet-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="hidden md:block h-10 w-px bg-violet-200 mx-2" />
      <div className="flex flex-col items-start">
       
       
      </div>
    </div>
  )}

<button 
    onClick={handleShare}
    disabled={isSharing}
    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-white border-2 border-violet-100 text-violet-600 rounded-xl hover:bg-violet-50 transition-all shadow-sm disabled:opacity-50"
  >
    {isSharing ? (
      <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    )}
    {isSharing ? "Uploading..." : "Get Shareable Link"}
  </button>
          </div>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review your recording</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Ready for review • Generated at {timestamp || "--:--"}
          </p>
        </header>

        {/* The Video Container - Clean Violet Lavender Shadow */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_20px_50px_rgba(124,58,237,0.1)] aspect-video group">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain bg-slate-50" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-violet-100 border-t-indigo-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                </div>
              </div>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest animate-pulse">
                {loading ? "Optimizing Media..." : "Awaiting Data"}
              </p>
            </div>
          )}
        </div>

        {/* Feature Cards Section */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 bg-violet-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Fast Sharing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Instantly available via link. No upload wait times required.</p>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-violet-200 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase tracking-widest">AI Preview</span>
                <span className="text-xs text-violet-100 italic">Powered by Gemini</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Smart Summary coming soon</h3>
              <p className="text-sm text-violet-100 max-w-md">
                Our agentic workflow will soon analyze your recording to identify key takeaways, action items, and technical keywords.
              </p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen" />}>
      <PreviewContent />
    </Suspense>
  );
}