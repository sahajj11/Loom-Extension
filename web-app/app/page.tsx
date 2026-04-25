"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SavedVideo {
  id: number;
  data: string;
  timestamp: string;
  name: string;
}

export default function Dashboard() {
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { getAllVideos } = await import('@/lib/db');
        const data = await getAllVideos();
        setVideos(data.reverse()); // Show newest first
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 p-8 md:p-12">
      <main className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Library</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and share your recordings</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">Final Year CS</p>
                <p className="text-xs text-slate-400">Software Intern</p>
             </div>
             <div className="w-10 h-10 bg-violet-100 rounded-full border border-violet-200 flex items-center justify-center text-violet-600 font-bold">
                AD
             </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="text-slate-500 font-medium">No recordings yet</p>
            <p className="text-sm text-slate-400 mt-1">Use the extension to capture your first video.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-100 transition-all group">
                {/* Thumbnail Preview */}
                <div className="aspect-video bg-slate-900 relative">
                  <video src={video.data} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <Link 
                      href={`/preview?video=${encodeURIComponent(video.data)}`}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-violet-600 shadow-xl scale-90 group-hover:scale-100 transition-transform"
                    >
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </Link>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{video.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(video.timestamp).toLocaleDateString()} • {new Date(video.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}