// content.js
/* global chrome */
// Listen for the command to show the bubble
console.log("🚀 Content Script is alive at:", window.location.href);
// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RENDER_BUBBLE") {
    let video = document.getElementById("extension-webcam-bubble");

    if (!video) {
      video = document.createElement("video");
      video.id = "extension-webcam-bubble";
      video.autoplay = true;
      video.style.cssText =
        "position:fixed; bottom:20px; left:20px; width:150px; height:150px; border-radius:50%; z-index:100000; object-fit:cover; background:black;";
      document.body.appendChild(video);
    }

    // Access the camera directly on the page
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));
  }
});
