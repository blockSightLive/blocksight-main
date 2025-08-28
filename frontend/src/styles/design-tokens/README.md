# Design Tokens System - BlockSight.live

## Overview

This directory contains the comprehensive, modular design tokens system for BlockSight.live. The system is organized by concern to improve maintainability, scalability, and developer experience.

## 🚀 **NEW: 3D Design System Extension**

**We've just implemented a comprehensive 3D Design System Extension that transforms BlockSight.live into a world-class 3D design platform!**

### **What's New:**
- ✅ **3D Transforms & Perspective** - Complete 3D positioning system
- ✅ **ThreeJS Integration** - WebGL properties and performance optimization
- ✅ **Advanced Animation Orchestration** - Staggered, cascading animations
- ✅ **Spatial Layout System** - 3D layout patterns and spatial relationships
- ✅ **Performance Optimization** - Adaptive performance profiles for all devices

### **Learn More:**
📖 **[3D Design System Extension Documentation](./3D_DESIGN_SYSTEM_README.md)** - Complete guide to the new 3D capabilities

---

## Architecture

### Modular Organization

The design tokens are split into logical categories:

```
design-tokens/
├── index.css                    # Central import file
├── colors.css                   # Color palette, themes, shadows, glows
├── spacing-layout.css           # Spacing scale, layout dimensions, breakpoints
├── typography.css               # Font families, sizes, weights, line heights
├── borders-radius.css           # Border widths, radius values, border styles
├── animation-timing.css         # Durations, easing, transforms, opacity, delays
├── sizes-dimensions.css         # Icon sizes, component dimensions
├── layout-grid.css              # Grid system, layout patterns, component layouts
├── 3d-transforms.css            # 🆕 3D transforms, perspective, spatial positioning
├── threejs-integration.css      # 🆕 ThreeJS integration and WebGL optimization
├── animation-orchestration.css  # 🆕 Advanced animation orchestration
├── spatial-layout.css           # 🆕 Spatial positioning and 3D layout patterns
├── performance-optimization.css # 🆕 Performance monitoring and optimization
├── 3D_DESIGN_SYSTEM_README.md  # 🆕 Complete 3D system documentation
└── README.md                    # This documentation
```

### Import Strategy

**For new development (including 3D):**
```css
@import './design-tokens/index.css';
```

**For backward compatibility:**
```css
@import './design-tokens.css';  /* Redirects to index.css */
```

## Token Categories

### 1. Colors (`colors.css`)

**Color Palette:**
- Primary colors (Bitcoin & Cosmic)
- Neutral colors (50-950 scale)
- Semantic colors (success, warning, error, info)
- Visualizer palette (mock-aligned)

**Theme Variables:**
- Light theme (default)
- Dark theme
- Cosmic theme

**Special Effects:**
- Glass/translucent surfaces
- Shadows and glows
- Alpha-based borders
- Focus rings

### 2. Spacing & Layout (`spacing-layout.css`)

**Comprehensive Spacing Scale:**
- 8pt grid system (4px, 8px, 12px, 16px, etc.)
- Fractional spacing (0.5, 1.5, 2.5, 3.5)
- Negative spacing for positioning
- Viewport-based spacing (vw units)
- Percentage-based spacing
- Semantic aliases (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)

**Layout Dimensions:**
- Container dimensions with responsive variants
- Header/footer heights (desktop & mobile)
- Component-specific spacing
- Responsive breakpoints (xs: 0, sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)

**Component-Specific Tokens:**
- Search bar dimensions and spacing
- Card layouts and padding
- Button and input sizing
- Navigation item dimensions

### 3. Typography (`typography.css`)

**Font Families:**
- Sans-serif: Inter + system fallbacks
- Monospace: JetBrains Mono + system fallbacks
- Display: Inter + system fallbacks

**Font Sizes:**
- xs: 12px, sm: 14px, base: 16px, lg: 18px, xl: 20px, 2xl: 24px, etc.

**Font Weights:**
- thin: 100, light: 300, normal: 400, medium: 500, bold: 700, etc.

