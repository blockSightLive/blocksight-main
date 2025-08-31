# 🎨 CSS Quality Standards & Architecture

/**
 * @fileoverview Complete CSS quality standards and architecture documentation for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Comprehensive CSS quality standards documentation including architecture, quality gates,
 * styling patterns, design tokens system, 3D design system, and performance optimization for the frontend.
 * 
 * @dependencies
 * - CSS Modules
 * - CSS Custom Properties
 * - Styled Components
 * - Stylelint configuration
 * - Design Tokens System
 * - 3D Design System Extension
 * 
 * @usage
 * Reference for implementing CSS, maintaining quality standards,
 * following established styling patterns, and using the design tokens system across the frontend.
 */

## Overview

This document contains the complete CSS quality standards and architecture for BlockSight.live. It covers CSS Modules, Custom Properties, Styled Components, quality gates, the comprehensive design tokens system, 3D design system extension, and performance optimization.

## 🚀 **DESIGN TOKENS SYSTEM**

### **NEW: 3D Design System Extension**

**We've implemented a comprehensive 3D Design System Extension that transforms BlockSight.live into a world-class 3D design platform!**

### **What's Included:**
- ✅ **3D Transforms & Perspective** - Complete 3D positioning system
- ✅ **ThreeJS Integration** - WebGL properties and performance optimization
- ✅ **Advanced Animation Orchestration** - Staggered, cascading animations
- ✅ **Spatial Layout System** - 3D layout patterns and spatial relationships
- ✅ **Performance Optimization** - Adaptive performance profiles for all devices

