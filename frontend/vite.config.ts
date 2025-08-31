/**
 * @fileoverview Vite configuration for BlockSight.live frontend application
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-30
 * 
 * @description
 * Vite configuration file that sets up the development and build environment
 * for the React frontend application with TypeScript support.
 * Enhanced with optimized chunk splitting for better bundle performance.
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
 * ✅ Enhanced - Complete Vite configuration with React, TypeScript, and optimized chunk splitting
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Monitor bundle size improvements
 * - Implement advanced performance monitoring
 * - Add bundle analysis tools
 * 
 * @performance
 * - Fast development server
 * - Optimized build output
 * - Efficient chunk splitting
 * - Reduced initial bundle size
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
        changeOrigin: true
        // Removed rewrite rule - keep /api prefix for backend routing
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
          // Core React libraries
          vendor: ['react', 'react-dom'],
          
          // Routing and navigation
          router: ['react-router-dom'],
          
          // Internationalization
          i18n: ['i18next', 'react-i18next'],
          
          // Three.js core (essential 3D functionality)
          threejs: ['three'],
          
          // Three.js standard library (additional features)
          threeStdlib: ['three-stdlib'],
          
          // React Three Fiber (3D React renderer)
          reactThreeFiber: ['@react-three/fiber'],
          
          // React Three Drei (3D React utilities)
          reactThreeDrei: ['@react-three/drei'],
          
          // Route-based chunks for Phase 2 optimization
          pages: [
            './src/pages/Dashboard',
            './src/pages/index'
          ],
          
          // Router system
          appRouter: [
            './src/router/AppRouter'
          ],
          
          // Blockchain 3D components (lazy loaded)
          blockchain3d: [
            './src/components/dashboard-columns/blockchain/BlockchainScene',
            './src/components/dashboard-columns/blockchain/Scene',
            './src/components/dashboard-columns/blockchain/Block',
            './src/components/dashboard-columns/blockchain/PerformanceMonitor'
          ],
          
          // Individual lazy-loaded components
          blockchainVisualizer: [
            './src/components/dashboard-columns/BlockchainVisualizer'
          ],
          
          dashboardData: [
            './src/components/dashboard-columns/DashboardData'
          ],
          
          // Shared components and utilities
          shared: [
            './src/components/shared/LoadingBlocks',
            './src/components/shared/ErrorBoundary',
            './src/components/shared/ErrorDisplay'
          ]
        }
      }
    }
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
