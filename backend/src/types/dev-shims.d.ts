/**
 * TEMPORARY TYPE SHIMS
 * These declarations exist to silence TypeScript errors before devDependencies are installed.
 * Remove this file after installing @types/node and other types.
 */

// Node built-in http module placeholder
declare module 'http' {
  const anyHttp: any;
  export = anyHttp;
}

// Process global placeholder
declare const process: any;

// Local app module placeholder until TS resolves project references
declare module './app' {
  export function createApp(): any;
}
declare module '../app' {
  export function createApp(): any;
}