### **Design Tokens Architecture**

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
└── performance-optimization.css # 🆕 Performance monitoring and optimization
```

### **Import Strategy**

**For new development (including 3D):**
```css
@import './design-tokens/index.css';
```

**For backward compatibility:**
```css
@import './design-tokens.css';  /* Redirects to index.css */
```

### **Token Categories**

#### **1. Colors (`colors.css`)**
- **Color Palette**: Primary colors (Bitcoin & Cosmic), neutral colors (50-950 scale), semantic colors
- **Theme Variables**: Light theme (default), dark theme, cosmic theme
- **Special Effects**: Glass/translucent surfaces, shadows and glows, alpha-based borders, focus rings

#### **2. Spacing & Layout (`spacing-layout.css`)**
- **Comprehensive Spacing Scale**: 8pt grid system, fractional spacing, negative spacing, viewport-based spacing
- **Layout Dimensions**: Container dimensions with responsive variants, header/footer heights
- **Component-Specific Tokens**: Search bar dimensions, card layouts, button and input sizing

#### **3. Typography (`typography.css`)**
- **Font Families**: Sans-serif (Inter + system fallbacks), monospace (JetBrains Mono), display fonts
- **Font Sizes**: xs: 12px, sm: 14px, base: 16px, lg: 18px, xl: 20px, 2xl: 24px, etc.
- **Font Weights**: thin: 100, light: 300, normal: 400, medium: 500, bold: 700, etc.

#### **4. Borders & Radius (`borders-radius.css`)**
- **Comprehensive Border Radius**: Base values, fractional values, custom values, responsive variants
- **Border Widths**: Base values, fractional values, custom values
- **Alpha-Based Borders**: Primary, accent, and Bitcoin alpha borders (10% to 50%)

#### **5. Animation & Timing (`animation-timing.css`)**
- **Comprehensive Animation Durations**: Micro-animations (50ms-150ms), standard animations (200ms-700ms), macro-animations (800ms-5000ms)
- **Enhanced Easing Functions**: Standard easing, enhanced easing, special easing (bounce, elastic, back, smooth)
- **Comprehensive Transform Values**: Rotation, translate X/Y, scale, skew values
- **Comprehensive Filter Values**: Blur, brightness, contrast, grayscale, hue-rotate, invert, saturate, sepia

#### **6. Sizes & Dimensions (`sizes-dimensions.css`)**
- **Icon Sizes**: Base sizes (xs: 12px to 5xl: 64px), custom sizes
- **Component Heights**: Button heights, input heights, navigation heights
- **Component Widths**: Search bar widths, card widths, container sizes

#### **7. Layout & Grid (`layout-grid.css`)**
- **Grid System**: Grid gaps, grid columns (1-12), grid rows, grid auto values
- **Layout Patterns**: Container layouts, sidebar layouts, card layouts, form layouts, navigation layouts
- **Aspect Ratios**: Standard ratios, custom ratios (golden, silver, bronze, platinum)

### **🆕 8. 3D Design System Extension**

#### **3D Transforms (`3d-transforms.css`)**
- **Perspective System**: 16 levels of depth perception (50px to 2000px)
- **3D Rotation**: Complete X, Y, Z axis control for rotation, translation, and scaling
- **3D Translation**: Precise 3D positioning with depth layers and spatial relationships
- **3D Scale**: Individual axis scaling and 3D scale combinations
- **3D Skew**: Spatial deformation and tilt effects
- **Transform Origin**: 3D rotation center and positioning
- **Backface Visibility**: 3D object visibility control
- **Transform Style**: 3D rendering mode control
- **Composite Transforms**: Pre-built 3D transform combinations

#### **ThreeJS Integration (`threejs-integration.css`)**
- **Performance Tokens**: FPS targets, frame budgets, memory management
- **WebGL Properties**: Anti-aliasing, shadow quality, texture resolution
- **3D Spatial Positioning**: Depth layers, container dimensions, spatial relationships
- **Material Tokens**: Opacity, roughness, metalness, emissive properties
- **Lighting Tokens**: Intensity, distance, decay, ambient light
- **Camera Tokens**: Field of view, near/far planes, perspective settings
- **Animation Tokens**: Loop modes, clamp settings, duration scales
- **Interaction Tokens**: Raycaster thresholds, hover/click distances
- **Responsive 3D**: Device-specific 3D settings and optimization

#### **Advanced Animation Orchestration (`animation-orchestration.css`)**
- **Staggered Animations**: Configurable delays, patterns, and directions
- **Animation Sequences**: Complex timing sequences and coordination
- **Performance-Aware Timing**: FPS-based adaptive timing and monitoring
- **Complex Animation Combinations**: Entrance, exit, hover, click, loading sequences
- **Interactive Animations**: Hover effects, click responses, loading states
- **Notification Animations**: 3D entrance/exit effects with spatial positioning
- **Theme Transitions**: Smooth 3D theme switching with performance optimization
- **Responsive Animations**: Device-specific animation adjustments
- **Performance Profiles**: Low-end to extreme device optimization

#### **Spatial Layout System (`spatial-layout.css`)**
- **Spatial Positioning**: Coordinate system and offset management
- **Depth Layer System**: Z-index layers and 3D depth values
- **Spatial Relationships**: Component positioning and alignment
- **3D Layout Patterns**: Grid, stack, and carousel patterns with perspective
- **Spatial Component Tokens**: 3D card, navigation, and form layouts
- **Responsive Spatial Layouts**: Mobile-first 3D design with device optimization
- **Spatial Utilities**: Positioning, visibility, and interaction utilities
- **Performance Profiles**: Device-specific spatial optimization

#### **Performance Optimization (`performance-optimization.css`)**
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

### **3D Design Examples**

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

/* 3D Card with Hover Effects */
.3d-card {
  transform-style: var(--transform-style-3d);
  perspective: var(--perspective-moderate);
  transform: var(--transform-3d-hover-lift);
}
```

### **Migration Guide**

#### **From Core System to 3D Extension**

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

## Stylelint Commands (MANDATORY)

**Before committing any CSS changes, run these commands:**

```bash
# Check all CSS files in the project
npm run stylelint

# Fix auto-fixable CSS issues
npm run stylelint:fix

# Check only frontend CSS files
npm run stylelint:frontend

# Fix frontend CSS issues
npm run stylelint:frontend:fix
```

## CSS Quality Gates (MANDATORY)

- **No CSS linting errors** before commit
- **Design tokens used** for colors, spacing, typography
- **BEM naming convention** followed for complex components
- **CSS Modules** used for component isolation
- **Responsive design** implemented with CSS Grid/Flexbox

