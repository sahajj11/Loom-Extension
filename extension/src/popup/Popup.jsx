/* global chrome */
import { useState } from "react";

const Popup = () => {
  const [recording, setRecording] = useState(false);

  const toggleRecording = () => {
    if (!recording) {
      chrome.runtime.sendMessage({ action: "START_RECORDING" });
    } else {
      chrome.runtime.sendMessage({ action: "STOP_RECORDING" });
    }
    setRecording(!recording);
  };

  return (
    <div className="w-[350px] min-h-[450px] bg-white flex flex-col font-sans border-l border-slate-100 shadow-2xl">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Capital Capture
          </h1>
        </div>

        {/* Status Badge */}
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-500 ${
            recording
              ? "bg-rose-50 text-rose-600"
              : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${recording ? "bg-rose-500 animate-pulse" : "bg-indigo-500"}`}
          />
          {recording ? "Recording" : "Ready"}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center gap-8">
        {/* Visual Feedback Circle */}
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute w-48 h-48 rounded-full transition-all duration-700 ${
              recording
                ? "bg-rose-100 scale-110 opacity-40 animate-ping"
                : "bg-indigo-50 scale-100 opacity-100"
            }`}
          />

          <button
            onClick={toggleRecording}
            className={`relative cursor-pointer z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl ${
              recording
                ? "bg-rose-600 shadow-rose-200"
                : "bg-indigo-600 shadow-indigo-200"
            }`}
          >
            {recording ? (
              <div className="w-8 h-8 bg-white rounded-sm" /> // Stop Square
            ) : (
              <div className="w-10 h-10 border-4 border-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div> // Start Circle
            )}
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-slate-800 font-bold text-base">
            {recording ? "Capture in progress..." : "Screen + Webcam"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-[200px]">
            {recording
              ? "Your camera and screen are being recorded."
              : "Click to start your seamless recording experience."}
          </p>
        </div>
      </main>

    </div>
  );
};

export default Popup;
