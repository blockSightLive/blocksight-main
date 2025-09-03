/**
 * @fileoverview Pure CSS Cosmic Background Component - NO JAVASCRIPT
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-25
 * @lastModified 2025-08-31
 * 
 * @description
 * Pure CSS cosmic background with NO JavaScript, NO useEffect, NO state.
 * Completely immune to infinite loops and React.StrictMode issues.
 * 
 * @dependencies
 * - Pure CSS only - NO JavaScript hooks
 * - CSS custom properties for theming
 * 
 * @usage
 * Import and render alongside or instead of CSS-based BackgroundSystem
 * 
 * @state
 * ✅ Completely Stable - Pure CSS, no JavaScript, no re-renders
 * 
 * @bugs
 * - None - pure CSS cannot have infinite loops
 * 
 * @performance
 * - CSS-only rendering, no JavaScript execution
 * - No useEffect calls, no state updates
 * - Completely immune to React issues
 */

import React from 'react';
import './CosmicCanvas.css';

interface CosmicCanvasProps {
  quality?: 'low' | 'medium' | 'high';
}

const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ 
  quality = 'high'
}) => {
  // CRITICAL: Pure CSS component with NO JavaScript logic
  return (
    <div className={`cosmic-background cosmic-quality-${quality}`}>
      {/* Pure CSS stars - no JavaScript */}
      <div className="cosmic-stars"></div>
      <div className="cosmic-nebula"></div>
      <div className="cosmic-dust"></div>
      <div className="cosmic-gradients"></div>
    </div>
  );
};

export default CosmicCanvas;
