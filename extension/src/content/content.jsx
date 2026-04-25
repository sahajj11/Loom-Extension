/* global chrome */

import ReactDOM from 'react-dom/client';
import Bubble from './Buble';


chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "RENDER_BUBBLE") {
    // Check if bubble already exists
    if (document.getElementById('capital-compute-root')) return;

    // Create a container for our React app
    const container = document.createElement('div');
    container.id = 'capital-compute-root';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(<Bubble />);
  }
});