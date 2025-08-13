/**
 * TEMPORARY TYPE SHIMS
 * These declarations exist to silence TypeScript errors before devDependencies are installed.
 * Remove this file after installing @types/node and other types.
 */

// Node built-in http module placeholder (typed minimally to avoid any)
declare module 'http' {
  interface MinimalServer {
    listen: (port: number, cb?: () => void) => void;
    close: (cb?: () => void) => void;
  }
  const httpModule: {
    createServer: (handler: unknown) => MinimalServer;
  };
  export = httpModule;
}

// Process global placeholder
declare const process: {
  env: Record<string, string | undefined>;
  on: (event: 'SIGINT' | 'SIGTERM', handler: () => void) => void;
  exit: (code?: number) => never;
};

// Local app module placeholder until TS resolves project references
declare module './app' {
  export function createApp(): unknown;
}
declare module '../app' {
  export function createApp(): unknown;
}

