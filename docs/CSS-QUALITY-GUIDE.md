# 🎨 BlockSight.live CSS Quality Guide

/**
 * @fileoverview Comprehensive guide to CSS quality standards and stylelint usage
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * This guide ensures consistent CSS quality across the BlockSight.live frontend
 * by documenting stylelint commands, CSS architecture rules, and quality gates.
 * 
 * @dependencies
 * - stylelint configuration (.stylelintrc.json)
 * - CSS Modules architecture
 * - Design tokens system
 * 
 * @usage
 * Reference before any CSS development or commits
 * 
 * @state
 * ✅ Complete - Comprehensive CSS quality guide
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add CSS performance monitoring
 * - Implement CSS bundle analysis
 * - Add CSS accessibility testing
 * 
 * @performance
 * - Efficient CSS selectors
 * - Minimal CSS bundle size
 * - Optimized CSS animations
 * 
 * @security
 * - CSS injection prevention
 * - Safe CSS custom properties
 * - Sanitized CSS content
 */

---

## 🚀 **Stylelint Commands (MANDATORY)**

### **Project-Wide CSS Quality**
```bash
# Check all CSS files in the project
npm run stylelint

# Fix auto-fixable CSS issues
npm run stylelint:fix
```

### **Frontend-Only CSS Quality**
```bash
# Check only frontend CSS files
npm run stylelint:frontend

# Fix frontend CSS issues
npm run stylelint:frontend:fix
```

### **Manual Stylelint Commands**
```bash
# Check specific files or directories
npx stylelint "frontend/src/**/*.css"
npx stylelint "frontend/src/components/**/*.module.css"

# Fix specific files
npx stylelint "frontend/src/**/*.css" --fix

# Generate detailed report
npx stylelint "frontend/src/**/*.css" --formatter verbose
```

---

## 🎯 **CSS Quality Gates (MANDATORY)**

### **Before Commit Checklist**
- [ ] **Stylelint passes** with no errors
- [ ] **Design tokens used** instead of hardcoded values
- [ ] **BEM naming** followed for complex components
- [ ] **CSS Modules** used for component isolation
- [ ] **Responsive design** implemented
- [ ] **Accessibility** considered (color contrast, focus states)
- [ ] **Performance** optimized (no unused CSS, efficient selectors)

### **Before Merge Checklist**
- [ ] **CSS quality validated** by stylelint
- [ ] **Design system compliance** verified
- [ ] **Responsive behavior** tested across breakpoints
- [ ] **Accessibility standards** met
- [ ] **Performance impact** assessed

---

## 🏗️ **CSS Architecture Rules**

### **Three-Tier CSS Architecture**
1. **CSS Custom Properties** - Global design tokens and theming
2. **CSS Modules** - Component-scoped styles and isolation
3. **Styled Components** - Dynamic styling and complex logic

### **File Organization**
```
frontend/src/styles/
├── tokens/           # Design tokens (colors, spacing, typography)
│   ├── colors.css    # Color palette and theme colors
│   ├── spacing.css   # Spacing scale and layout units
│   ├── typography.css # Font families, sizes, and line heights
│   ├── breakpoints.css # Responsive breakpoints
│   └── animations.css # Animation timing and easing
├── components/       # Component-specific CSS modules
├── layouts/          # Layout and grid systems
├── themes/           # Theme-specific overrides
└── global/           # Global styles and utilities
```

### **Naming Conventions**
- **CSS Modules**: `ComponentName.module.css`
- **Design Tokens**: `kebab-case` for CSS custom properties
- **BEM Methodology**: `block__element--modifier` for complex components
- **Utility Classes**: `u-` prefix for utility classes

---

## 🔧 **Stylelint Configuration**

### **Current Rules (.stylelintrc.json)**
- **Extends**: `stylelint-config-standard`
- **Plugins**: `stylelint-declaration-strict-value`
- **Class Naming**: BEM pattern enforcement
- **Design Tokens**: Strict value checking for colors, spacing, etc.

### **Key Rule Categories**
1. **Selector Patterns**: BEM naming convention enforcement
2. **Declaration Values**: Design token usage requirements
3. **Media Queries**: Responsive design validation
4. **CSS Modules**: Special rules for `.module.css` files

---

## 📱 **Responsive Design Standards**

### **Breakpoint System**
```css
/* Mobile First Approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### **Grid System**
- **CSS Grid** for complex layouts
- **Flexbox** for component alignment
- **CSS Custom Properties** for dynamic spacing

---

## ♿ **Accessibility Standards**

### **Color and Contrast**
- **WCAG 2.1 AA** compliance for color contrast
- **Design tokens** for consistent color usage
- **Theme-aware** color schemes

### **Focus and Interaction**
- **Visible focus indicators** for keyboard navigation
- **Hover and active states** for interactive elements
- **Reduced motion** support for accessibility

---

## ⚡ **Performance Standards**

### **CSS Optimization**
- **Efficient selectors** (avoid deep nesting)
- **CSS Modules** for style isolation
- **Critical CSS** inlining for above-the-fold content

### **Bundle Management**
- **Tree shaking** for unused CSS
- **Code splitting** for route-based CSS
- **CSS purging** in production builds

---

## 🧪 **Testing and Validation**

### **Automated Quality Checks**
```bash
# Run all quality checks
npm run lint && npm run stylelint

# Check specific areas
npm run stylelint:frontend
npm run lint -w frontend
```

### **Manual Testing Checklist**
- [ ] **Cross-browser compatibility** verified
- [ ] **Responsive behavior** tested on multiple devices
- [ ] **Theme switching** works correctly
- [ ] **Accessibility tools** pass validation
- [ ] **Performance metrics** meet targets

---

## 📚 **Resources and References**

### **Documentation**
- **[Frontend Styles Guide](frontend/styles-README.md)** - Detailed styling patterns
- **[Naming Conventions](frontend/naming-conventions.md)** - File and class naming rules
- **[Component Architecture](../project-documents/system-diagrams/02-component-architecture-diagram.md)** - CSS system overview

### **External Resources**
- **Stylelint Documentation**: https://stylelint.io/
- **CSS Modules**: https://github.com/css-modules/css-modules
- **BEM Methodology**: https://en.bem.info/methodology/
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

---

## 🚨 **Troubleshooting**

### **Common Stylelint Issues**
1. **Design Token Violations**: Use CSS custom properties instead of hardcoded values
2. **BEM Naming**: Follow `block__element--modifier` pattern
3. **CSS Module Issues**: Ensure `.module.css` extension for component styles

### **Getting Help**
- Check `.stylelintrc.json` for rule explanations
- Run `npm run stylelint:fix` for auto-fixable issues
- Review this guide for architecture patterns
- Consult the team for complex CSS decisions

---

**Remember**: CSS quality is as important as JavaScript quality. Always run stylelint before committing CSS changes!
