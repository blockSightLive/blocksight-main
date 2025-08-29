# BlockSight.live - Documentation Navigation Guide

/**
 * @fileoverview Comprehensive guide to all documentation files in the BlockSight.live codebase
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-29
 * @lastModified 2025-08-29
 * 
 * @description
 * This guide provides a complete overview of all markdown documentation files in the codebase,
 * explaining their purpose, responsibilities, and how they relate to each other.
 * 
 * @dependencies
 * - All documentation files in the codebase
 * 
 * @usage
 * Reference for developers to understand and navigate the documentation structure
 */

## Overview

This guide provides a comprehensive overview of all markdown documentation files in the BlockSight.live codebase, organized by purpose and responsibility. Use this guide to understand what each document covers and how to find the information you need.

## Core Project Documentation

### **00-model-spec.md** - Single Source of Truth
- **Location**: `project-documents/`
- **Purpose**: Core system requirements and architecture overview
- **Responsibility**: Defines the entire system, current implementation status, and strategic direction
- **When to Use**: Start here for any system-level understanding
- **Status**: ✅ **CURRENT** - Single source of truth for the entire system

### **01-development-roadmap.md** - Strategic Development Plan
- **Location**: `project-documents/`
- **Purpose**: High-level development roadmap and strategic planning
- **Responsibility**: Outlines development phases, current state, and next steps
- **When to Use**: Planning development work, understanding project direction
- **Status**: ✅ **CURRENT** - Aligned with model spec

### **01-execution-checklists.md** - Phase-by-Phase Execution
- **Location**: `project-documents/`
- **Purpose**: Detailed, actionable checklists for each development phase
- **Responsibility**: Operationalizes the roadmap with specific tasks and completion tracking
- **When to Use**: Day-to-day development work, tracking progress
- **Status**: ✅ **CURRENT** - Aligned with model spec

### **02-technical-implementation.md** - Technical Architecture Details
- **Location**: `project-documents/`
- **Purpose**: Detailed technical implementation specifications
- **Responsibility**: Comprehensive technical architecture, design decisions, and implementation status
- **When to Use**: Technical implementation, architecture decisions, system design
- **Status**: ✅ **CURRENT** - Fully updated and aligned

## Implementation Plans

### **THREEJS_IMPLEMENTATION_PLAN.md** - Next Development Focus
- **Location**: `project-documents/`
- **Purpose**: Detailed roadmap for ThreeJS 3D blockchain visualization
- **Responsibility**: Step-by-step implementation plan for the next major feature
- **When to Use**: ThreeJS development, 3D visualization planning
- **Status**: ✅ **CURRENT** - Ready for implementation

### **ADAPTER_IMPLEMENTATION_STATUS.md** - Backend Adapter Status
- **Location**: `backend/src/adapters/`
- **Purpose**: Tracks implementation status of blockchain data adapters
- **Responsibility**: Current state of Core RPC and Electrum adapters
- **When to Use**: Backend development, adapter integration
- **Status**: ✅ **CURRENT** - Tracks adapter development

### **ELECTRUM_DEVELOPMENT_TODO.md** - Electrum Adapter Tasks
- **Location**: `backend/src/adapters/electrum/`
- **Purpose**: Detailed TODO list for Electrum adapter development
- **Responsibility**: Specific tasks for improving the Electrum adapter
- **When to Use**: Electrum adapter development, backend tasks
- **Status**: ✅ **CURRENT** - Active development tasks

## System Architecture Diagrams

### **01-system-context-diagram.md** - System Boundaries
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Shows BlockSight.live as central system with external entities
- **Responsibility**: System context, external integrations, data sources
- **When to Use**: Understanding system boundaries and external relationships
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **02-component-architecture-diagram.md** - Internal Structure
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Internal component relationships and architecture
- **Responsibility**: Component interactions, frontend/backend structure
- **When to Use**: Understanding internal architecture and component relationships
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **03-data-flow-diagram.md** - Data Movement Patterns
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: How data moves through the system
- **Responsibility**: Data flow patterns, caching strategies, real-time streaming
- **When to Use**: Understanding data movement and processing
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **04-sequence-diagrams.md** - System Interactions
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Key system interaction patterns and timing
- **Responsibility**: User interactions, real-time data flow, system operations
- **When to Use**: Understanding system interaction patterns and timing
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **05-class-diagrams.md** - Object-Oriented Structure
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Object-oriented architecture and class relationships
- **Responsibility**: Frontend components, backend adapters, infrastructure classes
- **When to Use**: Understanding object relationships and class structure
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **06-deployment-diagram.md** - Infrastructure & Deployment
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Deployment architecture and infrastructure
- **Responsibility**: Vercel staging, local development, CI/CD pipeline
- **When to Use**: Deployment, infrastructure, environment setup
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **07-activity-tip-and-mempool.md** - Monitoring Workflows
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Bitcoin tip height and mempool monitoring workflows
- **Responsibility**: Real-time monitoring, caching strategies, WebSocket broadcasting
- **When to Use**: Understanding monitoring and real-time data workflows
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **08-state-circuit-breaker.md** - Failure Handling
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Circuit breaker pattern for failure handling and recovery
- **Responsibility**: Failure scenarios, state transitions, recovery strategies
- **When to Use**: Understanding failure handling and system reliability
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **09-component-electrum-adapter.md** - Electrum Adapter Architecture
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Electrum adapter component architecture
- **Responsibility**: TCP client, connection management, data transformation
- **When to Use**: Understanding Electrum adapter implementation
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **10-use-case-diagram.md** - User Interactions
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Primary use cases and user interactions
- **Responsibility**: Real-time monitoring, data visualization, search functionality
- **When to Use**: Understanding user interactions and system use cases
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

