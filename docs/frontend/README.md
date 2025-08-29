# Frontend Documentation

/**
 * @fileoverview Frontend documentation index for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-29
 * @lastModified 2025-08-29
 * 
 * @description
 * This directory contains all frontend-specific documentation for BlockSight.live,
 * including architecture, styling, and development guidelines.
 * 
 * @dependencies
 * - 00-model-spec.md (system overview)
 * - 01-development-roadmap.md (development strategy)
 * - THREEJS_IMPLEMENTATION_PLAN.md (next phase)
 */

## Overview

The BlockSight.live frontend is a React 18+ application built with TypeScript, Vite, and a comprehensive styling system. It provides real-time Bitcoin blockchain visualization and analytics through a modern, responsive interface.

## Architecture Overview

### **Technology Stack**
- **Framework**: React 18+ with TypeScript
- **Build System**: Vite for fast development and optimized builds
- **Styling**: CSS Modules + CSS Custom Properties + Styled Components
- **State Management**: Redux for Bitcoin data, React Context for UI state
- **Real-time**: WebSocket integration for live blockchain updates
- **3D Graphics**: Three.js with React Three Fiber (planned)

### **Core Components**
- **Dashboard**: Three-column layout (Search, Blockchain Visualizer, Analytics)
- **Real-time Updates**: WebSocket-driven data refresh every 1-2 seconds
- **Theme System**: Light/Dark/Cosmic themes with dynamic switching
- **Internationalization**: EN/ES/HE/PT languages with RTL support
- **Responsive Design**: Mobile-first approach with advanced breakpoints

## Documentation Structure

### **Development Guidelines**
- **[Naming Conventions](naming-conventions.md)** - Frontend standards and API guidelines
- **[Style System](styles-README.md)** - CSS architecture and theming system

### **Architecture Documents**
- **System Diagrams**: See `project-documents/system-diagrams/` for visual architecture
- **Technical Implementation**: See `project-documents/02-technical-implementation.md` for detailed specs

### **Development Resources**
- **Roadmap**: See `project-documents/01-development-roadmap.md` for strategic direction
- **Execution Checklists**: See `project-documents/01-execution-checklists.md` for task tracking
- **ThreeJS Plan**: See `project-documents/THREEJS_IMPLEMENTATION_PLAN.md` for next phase

## Current Status

### **✅ Completed Features**
- **React Application**: Complete dashboard with three-column layout
- **Style System**: CSS Modules + Custom Properties + Styled Components
- **Theme System**: Light/Dark/Cosmic themes with dynamic switching
- **Internationalization**: EN/ES/HE/PT languages with RTL support
- **WebSocket Integration**: Real-time Bitcoin data connectivity ready
- **Component Architecture**: 15+ components with complete styling
- **Performance Features**: Loading animations, splash screen, 3D design system
- **TypeScript**: 0 compilation errors, strict mode compliance

### **🎯 Next Phase Goals**
- **ThreeJS Integration**: 3D blockchain visualization in center column
- **Dashboard Widgets**: Enhanced fee, network, and timeline displays
- **Mobile Optimization**: Mobile-specific UI improvements

## Development Workflow

### **Getting Started**
1. **Setup**: Follow the main project README for development environment setup
2. **Frontend Dev**: `cd frontend && npm run dev` for development server
3. **Build**: `npm run build` for production build
4. **Testing**: `npm test` for unit tests

### **Code Standards**
- Follow naming conventions in `naming-conventions.md`
- Use the established style system architecture
- Maintain TypeScript strict mode compliance
- Follow React best practices and hooks patterns

### **Styling Guidelines**
- Use CSS Modules for component-specific styles
- Leverage CSS Custom Properties for theming
- Use Styled Components for dynamic/interactive elements
- Follow the established design system patterns

## Integration Points

### **Backend Integration**
- **WebSocket Hub**: Real-time blockchain data updates
- **REST API**: Cached data and historical information
- **Electrum Adapter**: Bitcoin blockchain data source

### **External Services**
- **Vercel**: Staging deployment and hosting
- **GitHub Actions**: CI/CD pipeline and testing
- **Bitcoin Core**: Primary blockchain data source

## Performance Considerations

### **Current Performance**
- **Build Time**: Optimized with Vite for fast development
- **Bundle Size**: Tree-shaking and code splitting implemented
- **Runtime**: Efficient React rendering with proper memoization
- **Real-time**: WebSocket updates with 1-2 second refresh rate

### **Optimization Strategies**
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Dynamic imports for non-critical components
- **Caching**: Strategic caching of static assets and data
- **Bundle Analysis**: Regular bundle size monitoring

## Testing Strategy

### **Testing Stack**
- **Unit Tests**: Jest with React Testing Library
- **Component Tests**: Isolated component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing (planned)

### **Test Coverage**
- **Components**: All major components have unit tests
- **Utilities**: Core utility functions are fully tested
- **Redux**: State management logic is tested
- **WebSocket**: Connection and data handling tests

## Deployment

### **Staging Environment**
- **Platform**: Vercel
- **URL**: Configured in project settings
- **Auto-deploy**: Connected to main branch
- **Preview**: Feature branch deployments available

### **Production Readiness**
- **Build Process**: Optimized production builds
- **Performance**: Lighthouse scores monitored
- **Accessibility**: WCAG compliance maintained
- **Security**: Content Security Policy implemented

## Future Development

### **Immediate Next Steps**
1. **ThreeJS Integration**: Follow `THREEJS_IMPLEMENTATION_PLAN.md`
2. **Dashboard Widgets**: Enhanced analytics displays
3. **Mobile Optimization**: Responsive design improvements

### **Long-term Vision**
- **Advanced 3D Visualizations**: Interactive blockchain exploration
- **Real-time Analytics**: Live performance metrics and trends
- **Advanced Search**: Semantic search and pattern recognition
- **Mobile App**: Native mobile application development

---

**For comprehensive system information, see `project-documents/00-model-spec.md` (single source of truth).**

**For development planning, see `project-documents/01-development-roadmap.md` and `project-documents/01-execution-checklists.md`.**