## CSS Architecture Rules

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    STYLED COMPONENTS                        │
│              Interactive elements, animations               │
│              Theme integration, dynamic styling             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                  CSS CUSTOM PROPERTIES                     │
│              Theme tokens, global variables                 │
│              Responsive breakpoints, color schemes          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     CSS MODULES                            │
│              Component isolation, layout                   │
│              Grid systems, 3D containers                   │
└─────────────────────────────────────────────────────────────┘
```

### CSS Modules Layer

**Purpose**: Component isolation, grid systems, 3D containers, layout management

```css
/* Component-specific CSS modules */
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.loading-blocks {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-block {
  width: 40px;
  height: 40px;
  margin: 0 var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  animation: pulse 1.5s ease-in-out infinite;
}
```

### CSS Custom Properties Layer

**Purpose**: Dynamic theming, global design tokens, responsive breakpoints

```css
/* Design tokens in CSS Custom Properties */
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Border radius */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --shadow-md: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  
  /* Breakpoints */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

### Styled Components Layer

**Purpose**: Interactive elements, dynamic styling, animations, theme integration

```typescript
// Styled Components with theme integration
import styled from 'styled-components'

export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.disabled};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const Card = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: box-shadow 0.2s ease-in-out;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`
```

## CSS File Organization

```
frontend/src/styles/
├── tokens/           # Design tokens (colors, spacing, typography)
├── components/       # Component-specific CSS modules
├── layouts/          # Layout and grid systems
├── themes/           # Theme-specific overrides
└── global/           # Global styles and utilities
```

### Design Tokens Structure

```typescript
// frontend/src/styles/tokens/index.ts
export const tokens = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000'
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem'
  },
  
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
}
```

### Theme System Implementation

```typescript
// frontend/src/styles/themes/index.ts
import { tokens } from '../tokens'

export const lightTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    surface: '#ffffff',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    background: '#f8f9fa'
  }
}

export const darkTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    surface: '#212529',
    text: '#f8f9fa',
    textSecondary: '#adb5bd',
    border: '#495057',
    background: '#121212'
  }
}

export const cosmicTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    primary: '#6f42c1',
    secondary: '#e83e8c',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#b8b8b8',
    border: '#16213e',
    background: '#0f0f23'
  }
}
```

## BEM Methodology

### BEM Naming Convention

```css
/* Block: Main component */
.dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}

/* Element: Part of the block */
.dashboard__header {
  grid-column: 1 / -1;
  padding: var(--spacing-lg);
}

.dashboard__sidebar {
  grid-column: 1;
  background-color: var(--color-light);
}

.dashboard__content {
  grid-column: 2;
  padding: var(--spacing-md);
}

.dashboard__widgets {
  grid-column: 3;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Modifier: Variation of the block or element */
.dashboard--compact {
  gap: var(--spacing-sm);
}

.dashboard__header--sticky {
  position: sticky;
  top: 0;
  z-index: 100;
}

.dashboard__widgets--collapsed {
  width: 60px;
  overflow: hidden;
}
```

### BEM Best Practices

```css
/* Good BEM structure */
.block {}
.block__element {}
.block__element--modifier {}

/* Avoid deep nesting */
.block__element__subelement {} /* ❌ Too deep */

/* Use modifiers for variations */
.block--size-large {}
.block--theme-dark {}
.block--state-active {}

/* Use elements for parts */
.block__header {}
.block__body {}
.block__footer {}
```

## Responsive Design

### Mobile-First Approach

```css
/* Base styles (mobile first) */
.container {
  padding: var(--spacing-sm);
  margin: 0 auto;
  max-width: 100%;
}

/* Small devices (tablets) */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
    max-width: 720px;
  }
}

/* Medium devices (desktops) */
@media (min-width: 992px) {
  .container {
    padding: var(--spacing-lg);
    max-width: 960px;
  }
}

/* Large devices (large desktops) */
@media (min-width: 1200px) {
  .container {
    padding: var(--spacing-xl);
    max-width: 1140px;
  }
}
```

### CSS Grid Responsive Layout

```css
.dashboard-grid {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  
  /* Mobile: Single column */
  grid-template-columns: 1fr;
  
  /* Tablet: Two columns */
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  /* Desktop: Three columns */
  @media (min-width: 992px) {
    grid-template-columns: 1fr 2fr 1fr;
  }
}

.dashboard-grid__sidebar {
  /* Mobile: Full width */
  grid-column: 1;
  
  /* Desktop: First column */
  @media (min-width: 992px) {
    grid-column: 1;
  }
}

.dashboard-grid__content {
  /* Mobile: Full width */
  grid-column: 1;
  
  /* Tablet: Second column */
  @media (min-width: 768px) {
    grid-column: 2;
  }
  
  /* Desktop: Middle column */
  @media (min-width: 992px) {
    grid-column: 2;
  }
}

.dashboard-grid__widgets {
  /* Mobile: Full width */
  grid-column: 1;
  
  /* Desktop: Third column */
  @media (min-width: 992px) {
    grid-column: 3;
  }
}
```

## CSS Modules Implementation

### Component-Specific Styles

```css
/* frontend/src/components/Dashboard/Dashboard.module.css */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-lg);
  min-height: 100vh;
  background-color: var(--color-background);
}