**Line Heights & Letter Spacing:**
- none: 1, tight: 1.25, normal: 1.5, loose: 2
- tighter: -0.05em, tight: -0.025em, wide: 0.025em, etc.

### 4. Borders & Radius (`borders-radius.css`)

**Comprehensive Border Radius:**
- Base values (none, sm, md, lg, xl, 2xl, 3xl, full)
- Fractional values (0.5, 1.5, 2.5, 3.5)
- Custom values (card, button, input, modal, tooltip)
- Responsive variants (mobile, tablet, desktop)

**Border Widths:**
- Base values (0, 1px, 2px, 4px, 8px)
- Fractional values (0.5px, 1.5px, 2.5px, 3.5px)
- Custom values (thin, normal, thick, extra-thick)

**Border Styles:**
- Standard styles (solid, dashed, dotted, double)
- Enhanced styles (groove, ridge, inset, outset, hidden)

**Alpha-Based Borders:**
- Primary alpha borders (10%, 20%, 30%, 40%, 50%)
- Accent alpha borders (10%, 20%, 30%, 40%, 50%)
- Bitcoin alpha borders (10%, 20%, 30%, 40%, 50%)

**Component-Specific Borders:**
- Search bar borders
- Card borders
- Button borders
- Input borders
- Navigation borders
- Modal borders
- Tooltip borders
- Badge borders
- Avatar borders

**Responsive Border Variations:**
- Mobile border adjustments
- Tablet border adjustments
- Desktop border adjustments

**Special Border Effects:**
- Gradient borders
- Glow borders
- Border utilities

### 5. Animation & Timing (`animation-timing.css`)

**Comprehensive Animation Durations:**
- Micro-animations (50ms, 75ms, 100ms, 125ms, 150ms)
- Standard animations (200ms, 250ms, 300ms, 350ms, 400ms, 500ms, 600ms, 700ms)
- Macro-animations (800ms, 900ms, 1000ms, 1200ms, 1500ms, 2000ms, 2500ms, 3000ms, 4000ms, 5000ms)

**Enhanced Easing Functions:**
- Standard easing (in, out, in-out)
- Enhanced easing (quad, cubic, quart, quint)
- Special easing (bounce, elastic, back, smooth)

**Comprehensive Transform Values:**
- Rotation values (0deg, 1deg, 2deg, 3deg, 5deg, 10deg, 15deg, 20deg, 25deg, 30deg, 35deg, 40deg, 45deg, 50deg, 60deg, 70deg, 80deg, 90deg, 120deg, 180deg)
- Translate X values (0, 1px, 2px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 112px, 128px, 144px, 160px, 192px, 224px, 256px)
- Translate Y values (0, 1px, 2px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 112px, 128px, 144px, 160px, 192px, 224px, 256px)
- Scale values (0, 25%, 50%, 75%, 90%, 95%, 100%, 105%, 110%, 125%, 150%, 175%, 200%, 250%, 300%)
- Skew values (0deg, 1deg, 2deg, 3deg, 5deg, 10deg, 15deg, 20deg, 25deg, 30deg, 45deg)

**Comprehensive Filter Values:**
- Blur values (0, 1px, 2px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 112px, 128px, 144px, 160px, 192px, 224px, 256px)
- Brightness values (0, 25%, 50%, 75%, 90%, 95%, 100%, 105%, 110%, 125%, 150%, 175%, 200%, 250%, 300%)
- Contrast values (0, 25%, 50%, 75%, 90%, 95%, 100%, 105%, 110%, 125%, 150%, 175%, 200%, 250%, 300%)
- Grayscale values (0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%)
- Hue-rotate values (0deg, 15deg, 30deg, 45deg, 60deg, 75deg, 90deg, 105deg, 120deg, 135deg, 150deg, 165deg, 180deg, 195deg, 210deg, 225deg, 240deg, 255deg, 270deg, 285deg, 300deg, 315deg, 330deg, 345deg, 360deg)
- Invert values (0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%)
- Saturate values (0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%, 110%, 120%, 130%, 140%, 150%, 160%, 170%, 180%, 190%, 200%)
- Sepia values (0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%, 100%)

