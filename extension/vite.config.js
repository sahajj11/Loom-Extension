import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background/background.js',
        content: 'src/content/content.js',
        offscreen: 'src/offscreen/offscreen.html'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
})