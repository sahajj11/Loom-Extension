/* global chrome */


// 1. Listen for messages from the Popup or Content Script
// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_RECORDING") {
    handleStartRecording();
  }

  if (message.action === "STOP_RECORDING") {
    handleStopRecording();
  }
});

// 2. Function to manage the recording start
async function handleStartRecording() {
  // Inject the Camera Bubble into the webpage
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { action: "RENDER_BUBBLE" });
  }

  // Open the Offscreen document to start capturing media
  await setupOffscreenDocument('src/offscreen/offscreen.html');
  
  // Tell the Offscreen document to actually start the MediaRecorder
  chrome.runtime.sendMessage({ action: "INITIATE_CAPTURE" });
}

// 3. Function to stop recording
async function handleStopRecording() {
  chrome.runtime.sendMessage({ action: "FINALIZE_RECORDING" });
}

// 4. Utility to ensure the Offscreen Document exists (Required for MV3)
async function setupOffscreenDocument(path) {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });

  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['USER_MEDIA', 'DISPLAY_MEDIA'],
    justification: 'Recording screen and camera for video messages.',
  });
}