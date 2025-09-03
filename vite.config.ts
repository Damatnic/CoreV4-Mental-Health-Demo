import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      },
      // Fix circular dependency issues
      external: [],
      // Prevent variable hoisting issues
      treeshake: {
        moduleSideEffects: false
      }
    },
    // Ensure proper variable scoping
    terserOptions: {
      compress: {
        keep_fnames: true,
        keep_classnames: true
      },
      mangle: {
        keep_fnames: true,
        keep_classnames: true
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // Fix import resolution issues
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // Prevent CSS import issues
  css: {
    postcss: './postcss.config.js'
  }
})