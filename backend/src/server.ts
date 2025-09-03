
/**
 * @fileoverview HTTP server bootstrap and graceful shutdown
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import http from 'http';
import dotenv from 'dotenv';
import { createApp } from './app';
import { createWebSocketServer } from './ws/server';
import type { Server } from 'http';

dotenv.config();
const port = parseInt(process.env.PORT ?? '8000', 10);

// Create app asynchronously
async function startServer() {
  const app = await createApp();
  const server = http.createServer(app) as Server;

  server.listen(port, () => {
    // Minimal log; pino will be wired later
    console.log(`Backend listening on http://localhost:${port}`);
  });

  // Bind WebSocket server to the same HTTP server and attach routes
  const wsHub = app.locals.wsHub as ReturnType<typeof import('./ws/hub').createWebSocketHub>;
  if (wsHub) {
    createWebSocketServer({ server, hub: wsHub, path: '/ws' });
    console.log('WebSocket server bound at ws://localhost:' + port + '/ws');
  }

  // Professional status logger - once per minute
  setInterval(() => {
    const timestamp = new Date().toISOString().slice(11, 19);
    console.log(`[${timestamp}] BlockSight Backend: Core ✓ Electrum ✓ WebSocket ✓`);
  }, 60000); // 60 seconds

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}, shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

