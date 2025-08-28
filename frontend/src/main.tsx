/**
 * @fileoverview Main Entry Point for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-25
 * 
 * @description
 * Main entry point that renders the full application with cosmic background
 * and theme support. Cosmic background is handled by CosmicCanvas component.
 * Router context is provided for navigation components.
 * 
 * @dependencies
 * - React 18 with StrictMode
 * - BrowserRouter for routing context
 * - ThemeProvider for theme switching
 * - BitcoinProvider for Bitcoin data
 * - CosmicCanvas for cosmic background
 * - App component for main application
 * 
 * @usage
 * Entry point for the React application
 * 
 * @state
 * ✅ Restored - Full application with cosmic background and routing
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Test theme switching with cosmic background
 * - [LOW] Optimize cosmic background performance
 * 
 * @styling
 * - CSS imports for complete styling system
 * - Theme-aware component rendering
 * - Cosmic background integration
 * 
 * @performance
 * - React 18 optimizations
 * - Efficient cosmic background rendering
 * - Theme switching without re-renders
 * 
 * @security
 * - Safe React rendering
 * - No external dependencies
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { BitcoinProvider } from './contexts/BitcoinContext'
import CosmicCanvas from './components/CosmicCanvas'
import App from './App'
import './i18n' // Initialize i18n before app renders
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* COSMIC BACKGROUND - HTML5 Canvas only */}
    <CosmicCanvas quality="high" />
    
    {/* MAIN APPLICATION */}
    <BrowserRouter>
      <ThemeProvider>
        <BitcoinProvider>
          <App />
        </BitcoinProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
