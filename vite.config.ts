import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ Relative paths so assets work on Vercel
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild', // Fast + small output
    sourcemap: false,  // Optional: remove if you want source maps in prod
    //treeshake: true,   // Removes unused code
    rollupOptions: {
      output: {
        // Let Vite/Rollup handle safe splitting automatically
      }
    }
  }
})
