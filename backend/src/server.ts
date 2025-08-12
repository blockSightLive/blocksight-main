// @ts-nocheck
/**
 * @fileoverview HTTP server bootstrap and graceful shutdown
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import http from 'http';
import { createApp } from './app';

const port = parseInt(process.env.PORT ?? '8000', 10);
const app = createApp();
const server = http.createServer(app);

server.listen(port, () => {
  // Minimal log; pino will be wired later
  console.log(`Backend listening on http://localhost:${port}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