.header {
  grid-column: 1 / -1;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.sidebar {
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-md);
}

.content {
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.widgets {
  background-color: var(--color-surface);
  border-left: 1px solid var(--color-border);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
```

### CSS Modules Usage

```typescript
// frontend/src/components/Dashboard/Dashboard.tsx
import React from 'react'
import styles from './Dashboard.module.css'

export const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>BlockSight Dashboard</h1>
      </header>
      
      <aside className={styles.sidebar}>
        <nav>Navigation</nav>
      </aside>
      
      <main className={styles.content}>
        <h2>Main Content</h2>
        <p>Dashboard content goes here</p>
      </main>
      
      <aside className={styles.widgets}>
        <div>Widget 1</div>
        <div>Widget 2</div>
      </aside>
    </div>
  )
}
```

## Performance Optimization

### CSS Optimization Techniques

```css
/* Use efficient selectors */
.component {} /* ✅ Good */
div.component {} /* ❌ Less efficient */

/* Avoid universal selectors */
* {} /* ❌ Very expensive */

/* Use class selectors over tag selectors */
.button {} /* ✅ Good */
button {} /* ❌ Less specific */

/* Minimize specificity conflicts */
.component__element {} /* ✅ Good */
.component .element {} /* ❌ Higher specificity */

/* Use CSS custom properties for dynamic values */
.element {
  color: var(--color-primary);
  padding: var(--spacing-md);
}
```

### Critical CSS

```css
/* Critical CSS for above-the-fold content */
.critical-styles {
  /* Only include styles needed for initial render */
  display: block;
  position: relative;
  width: 100%;
  height: 100vh;
}

/* Defer non-critical styles */
.non-critical-styles {
  /* Styles that can be loaded after initial render */
  animation: fadeIn 0.3s ease-in-out;
}
```

## Accessibility Considerations

### Color Contrast

```css
/* Ensure sufficient color contrast */
.text-primary {
  color: var(--color-primary);
  /* Ensure contrast ratio meets WCAG AA standards */
}

.text-secondary {
  color: var(--color-secondary);
  /* Ensure contrast ratio meets WCAG AA standards */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .element {
    border: 2px solid var(--color-text);
  }
}
```

### Focus States

```css
/* Visible focus indicators */
.button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip link for keyboard navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: var(--color-white);
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

## CSS Quality Checklist

### Before Commit

- [ ] **Stylelint passes** with no errors
- [ ] **Design tokens used** instead of hardcoded values
- [ ] **BEM naming** followed for complex components
- [ ] **CSS Modules** used for component isolation
- [ ] **Responsive design** implemented
- [ ] **Accessibility** considered (color contrast, focus states)
- [ ] **Performance** optimized (no unused CSS, efficient selectors)

### Quality Validation

```bash
# Run stylelint
npm run stylelint

# Check for unused CSS
npm run css:unused

# Validate accessibility
npm run css:accessibility

# Performance audit
npm run css:performance
```

## Best Practices Summary

### Do's:

- ✅ **Always use CSS Modules** for component isolation
- ✅ **Implement design tokens** via CSS Custom Properties
- ✅ **Follow BEM methodology** for complex component hierarchies
- ✅ **Use mobile-first responsive design**
- ✅ **Ensure accessibility compliance** (WCAG 2.1 AA)
- ✅ **Optimize for performance** (efficient selectors, minimal specificity)
- ✅ **Test across different browsers** and devices
- ✅ **Use semantic class names** that describe purpose, not appearance

### Don'ts:

- ❌ **Never use inline styles** - use CSS classes
- ❌ **Avoid !important** - use proper specificity instead
- ❌ **Don't nest selectors too deeply** - keep it shallow
- ❌ **Avoid hardcoded values** - use design tokens
- ❌ **Don't skip responsive design** - always consider mobile
- ❌ **Avoid vendor prefixes** - use autoprefixer instead
- ❌ **Don't ignore accessibility** - test with screen readers

## External References

- **CSS Modules**: https://github.com/css-modules/css-modules
- **BEM Methodology**: https://en.bem.info/methodology/
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **Styled Components**: https://styled-components.com/
- **Stylelint**: https://stylelint.io/
- **CSS Grid**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Flexbox**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout

---

**Last Updated**: 2025-08-30
**Version**: 1.0.0
