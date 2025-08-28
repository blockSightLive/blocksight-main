# 🎨 BlockSight.live Style System

## Overview

The BlockSight.live style system is a comprehensive, modular CSS architecture that provides consistent design tokens, responsive layouts, and theme management. This system follows modern CSS best practices and ensures maintainable, scalable styling across the entire application.

## 🏗️ Architecture

### **File Structure**
```
frontend/src/styles/
├── README.md                    # This documentation
├── index.css                    # Main CSS entry point
├── globals.css                  # Global utilities and overrides
├── base/                        # Foundation styles
│   ├── reset.css               # CSS reset and normalization
│   ├── typography.css          # Basic typography foundation
│   └── typography-system.css   # Complete typography system
├── design-tokens/               # CSS custom properties
│   ├── index.css               # Central import for all tokens
│   ├── colors.css              # Color palette and theme variables
│   ├── spacing-layout.css      # Spacing and layout dimensions
│   ├── typography.css          # Typography design tokens
│   ├── borders-radius.css      # Border and radius tokens
│   ├── animation-timing.css    # Animation and timing tokens
│   ├── sizes-dimensions.css    # Component sizes and dimensions
│   ├── layout-grid.css         # Grid system and layout tokens
│   ├── 3d-transforms.css       # 3D transform tokens
│   ├── threejs-integration.css # ThreeJS integration tokens
│   ├── animation-orchestration.css # Animation orchestration tokens
│   ├── spatial-layout.css      # Spatial positioning tokens
│   └── performance-optimization.css # Performance optimization tokens
└── themes/                      # Theme variations
    ├── light.css               # Light theme colors and styles
    └── dark.css                # Dark theme colors and styles
```

### **Import Order (Critical for Cascade)**
1. **Base Styles** - Foundation and resets
2. **Design Tokens** - CSS custom properties and variables
3. **Typography** - Font foundation and complete system
4. **Themes** - Light and dark theme variations
5. **Global Styles** - Utility classes and overrides

## 🚨 CRITICAL WARNING

**NEVER USE UNDEFINED CSS VARIABLES!** 
- ❌ `var(--color-surface)` - This variable doesn't exist!
- ❌ `var(--color-card)` - This variable doesn't exist!
- ✅ `var(--color-grey-light)` - This exists in colors.css
- ✅ `var(--color-grey-deep)` - This exists in colors.css

**Always use hardcoded colors from `colors.css` or define your own variables.**

## 🎯 Core Principles

### **Design Token System**
- **Centralized Variables**: All design values defined in `design-tokens/`
- **Semantic Naming**: Descriptive names like `--color-primary-500`, `--spacing-md`
- **Theme Integration**: Variables automatically adapt to light/dark themes
- **Responsive Design**: Mobile-first approach with breakpoint tokens

### **Theme Management**
- **Hardcoded Colors**: Use actual color values from `colors.css` (e.g., `var(--color-grey-light)`)
- **Theme Overrides**: Use `html[data-theme="dark"]` selectors for dark theme variations
- **No Phantom Variables**: Never use undefined variables like `var(--color-surface)`
- **Component Integration**: Components explicitly define both light and dark theme styles

### **CSS Architecture**
- **CSS Modules**: Component-scoped styling for complex layouts
- **CSS Custom Properties**: Global design tokens and theme variables
- **Utility Classes**: Common patterns and responsive helpers
- **Performance Optimized**: Hardware acceleration and efficient selectors

## 🚀 Usage

### **Basic Theme Switching**
```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="my-component">
      <button onClick={toggleTheme}>
        Current Theme: {theme}
      </button>
    </div>
  );
}
```

### **Using Design Tokens**
```css
.my-component {
  /* Colors - Use hardcoded values from colors.css */
  color: var(--color-text-primary);
  background: var(--color-grey-light); /* Light theme: #F5F5F5 */
  border: var(--border-width-md) solid var(--color-border);
  
  /* Spacing */
  padding: var(--spacing-6);
  margin: var(--spacing-4);
  
  /* Typography */
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  
  /* Layout */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* Dark theme override */
[data-theme="dark"] .my-component {
  background: var(--color-grey-deep); /* Dark theme: #0A0A0A */
}
```

### **Responsive Design**
```css
.my-component {
  /* Mobile first */
  padding: var(--spacing-4);
  
  /* Tablet and up */
  @media (min-width: var(--breakpoint-md)) {
    padding: var(--spacing-6);
  }
  
  /* Desktop and up */
  @media (min-width: var(--breakpoint-lg)) {
    padding: var(--spacing-8);
  }
}
```

## 🎨 Design Tokens

