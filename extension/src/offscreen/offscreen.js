/* global chrome */
let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "INITIATE_CAPTURE") {
    try {
      // Capture the screen/tab and audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // This opens your Next.js dashboard and passes the video
        // In a real app, you'd upload this to a server first
        window.open(`http://localhost:3000/preview?video=${encodeURIComponent(url)}`, '_blank');
        
        // Reset for next time
        recordedChunks = [];
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Failed to start capture:", err);
    }
  }

  if (message.action === "FINALIZE_RECORDING") {
    mediaRecorder?.stop();
    // Stop all tracks to turn off the "recording" indicator in the browser
    mediaRecorder?.stream.getTracks().forEach(track => track.stop());
  }
});