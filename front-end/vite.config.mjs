import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
        svgo: false, // Disable SVGO if having rendering issues
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@icons': path.resolve(__dirname, './src/icons')
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@heroicons/react'
    ]
  }
});