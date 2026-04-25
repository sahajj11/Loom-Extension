/* global chrome */
import { useState } from 'react';
import './popup.css';

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
    <div className="container">
      <div className="header">
        <h1 className="brand">Capital Compute</h1>
        <div className={`status ${recording ? 'live' : ''}`}>
          {recording ? "Recording..." : "Ready"}
        </div>
      </div>

      <button 
        className={`record-btn ${recording ? 'stop' : 'start'}`}
        onClick={toggleRecording}
      >
        <div className="icon"></div>
        {recording ? "Stop Recording" : "Start Capture"}
      </button>

      <p className="hint">Press to record current tab</p>
    </div>
  );
};

export default Popup;