### **Color System**
- **Primary Colors**: Bitcoin orange and brand colors
- **Neutral Palette**: Grayscale for text, backgrounds, and borders
- **Semantic Colors**: Success, warning, error, and info states
- **Theme Variables**: Automatic light/dark theme adaptation

### **Spacing System**
- **Base Scale**: 4px increments (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96)
- **Semantic Aliases**: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- **Component Spacing**: Specific spacing for common UI patterns

### **Typography System**
- **Font Families**: Sans-serif, serif, monospace, and display fonts
- **Font Sizes**: Comprehensive scale from xs to 6xl
- **Font Weights**: Light, normal, medium, semibold, bold, extrabold
- **Line Heights**: Tight, normal, relaxed for different content types

### **Layout System**
- **Grid System**: 12-column responsive grid with breakpoints
- **Container Sizes**: Max-widths for different screen sizes
- **Component Layouts**: Common layout patterns and utilities
- **Responsive Breakpoints**: Mobile, tablet, and desktop breakpoints

## 🔧 Development

### **Adding New Design Tokens**
1. **Choose Category**: Add to appropriate file in `design-tokens/`
2. **Follow Naming**: Use semantic, descriptive names
3. **Document**: Add to this README if it's a new category
4. **Test**: Verify theme integration and responsive behavior

### **Creating New Themes**
1. **Extend Base**: Build on existing design token foundation
2. **Override Variables**: Use `[data-theme="new-theme"]` selector
3. **Maintain Consistency**: Follow established color and spacing patterns
4. **Test Integration**: Verify all components respond correctly

### **Component Styling**
1. **CSS Modules**: Use for component-specific layouts and grids
2. **Design Tokens**: Use variables for colors, spacing, and typography
3. **Theme Awareness**: Ensure components work in all themes
4. **Responsive Design**: Mobile-first approach with progressive enhancement

## 📱 Responsive Design

### **Breakpoint System**
- **Mobile**: `< 768px` - Optimized for touch and small screens
- **Tablet**: `768px - 1024px` - Balanced performance and features
- **Desktop**: `> 1024px` - Full feature set and enhanced visuals

### **Mobile-First Approach**
- **Base Styles**: Mobile-optimized defaults
- **Progressive Enhancement**: Add complexity for larger screens
- **Touch Optimization**: Appropriate sizing and spacing for mobile
- **Performance**: Optimized for mobile devices

## ♿ Accessibility

### **WCAG 2.1 AA Compliance**
- **Color Contrast**: Meets minimum contrast requirements
- **Focus Management**: Clear focus indicators and keyboard navigation
- **Reduced Motion**: Respects user motion preferences
- **High Contrast**: Enhanced visibility options

### **Screen Reader Support**
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for interactive elements
- **Focus Order**: Logical tab order and focus management
- **Alternative Text**: Descriptive text for visual elements

## ⚡ Performance

### **CSS Optimization**
- **Efficient Selectors**: Minimal specificity and complexity
- **Hardware Acceleration**: GPU-accelerated properties where appropriate
- **Minimal Repaints**: Efficient layout and rendering
- **Bundle Size**: Optimized CSS with no unused styles

### **Rendering Performance**
- **CSS Variables**: Efficient theme switching without repaints
- **Hardware Acceleration**: Transform and opacity for smooth animations
- **Reduced Motion**: Performance-optimized animations
- **Efficient Animations**: CSS transforms and opacity changes

## 🔍 Troubleshooting

### **Common Issues**

1. **Theme Not Switching**
   - Check `data-theme` attribute on root element
   - Verify theme CSS files are imported
   - Check for CSS specificity conflicts

2. **Design Tokens Not Working**
   - Verify import order in `index.css`
   - Check for typos in variable names
   - Ensure CSS custom properties are supported

3. **Responsive Issues**
   - Check breakpoint values
   - Verify mobile-first approach
   - Test on actual devices

### **Debug Mode**
```css
/* Add to CSS for debugging */
* {
  outline: 1px solid red;
}

/* Check theme variables */
body::before {
  content: 'Theme: ' attr(data-theme);
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  padding: 4px;
  z-index: 9999;
}
```

## 📚 Resources

### **CSS Best Practices**
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

### **Design Systems**
- [Material Design](https://material.io/design)
- [Ant Design](https://ant.design/docs/spec/introduce)
- [Chakra UI](https://chakra-ui.com/getting-started)

### **Performance Tools**
- [CSS Performance](https://developer.mozilla.org/en-US/docs/Learn/Performance/CSS)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

**Created:** 2025-08-23  
**Last Updated:** 2025-08-23  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
