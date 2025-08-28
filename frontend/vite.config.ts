/**
 * @fileoverview Vite configuration for BlockSight.live frontend application
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Vite configuration file that sets up the development and build environment
 * for the React frontend application with TypeScript support.
 * 
 * @dependencies
 * - Vite build tool
 * - React plugin for Vite
 * - TypeScript support
 * - Development server configuration
 * 
 * @usage
 * Configures the build and development environment for the frontend
 * 
 * @state
 * ✅ Functional - Complete Vite configuration with React and TypeScript
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add build optimization
 * - Implement code splitting
 * - Add performance monitoring
 * 
 * @performance
 * - Fast development server
 * - Optimized build output
 * 
 * @security
 * - Safe development configuration
 * - No sensitive data exposure
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },

  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
