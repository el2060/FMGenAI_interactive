import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vercel sets VERCEL=1 at build time; GitHub Pages build doesn't.
// On Vercel the app is served at the root, so base must be '/'.
// On GitHub Pages it's served from /FMGenAI_interactive/.
const isVercel = !!process.env.VERCEL;

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' && !isVercel ? '/FMGenAI_interactive/' : '/',
}));
