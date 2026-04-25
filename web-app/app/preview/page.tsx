"use client";

import { Suspense, useEffect, useState } from 'react';

function PreviewContent() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    // Set recording time on mount
    setTimestamp(new Date().toLocaleTimeString());

    // 1. Listen for the Base64 data from the extension
    const handleMessage = (event: MessageEvent) => {
      // Check if message is the video payload
      if (event.data && event.data.type === "VIDEO_DATA") {
        console.log("Success: Video received from extension!");
        setVideoUrl(event.data.payload);
        setLoading(false);
        
        // Cleanup the listener once we have the data
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 p-8 font-sans">
      <main className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Review Recording</h1>
            <p className="text-slate-400 mt-2 font-light">
              Captured at <span className="text-purple-400 font-medium">{timestamp || "--:--"}</span>
            </p>
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/20">
            Save to Dashboard
          </button>
        </header>

        {/* Video Player Display */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-black aspect-video shadow-[0_0_50px_-12px_rgba(124,58,237,0.3)]">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse uppercase tracking-widest text-xs">
                {loading ? "Receiving Data from Extension..." : "Waiting for Stream"}
              </p>
            </div>
          )}
        </div>

        {/* AI Insight Placeholder */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h3 className="text-xs uppercase tracking-widest text-white font-bold mb-2">AI Summary</h3>
          <p className="text-sm text-slate-400 italic">
            "The system is ready for Gemini API integration. Soon, this video will be automatically transcribed and summarized."
          </p>
        </div>
      </main>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="bg-[#0B0F1A] min-h-screen" />}>
      <PreviewContent />
    </Suspense>
  );
}