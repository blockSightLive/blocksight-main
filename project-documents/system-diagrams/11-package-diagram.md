# BlockSight.live - Package Diagram

/**
 * @fileoverview Package diagram showing the modular architecture and package structure of BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows the package structure and modular architecture of BlockSight.live,
 * including frontend, backend, and infrastructure packages. It reflects our current
 * implementation status with CoreRpcAdapter, completed frontend, and Vercel staging.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding system package structure and modularity
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS-specific packages when implemented
 * - Update with new packages as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows package organization patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This Package Diagram shows the package structure and modular architecture of BlockSight.live, including frontend, backend, and infrastructure packages. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Package Architecture ✅ **IMPLEMENTED**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PACKAGE ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FRONTEND PACKAGES                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Core App      │    │   Components    │    │   Utilities            │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • App.tsx       │    │ • Header        │    │ • bitcoinValidation    │  │ │
│  │  │ • Dashboard.tsx │    │ • LoadingBlocks │    │ • useWebSocket         │  │ │
│  │  │ • BitcoinContext│    │ • BitcoinPrice  │    │ • useBitcoinAPI        │  │ │
│  │  │ • Routing       │    │ • Search        │    │ • Performance          │  │ │
│  │  │ • Theme Context │    │ • Analytics     │    │   Utilities            │  │ │
│  │  │ • i18n Setup    │    │ • Navigation    │    │ • Validation           │  │ │
│  │  │ • Performance   │    │ • Forms         │    │   Helpers              │  │ │
│  │  │   Features      │    │ • Layout        │    │ • Error Handling       │  │ │
│  │  │ • Error         │    │ • Interactive   │    │ • Type Definitions     │  │ │
│  │  │   Boundaries    │    │ • Responsive    │    │ • Constants            │  │ │
│  │  │ • Splash Screen │    │ • 3D Design     │    │ • Configuration        │  │ │
│  │  │ • Loading       │    │ • Theme         │    │ • Internationalization │  │ │
│  │  │   System        │    │   System        │    │ • Performance          │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        STYLES PACKAGES                                │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐│ │ │
│  │  │  │   CSS Modules   │    │ CSS Custom      │    │ Styled Components   ││ │ │
│  │  │  │                 │    │ Properties      │    │                     ││ │ │
│  │  │  │                 │    │                 │    │                     ││ │ │
│  │  │  │ • Component     │    │ • Theme Tokens  │    │ • Dynamic Styling   ││ │ │
│  │  │  │   Styles        │    │ • Global Vars   │    │ • Theme Integration ││ │ │
│  │  │  │ • Layout        │    │ • Responsive    │    │ • Animations        ││ │ │
│  │  │  │   Styles        │    │   Breakpoints   │    │ • Interactive       ││ │ │
│  │  │  │ • Grid          │    │ • Color Schemes │    │   Elements          ││ │ │
│  │  │  │   Systems       │    │ • Typography    │    │ • Performance       ││ │ │
│  │  │  │ • 3D Container  │    │ • Spacing       │    │   Optimized         ││ │ │
│  │  │  │   Styles        │    │ • Dynamic       │    │ • Responsive        ││ │ │
│  │  │  │ • Responsive    │    │   Values        │    │   Design            ││ │ │
│  │  │  │   Design        │    │ • Theme         │    │ • Mobile            ││ │ │
│  │  │  │ • Mobile        │    │   Switching     │    │   Optimization      ││ │ │
│  │  │  │   Styles        │    │ • CSS Props     │    │ • Accessibility     ││ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘│ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              BACKEND PACKAGES                              │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Adapters      │    │   API Layer     │    │   Infrastructure       │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • CoreRpcAdapter│    │ • Routes        │    │ • Cache Manager        │  │ │
│  │  │ • Electrum      │    │ • Controllers   │    │ • WebSocket Hub        │  │ │
│  │  │   Adapter       │    │ • Middleware    │    │ • Database             │  │ │
│  │  │ • Connection    │    │ • Validation    │    │   Connection           │  │ │
│  │  │   Pool          │    │ • Error         │    │ • Redis Client         │  │ │
│  │  │ • Circuit       │    │   Handling      │    │ • PostgreSQL           │  │ │
│  │  │   Breaker       │    │ • Rate          │    │   Client               │  │ │
│  │  │ • Retry Logic   │    │   Limiting      │    │ • Monitoring           │  │ │
│  │  │ • Health        │    │ • CORS          │    │   Stack                │  │ │
│  │  │   Monitoring    │    │   Support       │    │ • Logging              │  │ │
│  │  │ • Load          │    │ • Authentication│    │   System               │  │ │
│  │  │   Balancing     │    │ • Compression   │    │ • Metrics              │  │ │
│  │  │ • Failover      │    │ • Performance   │    │   Collection           │  │ │
│  │  │   Strategy      │    │   Monitoring    │    │ • Alerting             │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            INFRASTRUCTURE PACKAGES                         │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Deployment    │    │   Monitoring    │    │   Development          │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Vercel        │    │ • Prometheus    │    │ • Docker Compose       │  │ │
│  │  │   Staging       │    │ • Grafana       │    │ • Local Environment    │  │ │
│  │  │ • Build System  │    │ • Alerting      │    │ • Development          │  │ │
│  │  │ • Environment   │    │ • Metrics       │    │   Tools                │  │ │
│  │  │   Variables     │    │   Collection    │    │ • Testing              │  │ │
│  │  │ • Domain        │    │ • Performance   │    │   Framework            │  │ │
│  │  │   Management    │    │   Monitoring    │    │ • Linting              │  │ │
│  │  │ • SSL/TLS       │    │ • Health        │    │   Tools                │  │ │
│  │  │   Security      │    │   Checks        │    │ • Type Checking        │  │ │
│  │  │ • Edge Network  │    │ • Logging       │    │ • Build Tools          │  │ │
│  │  │ • Global CDN    │    │   System        │    │ • Performance          │  │ │
│  │  │ • Auto-deploy   │    │ • Audit Trail   │    │   Profiling            │  │ │
│  │  │ • Analytics     │    │ • Security      │    │ • Bundle Analysis      │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Package Descriptions

### 1. Frontend Packages ✅ **IMPLEMENTED**

#### Core App Package ✅ **IMPLEMENTED**
- **App.tsx**: Main application component with routing and context setup
- **Dashboard.tsx**: Main dashboard component with three-column layout
- **BitcoinContext.tsx**: Global Bitcoin state management and API integration
- **Routing**: Application routing and navigation management
- **Theme Context**: Theme management and switching capabilities
- **i18n Setup**: Internationalization and localization setup
- **Performance Features**: Performance optimization and monitoring
- **Error Boundaries**: Error handling and recovery boundaries
- **Splash Screen**: Application splash screen and loading system
- **Loading System**: Comprehensive loading state management

#### Components Package ✅ **IMPLEMENTED**
- **Header**: Navigation header with theme and language switching
- **LoadingBlocks**: 3D loading animation components
- **BitcoinPrice**: Real-time Bitcoin price display components
- **Search**: Search functionality for blocks, transactions, and addresses
- **Analytics**: Data visualization and analytics components
- **Navigation**: Navigation and menu components
- **Forms**: Form components and input handling
- **Layout**: Layout and grid system components
- **Interactive**: Interactive UI components and animations
- **Responsive**: Responsive design components
- **3D Design**: 3D design system components
- **Theme System**: Theme-aware component system

#### Utilities Package ✅ **IMPLEMENTED**
- **bitcoinValidation**: Bitcoin data validation utilities (pattern recognition only)
- **useWebSocket**: WebSocket hook for real-time data
- **useBitcoinAPI**: Bitcoin API integration hook
- **Performance Utilities**: Performance monitoring and optimization utilities
- **Validation Helpers**: Data validation and type checking helpers
- **Error Handling**: Error handling and recovery utilities
- **Type Definitions**: TypeScript type definitions and interfaces
- **Constants**: Application constants and configuration values
- **Configuration**: Configuration management utilities
- **Internationalization**: i18n utilities and helpers
- **Performance Monitoring**: Performance metrics and monitoring

#### Styles Packages ✅ **IMPLEMENTED**

##### CSS Modules Package ✅ **IMPLEMENTED**
- **Component Styles**: Component-specific CSS modules
- **Layout Styles**: Layout and grid system styles
- **Grid Systems**: CSS Grid and Flexbox implementations
- **3D Container Styles**: 3D design system container styles
- **Responsive Design**: Responsive design styles and breakpoints
- **Mobile Styles**: Mobile-specific styles and optimizations

##### CSS Custom Properties Package ✅ **IMPLEMENTED**
- **Theme Tokens**: Global theme design tokens
- **Global Variables**: CSS custom properties for theming
- **Responsive Breakpoints**: Responsive design breakpoint variables
- **Color Schemes**: Theme color scheme variables
- **Typography**: Typography and font variables
- **Spacing**: Spacing and layout variables
- **Dynamic Values**: Dynamic CSS custom property values
- **Theme Switching**: Theme switching and transition variables
- **CSS Props**: CSS custom property management

##### Styled Components Package ✅ **IMPLEMENTED**
- **Dynamic Styling**: Dynamic styling and theming components
- **Theme Integration**: Theme-aware styled components
- **Animations**: Animation and transition components
- **Interactive Elements**: Interactive UI element components
- **Performance Optimized**: Performance-optimized styled components
- **Responsive Design**: Responsive design styled components
- **Mobile Optimization**: Mobile-optimized styled components
- **Accessibility**: Accessibility-focused styled components

### 2. Backend Packages ✅ **IMPLEMENTED**

#### Adapters Package ✅ **IMPLEMENTED**
- **CoreRpcAdapter**: Direct Bitcoin Core RPC integration
- **Electrum Adapter**: Electrum protocol TCP client adapter
- **Connection Pool**: TCP connection pooling and management
- **Circuit Breaker**: Circuit breaker pattern implementation
- **Retry Logic**: Exponential backoff and retry logic
- **Health Monitoring**: Connection health monitoring
- **Load Balancing**: Connection load balancing strategies
- **Failover Strategy**: Automatic failover and recovery

#### API Layer Package ✅ **IMPLEMENTED**
- **Routes**: `/api/v1/*` RESTful API route definitions with namespaced services
- **Controllers**: API endpoint controllers and handlers for electrum, core, network, and ws services
- **Middleware**: API middleware and request processing
- **Validation**: Request and response validation with Zod schemas
- **Error Handling**: Comprehensive error handling with standardized response formats
- **Rate Limiting**: Request rate limiting and throttling
- **CORS Support**: Cross-origin resource sharing support
- **Authentication**: Authentication and authorization for Core RPC endpoints
- **Compression**: Response compression and optimization
- **Performance Monitoring**: API performance monitoring

#### Infrastructure Package ✅ **IMPLEMENTED**
- **Cache Manager**: Multi-tier caching management
- **WebSocket Hub**: Real-time WebSocket event broadcasting
- **Database Connection**: Database connection management
- **Redis Client**: Redis client and connection management
- **PostgreSQL Client**: PostgreSQL client and connection management
- **Monitoring Stack**: Prometheus, Grafana, and monitoring
- **Logging System**: Structured logging and log management
- **Metrics Collection**: Performance metrics collection
- **Alerting**: Automated alerting and notification system

### 3. Infrastructure Packages ✅ **IMPLEMENTED**

#### Deployment Package ✅ **IMPLEMENTED**
- **Vercel Staging**: Frontend staging deployment
- **Build System**: Vite build system and optimization
- **Environment Variables**: Environment configuration management
- **Domain Management**: Domain and SSL/TLS management
- **SSL/TLS Security**: Security certificate management
- **Edge Network**: Global edge network deployment
- **Global CDN**: Content delivery network optimization
- **Auto-deploy**: Continuous deployment automation
- **Analytics**: Built-in analytics and performance monitoring

#### Monitoring Package ✅ **IMPLEMENTED**
- **Prometheus**: Metrics collection and monitoring
- **Grafana**: Data visualization and dashboards
- **Alerting**: Automated alerting and notification
- **Metrics Collection**: Performance metrics collection
- **Performance Monitoring**: Real-time performance monitoring
- **Health Checks**: System health monitoring
- **Logging System**: Comprehensive logging system
- **Audit Trail**: Security and access audit trail
- **Security Monitoring**: Security event monitoring

#### Development Package ✅ **IMPLEMENTED**
- **Docker Compose**: Local development environment
- **Local Environment**: Local development setup
- **Development Tools**: Development and debugging tools
- **Testing Framework**: Jest testing framework
- **Linting Tools**: ESLint and code quality tools
- **Type Checking**: TypeScript type checking
- **Build Tools**: Webpack and build optimization tools
- **Performance Profiling**: Performance analysis tools
- **Bundle Analysis**: Webpack bundle analysis

## Package Relationships

### Dependencies ✅ **IMPLEMENTED**
1. **Frontend Core** → **Components**: Core app depends on component library
2. **Components** → **Styles**: Components depend on styling packages
3. **Frontend** → **Backend**: Frontend consumes backend APIs
4. **Backend Adapters** → **Infrastructure**: Adapters depend on infrastructure services
5. **Infrastructure** → **Monitoring**: Infrastructure depends on monitoring stack

### Modularity ✅ **IMPLEMENTED**
- **Loose Coupling**: Packages are loosely coupled with clear interfaces
- **High Cohesion**: Related functionality is grouped within packages
- **Clear Boundaries**: Clear package boundaries and responsibilities
- **Dependency Injection**: Dependency injection for package integration
- **Interface Contracts**: Well-defined interfaces between packages

## Current Implementation Status

### ✅ **COMPLETED PACKAGES**
- **Frontend Packages**: Complete React application with all components and utilities
- **Backend Packages**: Complete backend with adapters, API layer, and infrastructure
- **Infrastructure Packages**: Complete deployment, monitoring, and development setup
- **Modularity**: Well-organized package structure with clear dependencies

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Packages**: 3D visualization and rendering packages
- **Enhanced Analytics**: Advanced analytics and reporting packages
- **Mobile Packages**: Mobile-specific package optimizations
- **Performance Packages**: Advanced performance optimization packages

