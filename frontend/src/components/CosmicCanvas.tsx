/**
 * @fileoverview High-Quality Static HTML5 Canvas Cosmic Background Component
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-25
 * @lastModified 2025-08-25
 * 
 * @description
 * High-performance cosmic background using native HTML5 Canvas with React hooks.
 * Enhanced to create realistic space representation with dense static star fields,
 * balanced nebula formations, atmospheric cosmic dust, and rich orange/purple
 * gradient layers spreading from the center. High-quality rendering for realism.
 * 
 * @dependencies
 * - HTML5 Canvas API for high-performance rendering
 * - React hooks for state management and lifecycle
 * - Enhanced cosmic algorithms for realistic space simulation
 * 
 * @usage
 * Import and render alongside or instead of CSS-based BackgroundSystem
 * 
 * @state
 * ✅ Enhanced - High-quality static cosmic background with rich gradients
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add WebGL fallback for better performance
 * - [MEDIUM] Implement depth and parallax effects
 * - [LOW] Add interactive cosmic elements
 * 
 * @mockData
 * - Star positions: Generated with realistic clustering algorithms (800 stars high quality)
 * - Nebula shapes: Balanced formations with optimal opacity for visibility
 * - Color palettes: Rich cosmic color schemes with orange/purple gradients
 * 
 * @styling
 * - HTML5 Canvas: Hardware-accelerated rendering
 * - Enhanced algorithms: Realistic cosmic simulation with static elements
 * - Performance optimized: High-quality rendering for realism
 * 
 * @performance
 * - Hardware acceleration via Canvas API
 * - Efficient static rendering with high detail
 * - Minimal animation loops for stability
 * 
 * @security
 * - Safe canvas operations only
 * - No external image loading
 * - Controlled rendering context
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface CosmicCanvasProps {
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high';
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  color: string;
  twinkle: number;
  twinkleSpeed: number;
  velocity: { x: number; y: number };
}

interface Nebula {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  rotation: number;
  scale: number;
  velocity: { x: number; y: number };
  shapePoints: { x: number; y: number }[]; // Added for pre-calculated shape
}

interface CosmicDust {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  velocity: { x: number; y: number };
}

const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ 
  width = window.innerWidth, 
  height = window.innerHeight,
  quality = 'high'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  
  const [dimensions, setDimensions] = useState({ width, height });
  const [stars, setStars] = useState<Star[]>([]);
  const [nebulas, setNebulas] = useState<Nebula[]>([]);
  const [cosmicDust, setCosmicDust] = useState<CosmicDust[]>([]);

  // Generate realistic star field with physics
  const generateStars = useCallback((count: number): Star[] => {
    const newStars: Star[] = [];
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    for (let i = 0; i < count; i++) {
      // Create multiple star clusters for realistic distribution
      const clusterCount = 5;
      const clusterIndex = Math.floor(Math.random() * clusterCount);
      const clusterAngle = (clusterIndex / clusterCount) * Math.PI * 2;
      const clusterRadius = Math.random() * dimensions.width * 0.3;
      
      // Position within cluster with natural spread
      const clusterX = centerX + Math.cos(clusterAngle) * clusterRadius;
      const clusterY = centerY + Math.sin(clusterAngle) * clusterRadius;
      
      // Add random offset within cluster
      const spreadRadius = dimensions.width * 0.1;
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadDistance = Math.random() * spreadRadius;
      
      const x = clusterX + Math.cos(spreadAngle) * spreadDistance;
      const y = clusterY + Math.sin(spreadAngle) * spreadDistance;
      
      // Star properties with more realistic variations
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const clusterFactor = Math.exp(-distanceFromCenter / (dimensions.width * 0.4));
      
      // Size varies from tiny pinpricks to bright stars
      const size = Math.max(0.3, Math.random() * 4 * clusterFactor);
      const brightness = Math.random() * 0.4 + 0.6; // Brighter baseline
      const twinkle = Math.random() * Math.PI * 2;
      const twinkleSpeed = Math.random() * 0.003 + 0.001; // Much slower twinkling
      
      // No movement for static stars
      const velocity = {
        x: 0, // Static stars
        y: 0  // Static stars
      };
      
      // Enhanced color variations based on star type
      const colorVariation = Math.random();
      let color = '#ffffff'; // White (most common)
      if (colorVariation > 0.95) color = '#ff6b6b'; // Rare red giants
      else if (colorVariation > 0.85) color = '#4ecdc4'; // Teal stars
      else if (colorVariation > 0.75) color = '#45b7d1'; // Blue stars
      else if (colorVariation > 0.65) color = '#96ceb4'; // Green stars
      else if (colorVariation > 0.55) color = '#fbbf24'; // Yellow stars
      else if (colorVariation > 0.45) color = '#f59e0b'; // Orange stars
      
      newStars.push({ x, y, size, brightness, color, twinkle, twinkleSpeed, velocity });
    }
    
    // Add additional static stars in the fringes for better coverage
    const fringeStarCount = Math.floor(count * 0.3); // 30% more stars in fringes
    for (let i = 0; i < fringeStarCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = dimensions.width * 0.4 + Math.random() * dimensions.width * 0.3; // Fringe area
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Fringe stars are smaller and more static
      const size = Math.max(0.2, Math.random() * 2);
      const brightness = Math.random() * 0.3 + 0.7; // Consistent brightness
      const twinkle = Math.random() * Math.PI * 2;
      const twinkleSpeed = Math.random() * 0.001 + 0.0005; // Very slow twinkling
      
      // Completely static fringe stars
      const velocity = { x: 0, y: 0 };
      
      // Fringe stars are mostly white with occasional color
      const colorVariation = Math.random();
      let color = '#ffffff'; // White (most common in fringes)
      if (colorVariation > 0.9) color = '#fbbf24'; // Occasional yellow
      else if (colorVariation > 0.8) color = '#f59e0b'; // Occasional orange
      
      newStars.push({ x, y, size, brightness, color, twinkle, twinkleSpeed, velocity });
    }
    
    return newStars;
  }, [dimensions]);

  // Generate organic nebula shapes with movement
  const generateNebulas = useCallback((): Nebula[] => {
    const nebulaCount = quality === 'high' ? 6 : quality === 'medium' ? 4 : 2; // Restored count for realism
    const newNebulas: Nebula[] = [];
    
    for (let i = 0; i < nebulaCount; i++) {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      
      // Balanced sizes for realistic effect
      const baseSize = Math.random() * 120 + 60; // Balanced size for visibility
      const width = baseSize + Math.random() * 60; // Balanced variation
      const height = baseSize * (0.6 + Math.random() * 0.8); // Vary aspect ratio
      
      // Rich cosmic color palette inspired by real nebulae
      const colorTypes = [
        { base: '#8b5cf6', name: 'purple', opacity: 0.12 },     // Purple nebula (balanced opacity)
        { base: '#3b82f6', name: 'blue', opacity: 0.10 },       // Blue nebula (balanced opacity)
        { base: '#14b8a6', name: 'teal', opacity: 0.14 },       // Teal nebula (balanced opacity)
        { base: '#f59e0b', name: 'orange', opacity: 0.11 },     // Orange nebula (balanced opacity)
        { base: '#ef4444', name: 'red', opacity: 0.13 },        // Red nebula (balanced opacity)
        { base: '#10b981', name: 'green', opacity: 0.09 },      // Green nebula (balanced opacity)
        { base: '#ec4899', name: 'pink', opacity: 0.12 },       // Pink nebula (balanced opacity)
        { base: '#6366f1', name: 'indigo', opacity: 0.11 }      // Indigo nebula (balanced opacity)
      ];
      
      const colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      const color = colorType.base;
      const opacity = colorType.opacity + Math.random() * 0.08; // Balanced visibility
      const rotation = Math.random() * Math.PI * 2;
      const scale = Math.random() * 0.3 + 0.8; // Balanced scale variation
      
      // Pre-calculate irregular shape points to avoid render loop artifacts
      const irregularity = 0.1;
      const segments = 12;
      const shapePoints: { x: number; y: number }[] = [];
      
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const radiusX = (width / 2) * (1 + (Math.random() - 0.5) * irregularity);
        const radiusY = (height / 2) * (1 + (Math.random() - 0.5) * irregularity);
        const pointX = Math.cos(angle) * radiusX;
        const pointY = Math.sin(angle) * radiusY;
        shapePoints.push({ x: pointX, y: pointY });
      }
      
      // No movement for static nebulae
      const velocity = {
        x: 0, // Static nebulae
        y: 0  // Static nebulae
      };
      
      newNebulas.push({ 
        x, y, width, height, color, opacity, rotation, scale, velocity, 
        shapePoints // Add pre-calculated shape points
      });
    }
    
    return newNebulas;
  }, [dimensions, quality]);

  // Generate cosmic dust particles
  const generateCosmicDust = useCallback((): CosmicDust[] => {
    const dustCount = quality === 'high' ? 150 : quality === 'medium' ? 100 : 60; // Restored count for depth
    const newDust: CosmicDust[] = [];
    
    for (let i = 0; i < dustCount; i++) {
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      
      // More varied particle sizes for depth
      const sizeVariation = Math.random();
      let size: number;
      if (sizeVariation > 0.8) {
        size = Math.random() * 2.0 + 1.2; // Large particles (foreground) - balanced size
      } else if (sizeVariation > 0.5) {
        size = Math.random() * 1.0 + 0.6; // Medium particles (midground) - balanced size
      } else {
        size = Math.random() * 0.6 + 0.3; // Small particles (background) - balanced size
      }
      
      // Opacity based on size for depth perception
      const opacity = sizeVariation > 0.8 ? 0.5 + Math.random() * 0.25 : // Foreground (balanced)
                     sizeVariation > 0.5 ? 0.35 + Math.random() * 0.25 : // Midground (balanced)
                     0.2 + Math.random() * 0.2; // Background (balanced)
      
      // Rich dust color variations
      const dustColors = [
        '#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', // Gold/Orange
        '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', // Purple
        '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', // Blue
        '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'  // Teal
      ];
      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      
      // No movement for static dust
      const velocity = {
        x: 0, // Static dust
        y: 0  // Static dust
      };
      
      newDust.push({ x, y, size, opacity, color, velocity });
    }
    
    return newDust;
  }, [dimensions, quality]);

  // Animation loop for cosmic movement
  const animate = useCallback((timestamp: number) => {
    if (!timeRef.current) timeRef.current = timestamp;
    const deltaTime = timestamp - timeRef.current;
    timeRef.current = timestamp;

    // Only update star twinkling - everything else is static
    setStars(prevStars => 
      prevStars.map(star => ({
        ...star,
        twinkle: star.twinkle + star.twinkleSpeed * deltaTime
      }))
    );

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Render everything to canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Create deep space background gradient
    const gradient = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, Math.max(dimensions.width, dimensions.height) / 2
    );
    gradient.addColorStop(0, '#0a0a0a');           // Deep black center
    gradient.addColorStop(0.2, '#1a1a2e');         // Dark blue-black
    gradient.addColorStop(0.4, '#16213e');         // Deep blue
    gradient.addColorStop(0.6, '#0f3460');         // Rich blue
    gradient.addColorStop(0.8, '#1e3a8a');         // Lighter blue
    gradient.addColorStop(1, '#1e293b');           // Slate blue edge
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Render nebulas
    nebulas.forEach(nebula => {
      ctx.save();
      ctx.translate(nebula.x, nebula.y);
      ctx.rotate(nebula.rotation);
      ctx.scale(nebula.scale, nebula.scale);
      
      // Create organic nebula gradient with multiple color stops
      const nebulaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(nebula.width, nebula.height) / 2);
      const alpha = Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0');
      const alphaMid = Math.floor(nebula.opacity * 0.7 * 255).toString(16).padStart(2, '0');
      const alphaEdge = Math.floor(nebula.opacity * 0.3 * 255).toString(16).padStart(2, '0');
      
      nebulaGradient.addColorStop(0, `${nebula.color}${alpha}`);
      nebulaGradient.addColorStop(0.3, `${nebula.color}${alphaMid}`);
      nebulaGradient.addColorStop(0.7, `${nebula.color}${alphaEdge}`);
      nebulaGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = nebulaGradient;
      
      // Use pre-calculated shape points to avoid render loop artifacts
      ctx.beginPath();
      if (nebula.shapePoints && nebula.shapePoints.length > 0) {
        ctx.moveTo(nebula.shapePoints[0].x, nebula.shapePoints[0].y);
        for (let i = 1; i < nebula.shapePoints.length; i++) {
          ctx.lineTo(nebula.shapePoints[i].x, nebula.shapePoints[i].y);
        }
      } else {
        // Fallback to simple ellipse if no shape points
        ctx.ellipse(0, 0, nebula.width / 2, nebula.height / 2, 0, 0, Math.PI * 2);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });

    // Render cosmic dust
    cosmicDust.forEach(dust => {
      ctx.save();
      ctx.globalAlpha = dust.opacity;
      ctx.fillStyle = dust.color;
      ctx.beginPath();
      ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render stars with twinkling
    stars.forEach(star => {
      const twinkleFactor = Math.sin(star.twinkle) * 0.3 + 0.7;
      const currentBrightness = star.brightness * twinkleFactor;
      
      ctx.save();
      ctx.globalAlpha = currentBrightness;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * twinkleFactor, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Add central cosmic energy field
    const energyGradient = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.5
    );
    energyGradient.addColorStop(0, 'rgba(139, 92, 246, 0.08)');    // Purple center
    energyGradient.addColorStop(0.3, 'rgba(59, 130, 246, 0.06)');  // Blue mid
    energyGradient.addColorStop(0.6, 'rgba(20, 184, 166, 0.04)');  // Teal outer
    energyGradient.addColorStop(0.8, 'rgba(236, 72, 153, 0.03)');  // Pink edge
    energyGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = energyGradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Add multiple layers of orange gradients from center
    const orangeGradient1 = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.3
    );
    orangeGradient1.addColorStop(0, 'rgba(249, 115, 22, 0.06)');   // Orange center
    orangeGradient1.addColorStop(0.5, 'rgba(251, 146, 60, 0.04)'); // Light orange
    orangeGradient1.addColorStop(1, 'transparent');
    
    ctx.fillStyle = orangeGradient1;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Second orange layer - larger spread
    const orangeGradient2 = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.6
    );
    orangeGradient2.addColorStop(0, 'rgba(245, 158, 11, 0.04)');   // Darker orange center
    orangeGradient2.addColorStop(0.7, 'rgba(251, 146, 60, 0.02)'); // Light orange edge
    orangeGradient2.addColorStop(1, 'transparent');
    
    ctx.fillStyle = orangeGradient2;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Third orange layer - widest spread
    const orangeGradient3 = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.8
    );
    orangeGradient3.addColorStop(0, 'rgba(217, 119, 6, 0.03)');    // Dark orange center
    orangeGradient3.addColorStop(0.8, 'rgba(245, 158, 11, 0.01)'); // Orange edge
    orangeGradient3.addColorStop(1, 'transparent');
    
    ctx.fillStyle = orangeGradient3;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Add purple gradient layers for depth
    const purpleGradient1 = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.4
    );
    purpleGradient1.addColorStop(0, 'rgba(139, 92, 246, 0.05)');   // Purple center
    purpleGradient1.addColorStop(0.6, 'rgba(168, 85, 247, 0.03)'); // Light purple
    purpleGradient1.addColorStop(1, 'transparent');
    
    ctx.fillStyle = purpleGradient1;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Second purple layer - larger spread
    const purpleGradient2 = ctx.createRadialGradient(
      dimensions.width / 2, dimensions.height / 2, 0,
      dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.7
    );
    purpleGradient2.addColorStop(0, 'rgba(124, 58, 237, 0.03)');   // Dark purple center
    purpleGradient2.addColorStop(0.7, 'rgba(139, 92, 246, 0.01)'); // Purple edge
    purpleGradient2.addColorStop(1, 'transparent');
    
    ctx.fillStyle = purpleGradient2;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Add subtle cosmic rays for atmosphere
    const rayCount = 8;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const rayGradient = ctx.createLinearGradient(
        dimensions.width / 2, dimensions.height / 2,
        dimensions.width / 2 + Math.cos(angle) * dimensions.width * 0.6,
        dimensions.height / 2 + Math.sin(angle) * dimensions.height * 0.6
      );
      rayGradient.addColorStop(0, 'rgba(139, 92, 246, 0.02)');
      rayGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.01)');
      rayGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = rayGradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }
  }, [dimensions, stars, nebulas, cosmicDust]);

  // Initialize cosmic elements
  useEffect(() => {
    const starCount = quality === 'high' ? 800 : quality === 'medium' ? 500 : 250; // Increased for realism
    setStars(generateStars(starCount));
    setNebulas(generateNebulas());
    setCosmicDust(generateCosmicDust());
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [generateStars, generateNebulas, generateCosmicDust, animate, quality]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setDimensions({ width: newWidth, height: newHeight });
      
      // Regenerate cosmic elements for new dimensions
      const starCount = quality === 'high' ? 500 : quality === 'medium' ? 300 : 150;
      setStars(generateStars(starCount));
      setNebulas(generateNebulas());
      setCosmicDust(generateCosmicDust());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generateStars, generateNebulas, generateCosmicDust, quality]);

  // Render canvas on every frame
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -9999,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
};

export default CosmicCanvas;