**Comprehensive Opacity Values:**
- Base opacity (0, 5%, 10%, 15%, 20%, 25%, 30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%, 100%)
- Semantic opacity (transparent, ghost, fade, subtle, visible, solid, opaque)

**Animation Delays:**
- Staggered delays (none, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)

**Iteration Counts:**
- Standard counts (1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100)
- Special counts (infinite, reverse, alternate, alternate-reverse)

**Fill Modes:**
- Standard modes (none, forwards, backwards, both)

**Animation Directions:**
- Standard directions (normal, reverse, alternate, alternate-reverse)

**Play States:**
- Standard states (running, paused)

**Transition Properties:**
- Individual properties (all, none, colors, opacity, transform, background, border, box-shadow, outline, text-shadow, filter, backdrop-filter)
- Property combinations (transform-opacity, transform-colors, transform-shadow, transform-filter, colors-opacity, colors-shadow, colors-filter, shadow-opacity, shadow-filter, opacity-filter)

### 6. Sizes & Dimensions (`sizes-dimensions.css`)

**Icon Sizes:**
- Base sizes (xs: 12px, sm: 16px, md: 20px, lg: 24px, xl: 32px, 2xl: 40px, 3xl: 48px, 4xl: 56px, 5xl: 64px)
- Custom sizes (button-icon: 20px, nav-icon: 24px, card-icon: 32px, hero-icon: 64px, feature-icon: 48px, footer-icon: 20px)

**Dot Sizes:**
- Base sizes (xs: 2px, sm: 4px, md: 6px, lg: 8px, xl: 10px, 2xl: 12px, 3xl: 16px, 4xl: 20px, 5xl: 24px)
- Custom sizes (indicator: 8px, bullet: 6px, status: 12px, avatar: 16px)

**Avatar Sizes:**
- Base sizes (xs: 24px, sm: 32px, md: 40px, lg: 48px, xl: 56px, 2xl: 64px, 3xl: 80px, 4xl: 96px, 5xl: 112px)
- Custom sizes (nav-avatar: 32px, card-avatar: 40px, profile-avatar: 80px, comment-avatar: 32px)

**Component Heights:**
- Button heights (xs: 24px, sm: 32px, md: 40px, lg: 48px, xl: 56px, 2xl: 64px)
- Input heights (xs: 24px, sm: 32px, md: 40px, lg: 48px, xl: 56px, 2xl: 64px)
- Navigation heights (mobile: 48px, tablet: 56px, desktop: 64px, wide: 72px)

**Component Widths:**
- Search bar widths (mobile: 100%, tablet: 300px, desktop: 400px, wide: 500px)
- Card widths (mobile: 100%, tablet: 300px, desktop: 350px, wide: 400px)

**Spacing-Based Sizes:**
- Container sizes (xs: 320px, sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px, 3xl: 1920px, 4xl: 2560px, 5xl: 3840px)
- Sidebar sizes (mobile: 0px, tablet: 200px, desktop: 240px, wide: 280px)
- Header sizes (mobile: 48px, tablet: 56px, desktop: 64px, wide: 72px)
- Footer sizes (mobile: 64px, tablet: 80px, desktop: 96px, wide: 112px)

### 7. Layout & Grid (`layout-grid.css`)