### **11-package-diagram.md** - Modular Architecture
- **Location**: `project-documents/system-diagrams/`
- **Purpose**: Package structure and modular architecture
- **Responsibility**: Frontend, backend, and infrastructure packages
- **When to Use**: Understanding system modularity and package organization
- **Status**: ✅ **CURRENT** - Updated to reflect implementation status

## Frontend Documentation

### **naming-conventions.md** - Frontend Standards
- **Location**: `frontend/src/constants/`
- **Purpose**: Naming conventions and API standards for frontend
- **Responsibility**: Consistency guidelines, API standards, frontend conventions
- **When to Use**: Frontend development, maintaining consistency
- **Status**: ⚠️ **NEEDS MOVING** - Should be in docs/frontend/

### **styles/README.md** - Style System Guide
- **Location**: `frontend/src/styles/`
- **Purpose**: BlockSight.live style system documentation
- **Responsibility**: CSS architecture, theme system, styling guidelines
- **When to Use**: Frontend styling, theme development, CSS architecture
- **Status**: ⚠️ **NEEDS MOVING** - Should be in docs/frontend/

## Development & Infrastructure

### **README.md** - Project Overview
- **Location**: Root directory
- **Purpose**: Main project overview and entry point
- **Responsibility**: Project introduction, quick start, high-level overview
- **When to Use**: First contact with the project, understanding what it does
- **Status**: ✅ **CURRENT** - Main project entry point

### **docs/README.md** - Developer Docs Index
- **Location**: `docs/`
- **Purpose**: Entry point for developer documentation
- **Responsibility**: Documentation navigation, developer onboarding
- **When to Use**: Finding developer documentation, understanding doc structure
- **Status**: ✅ **CURRENT** - Developer documentation index

### **docs/adr/README.md** - Architecture Decision Records
- **Location**: `docs/adr/`
- **Purpose**: Index of architecture decision records
- **Responsibility**: Key architectural decisions, design rationale
- **When to Use**: Understanding architectural decisions, design history
- **Status**: ✅ **CURRENT** - ADR index

### **docs/infrastructure/README.md** - Infrastructure Overview
- **Location**: `docs/infrastructure/`
- **Purpose**: Infrastructure and deployment overview
- **Responsibility**: Infrastructure setup, deployment guides, environment management
- **When to Use**: Infrastructure setup, deployment, environment management
- **Status**: ⚠️ **NEEDS CONTENT** - Mostly placeholder content

## Future Planning & Additional

### **FUTURE-PLANNING-CONSOLIDATED.md** - Future Planning & Advanced Features
- **Location**: `project-documents/`
- **Purpose**: Comprehensive roadmap for advanced features, analytics, and data collection
- **Responsibility**: Future planning, advanced features, data collection strategies
- **When to Use**: Future planning, advanced feature implementation, roadmap discussions
- **Status**: ✅ **CURRENT** - Consolidated from separate future planning documents

## Documentation Standards

### **code-standard.md** - Documentation Standards
- **Location**: `docs/`
- **Purpose**: Documentation standards and guidelines
- **Responsibility**: File headers, documentation style, version management
- **When to Use**: Writing documentation, maintaining consistency
- **Status**: ✅ **CURRENT** - Documentation standards

## How to Use This Guide

### **For New Developers**
1. Start with `README.md` for project overview
2. Read `00-model-spec.md` for system understanding
3. Check `01-development-roadmap.md` for current state
4. Use `01-execution-checklists.md` for development tasks

### **For Frontend Development**
1. Check `frontend/src/styles/README.md` for styling
2. Review `docs/frontend/naming-conventions.md` for standards
3. Use system diagrams for architecture understanding

### **For Backend Development**
1. Check `ADAPTER_IMPLEMENTATION_STATUS.md` for adapter status
2. Review `ELECTRUM_DEVELOPMENT_TODO.md` for tasks
3. Use system diagrams for architecture understanding

### **For Architecture Decisions**
1. Check `docs/adr/` for decision records
2. Review `02-technical-implementation.md` for technical details
3. Use system diagrams for visual understanding

### **For Project Planning**
1. Review `01-development-roadmap.md` for strategic direction
2. Check `01-execution-checklists.md` for current tasks
3. Review `THREEJS_IMPLEMENTATION_PLAN.md` for next phase

## Maintenance Notes

- **Last Updated**: 2025-08-29
- **Status**: All core documentation is current and aligned
- **Next Review**: After ThreeJS implementation phase
- **Priority Updates**: ✅ **COMPLETED** - Documentation consolidation, organization, and cleanup completed
- **Cleanup Actions**: Removed 6 redundant/specific setup files, consolidated installation info

## Quick Reference

| Document Type | Primary Files | Purpose |
|---------------|---------------|---------|
| **System Overview** | `00-model-spec.md` | Single source of truth |
| **Development Planning** | `01-development-roadmap.md`, `01-execution-checklists.md` | Strategic and tactical planning |
| **Technical Details** | `02-technical-implementation.md` | Comprehensive technical specs |
| **Implementation Plans** | `THREEJS_IMPLEMENTATION_PLAN.md`, `FUTURE-PLANNING-CONSOLIDATED.md` | Next phase roadmap and future planning |
| **Architecture Diagrams** | `system-diagrams/*.md` | Visual architecture representation |
| **Backend Status** | `ADAPTER_IMPLEMENTATION_STATUS.md`, `ELECTRUM_DEVELOPMENT_TODO.md` | Backend development tracking |
| **Frontend Guides** | `naming-conventions.md`, `styles/README.md` | Frontend development standards |
| **Project Entry** | `README.md`, `docs/README.md` | Project introduction and navigation |
