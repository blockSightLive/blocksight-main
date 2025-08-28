/**
 * @fileoverview Main Application Component for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-27
 * 
 * @description
 * Main application component that renders the complete dashboard.
 * Includes splash screen with LoadingBlocks component for 2 seconds display
 * followed by 2-second fade-out animation while dashboard fades in.
 * Works with cosmic background from BackgroundToggle component.
 * 
 * @dependencies
 * - ThemeContext for theme switching
 * - BitcoinContext for Bitcoin data
 * - Dashboard component for main content
 * - Header and Footer components
 * - LoadingBlocks component for splash screen
 * 
 * @usage
 * Main application component rendered by main.tsx
 * 
 * @state
 * ✅ Enhanced - Full application with smooth splash screen animations and cosmic background support
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Test theme switching with cosmic background
 * - [LOW] Optimize component rendering performance
 * 
 * @styling
 * - CSS Modules for component styling
 * - Theme-aware styling via CSS custom properties
 * - Proper z-index layering with cosmic background
 * 
 * @performance
 * - Efficient component rendering
 * - Theme switching optimization
 * - Cosmic background integration
 * 
 * @security
 * - Safe component rendering
 * - No external dependencies
 */

import React, { useState, useEffect } from 'react'
import { Dashboard } from './pages/Dashboard'
import LoadingBlocks from './components/shared/LoadingBlocks'
import './App.css'
import { Header } from './components/Header';

const App: React.FC = () => {
  // Loading state for splash screen
  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)

  // Timer effect for splash screen
  useEffect(() => {
    // Phase 1: Show splash screen for 2 seconds
    const showTimer = setTimeout(() => {
      setIsFading(true); // Start fade-out animation
    }, 2000);
    
    // Phase 2: Remove splash screen after fade-out completes
    const hideTimer = setTimeout(() => {
      setIsLoading(false); // Remove splash screen completely
    }, 4000); // 2s show + 2s fade = 4s total
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="app">
      {/* Header with theme toggle */}
      <Header />
      
      {/* Splash Screen - LoadingBlocks */}
      {isLoading && (
        <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
          <LoadingBlocks />
        </div>
      )}
      
      {/* Main content area */}
      <main className={`main-content ${isFading ? 'loaded' : 'loading'}`}>
        <Dashboard />
      </main>
      
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default App;
