/**
 * @fileoverview WebSocket server binding to HTTP server and delegating to Hub
 * @version 1.0.0
 * @since 2025-08-20
 * @state In Development
 */

import { WebSocketServer } from 'ws';
import type { WebSocketHub } from './hub';
import type { Server } from 'http';

export function createWebSocketServer(params: {
  server: Server;
  hub: WebSocketHub;
  path?: string;
}) {
  const { server, hub, path = '/ws' } = params;
  const wss = new WebSocketServer({ server, path });

  wss.on('connection', (ws) => {
    hub.addClient(ws);

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg?.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          return;
        }
        if (msg?.type === 'subscribe' && typeof msg?.eventType === 'string') {
          // @ts-expect-error - filters attached in hub.addClient
          ws.__filters__?.add(msg.eventType);
          return;
        }
        if (msg?.type === 'subscribe' && Array.isArray(msg?.events)) {
          // Support bulk subscription
          // @ts-expect-error - filters attached in hub.addClient
          const setRef = ws.__filters__;
          if (setRef) {
            for (const ev of msg.events) {
              if (typeof ev === 'string') setRef.add(ev);
            }
          }
          return;
        }
        if (msg?.type === 'unsubscribe' && typeof msg?.eventType === 'string') {
          // @ts-expect-error - filters attached in hub.addClient
          ws.__filters__?.delete(msg.eventType);
          return;
        }
      } catch {
        // ignore malformed
      }
    });

    ws.on('close', () => hub.removeClient(ws));
    ws.on('error', () => hub.removeClient(ws));
  });

  // Start hub polling loop when server is ready
  hub.start();

  return wss;
}


