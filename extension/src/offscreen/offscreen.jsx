/* global chrome */

let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "INITIATE_CAPTURE") {
    try {
      // 1. Capture screen/tab and audio
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
        const reader = new FileReader();

        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
          const base64data = reader.result;
          
          // 2. Open the Next.js preview page
          const previewUrl = `http://localhost:3000/preview`;
          const newTab = window.open(previewUrl, '_blank');

          // 3. The "Loom Handshake": Push data to the tab until it's ready
          if (newTab) {
            const handshakeInterval = setInterval(() => {
              newTab.postMessage({ 
                type: "VIDEO_DATA", 
                payload: base64data 
              }, "http://localhost:3000");
            }, 1000);

            // Stop trying after 10 seconds to save memory
            setTimeout(() => clearInterval(handshakeInterval), 10000);
          }
        };

        recordedChunks = [];
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Failed to start capture:", err);
    }
  }

  if (message.action === "FINALIZE_RECORDING") {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      // Stop all tracks to turn off the hardware lights
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
});