/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/_backup_baseline/**',
      '**/_archive_backend/**'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'wouter', 'lucide-react']
        }
      }
    }
  }
});
