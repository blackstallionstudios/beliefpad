import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild', 
    sourcemap: false,  // Optional: remove if you want source maps in prod
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        
        entryFileNames: (chunkInfo) => {
          
          return chunkInfo.name === 'index' ? 'assets/main.js' : 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  publicDir: 'public' 
})