**Grid System:**
- Grid gaps (none, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
- Grid columns (1-12)
- Grid rows (1-12)
- Grid auto values (auto, row, column, dense)

**Layout Patterns:**
- Container layouts (container, fluid, narrow, wide)
- Sidebar layouts (left, right, both)
- Card layouts (grid, list, masonry)
- Form layouts (stacked, horizontal, inline)
- Navigation layouts (horizontal, vertical, dropdown)

**Aspect Ratios:**
- Standard ratios (square, video, photo, portrait, mobile)
- Custom ratios (golden, silver, bronze, platinum)

**Component Layouts:**
- Header layouts (desktop, mobile, brand, nav, search)
- Footer layouts (desktop, mobile, brand, links)
- Sidebar layouts (collapsed, nav, footer)
- Main content layouts (narrow, wide, centered)

**Responsive Layouts:**
- Mobile layouts (stacked, tight)
- Tablet layouts (2-column, sidebar, cards)
- Desktop layouts (3-column, 4-column, sidebar, cards)

**Layout Utilities:**
- Display values (block, inline, flex, grid, table)
- Position values (static, relative, absolute, fixed, sticky)
- Overflow values (visible, hidden, scroll, auto, clip)
- Z-index values (auto, 0-50, dropdown, sticky, fixed, modal, popover, tooltip, toast, overlay, max)

**Layout Compositions:**
- Hero layouts (desktop, mobile)
- Section layouts (desktop, mobile, narrow)
- Article layouts (standard, wide)
- Dashboard layouts (desktop, mobile)
- Auth layouts (form, split)

### 🆕 **8. 3D Design System Extension**

**3D Transforms (`3d-transforms.css`):**
- **Perspective System**: 16 levels of depth perception (50px to 2000px)
- **3D Rotation**: Complete X, Y, Z axis control for rotation, translation, and scaling
- **3D Translation**: Precise 3D positioning with depth layers and spatial relationships
- **3D Scale**: Individual axis scaling and 3D scale combinations
- **3D Skew**: Spatial deformation and tilt effects
- **Transform Origin**: 3D rotation center and positioning
- **Backface Visibility**: 3D object visibility control
- **Transform Style**: 3D rendering mode control
- **Composite Transforms**: Pre-built 3D transform combinations

**ThreeJS Integration (`threejs-integration.css`):**
- **Performance Tokens**: FPS targets, frame budgets, memory management
- **WebGL Properties**: Anti-aliasing, shadow quality, texture resolution
- **3D Spatial Positioning**: Depth layers, container dimensions, spatial relationships
- **Material Tokens**: Opacity, roughness, metalness, emissive properties
- **Lighting Tokens**: Intensity, distance, decay, ambient light
- **Camera Tokens**: Field of view, near/far planes, perspective settings
- **Animation Tokens**: Loop modes, clamp settings, duration scales
- **Interaction Tokens**: Raycaster thresholds, hover/click distances
- **Responsive 3D**: Device-specific 3D settings and optimization

**Advanced Animation Orchestration (`animation-orchestration.css`):**
- **Staggered Animations**: Configurable delays, patterns, and directions
- **Animation Sequences**: Complex timing sequences and coordination
- **Performance-Aware Timing**: FPS-based adaptive timing and monitoring
- **Complex Animation Combinations**: Entrance, exit, hover, click, loading sequences
- **Interactive Animations**: Hover effects, click responses, loading states
- **Notification Animations**: 3D entrance/exit effects with spatial positioning
- **Theme Transitions**: Smooth 3D theme switching with performance optimization
- **Responsive Animations**: Device-specific animation adjustments
- **Performance Profiles**: Low-end to extreme device optimization

**Spatial Layout System (`spatial-layout.css`):**
- **Spatial Positioning**: Coordinate system and offset management
- **Depth Layer System**: Z-index layers and 3D depth values
- **Spatial Relationships**: Component positioning and alignment
- **3D Layout Patterns**: Grid, stack, and carousel patterns with perspective
- **Spatial Component Tokens**: 3D card, navigation, and form layouts
- **Responsive Spatial Layouts**: Mobile-first 3D design with device optimization
- **Spatial Utilities**: Positioning, visibility, and interaction utilities
- **Performance Profiles**: Device-specific spatial optimization

**Performance Optimization (`performance-optimization.css`):**
- **Performance Monitoring**: FPS tracking, frame time monitoring, memory management
- **Rendering Quality Profiles**: Low-end to extreme device optimization
- **Memory Management**: Budgets, allocation, and cleanup strategies
- **Rendering Optimization**: Level of detail, occlusion culling, frustum culling
- **Texture Optimization**: Compression, streaming, and mipmap management
- **Geometry Optimization**: Simplification, instancing, and batching
- **Animation Optimization**: Culling, LOD, and blending strategies
- **Lighting Optimization**: Light culling, shadow optimization, ambient occlusion
- **Particle System Optimization**: Limits, culling, and LOD management
- **Post-Processing Optimization**: Quality-based effect management
- **Adaptive Performance**: Dynamic quality adjustment and performance scaling
- **Responsive Performance Profiles**: Mobile to gaming device optimization

## Usage

### Basic Usage

```css
/* Import all design tokens including 3D extension */
@import './design-tokens/index.css';

/* Use existing tokens */
.card {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  background: var(--color-primary-500);
}

/* Use new 3D tokens */
.3d-card {
  transform-style: var(--transform-style-3d);
  perspective: var(--perspective-moderate);
  transform: var(--transform-3d-hover-lift);
}
```

### 3D Design Examples

```css
/* 3D Grid Layout */
.3d-grid {
  @apply var(--layout-3d-grid-3x3);
}

/* Staggered Animation */
.3d-item {
  @apply var(--entrance-3d-cascade);
  --item-index: var(--grid-item-index);
}

/* Performance Profile */
.threejs-container {
  @apply var(--profile-desktop);
}
```

## Best Practices

### 1. **Progressive Enhancement**
- Start with 2D design using core tokens
- Enhance with 3D effects for capable devices
- Use performance profiles for device-specific optimization

### 2. **Performance First**
- Always use appropriate performance profiles
- Monitor FPS and memory usage
- Implement adaptive quality adjustment

### 3. **Mobile-First 3D**
- Design for mobile devices first
- Enhance progressively for larger screens
- Use responsive 3D layouts and animations

### 4. **Accessibility**
- Ensure 3D effects don't interfere with usability
- Provide fallbacks for reduced motion preferences
- Maintain keyboard navigation in 3D interfaces

## Migration Guide

### From Core System to 3D Extension

1. **Import the Extended System**
   ```css
   /* Before: Core system only */
   @import './design-tokens/index.css';
   
   /* After: Includes 3D extension */
   @import './design-tokens/index.css'; /* Now includes 3D tokens */
   ```

2. **Add 3D Capabilities Gradually**
   ```css
   /* Step 1: Add 3D container */
   .card {
     transform-style: var(--transform-style-3d);
     perspective: var(--perspective-subtle);
   }
   
   /* Step 2: Add 3D hover effects */
   .card:hover {
     transform: var(--transform-3d-hover-lift);
   }
   
   /* Step 3: Add 3D animations */
   .card {
     @apply var(--entrance-3d-cascade);
   }
   ```

3. **Optimize for Performance**
   ```css
   /* Apply device-specific performance profiles */
   .container {
     @apply var(--profile-desktop);
   }
   ```

## Maintenance

### Regular Updates
- Monitor performance metrics
- Update performance profiles based on device capabilities
- Optimize 3D effects for new browser features

### Performance Monitoring
- Track FPS across different devices
- Monitor memory usage and cleanup
- Adjust quality settings based on performance data

## Troubleshooting

### Common Issues

1. **3D Effects Not Working**
   - Check browser support for CSS 3D transforms
   - Verify `transform-style: preserve-3d` is set
   - Ensure parent containers have proper perspective

2. **Performance Issues**
   - Apply appropriate performance profiles
   - Reduce 3D complexity for low-end devices
   - Monitor memory usage and implement cleanup

3. **Animation Jank**
   - Use hardware-accelerated properties
   - Implement FPS monitoring
   - Adjust animation complexity based on device capability

## References

### Documentation
- [3D Design System Extension](./3D_DESIGN_SYSTEM_README.md) - Complete 3D system guide
- [Code Standards](../../../docs/code-standard.md) - Development guidelines
- [System Architecture](../../../project-documents/) - System design and architecture

### External Resources
- [ThreeJS Documentation](https://threejs.org/docs/) - ThreeJS framework reference
- [WebGL Best Practices](https://www.khronos.org/webgl/) - WebGL optimization guide
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) - CSS 3D reference

---

**Version:** 1.0.0  
**Last Updated:** 2025-08-23  
**Status:** ✅ Production Ready + 3D Extension  
**Performance:** Enterprise-Grade + 3D Optimization  
**Compatibility:** All Modern Browsers + ThreeJS + 3D CSS
