import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-10">
      <nav className="flex justify-between items-center mb-16">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Capital Compute
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700" />
      </nav>

      <h2 className="text-xl font-semibold mb-8">Recent Recordings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder for empty state */}
        <div className="col-span-full py-20 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500">
          <p>Your library is empty.</p>
          <p className="text-sm">Use the Chrome extension to start recording.</p>
        </div>
      </div>
    </div>
  );
}