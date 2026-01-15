import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3847,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // MUI libraries
          'mui-core': ['@mui/material', '@mui/system', '@mui/icons-material'],
          // Other large dependencies
          'vendor': ['zustand', 'axios'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase limit to 600KB (from default 500KB)
  },
});
