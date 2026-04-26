# Capital Capture 

**Capital Capture** is a high-performance, AI-native Chrome extension designed to provide a seamless screen and webcam recording experience—built to resemble and exceed the core utility of platforms like Loom.

---

## 🛠️ Features

- **Hybrid Recording**: Captures high-definition screen/tab video along with a circular webcam overlay.
- **Loom-Style Handshake**: Instant redirection to a polished preview dashboard immediately after recording.
- **Cloud Sharing**: Integrated with **Supabase Storage** to generate public, shareable links.
- **Local Persistence**: Uses **IndexedDB** to store recordings locally, ensuring data isn't lost even without an internet connection.
- **Premium UI**: An Indigo/Violet "Light Theme" featuring glassmorphism and animated "glow" effects for a professional UX.

---

## 🏗️ Technical Architecture

- **Extension**: Manifest V3 utilizing an **Offscreen Document** for Canvas-based stream compositing.
- **Frontend**: **Next.js 14** (App Router) with **Tailwind CSS**.
- **Backend/Storage**: **Supabase** (Cloud) & **IndexedDB** (Local).
- **Communication**: Secure cross-origin communication via `postMessage` and Base64 data hand-offs.

---

## 📂 Project Structure
- `/extension`: The Chrome extension source code (React + Vite).
- `/web-app`: The Next.js 14 preview dashboard.

---

## 🚀 Getting Started

### 1. Extension Installation
1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `dist` folder within the extension directory.

### 2. Web Application Setup
If you are running the project locally:
1. Navigate to the `/web-app` directory.
2. Install dependencies: `npm install`.
3. Set up your `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
