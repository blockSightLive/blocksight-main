/**
 * @fileoverview CSS Module type declarations for TypeScript
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-27
 * @lastModified 2025-08-27
 * 
 * @description
 * Type definitions for CSS Modules to enable TypeScript compilation
 * without errors when importing .module.css files
 * 
 * @dependencies
 * - TypeScript
 * - CSS Modules
 * 
 * @usage
 * Provides TypeScript support for CSS Module imports
 * 
 * @state
 * ✅ Functional - Complete CSS Module types
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - None currently identified
 * 
 * @performance
 * - No runtime impact
 * - TypeScript compilation only
 * 
 * @security
 * - Type-safe CSS module access
 */

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const content: string;
  export default content;
}
