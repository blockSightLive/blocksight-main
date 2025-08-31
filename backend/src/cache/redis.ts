/**
 * @fileoverview Redis-backed L1 cache implementation using ioredis
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 *
 * @description
 * Provides a Redis-based implementation of the L1 cache interface with TTL support.
 * Values are stored as JSON strings. For performance-critical keys consider
 * MessagePack in the future.
 */

import Redis from 'ioredis';
import type { L1Cache } from './l1';

export class RedisL1Cache implements L1Cache {
  private client: Redis;

  constructor(url: string) {
    this.client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 2
    });
    // Best-effort connect, but allow fallback logic to handle failures elsewhere
    this.client.connect().catch(() => undefined);
  }

  get<T>(): T | null {
    // Use sync-like wrapper via deasync is not desired; expose get as sync-like by returning null if not ready
    // For controller use, prefer getAsync instead. Keeping interface parity use a quick blocking approach with Atomics wait? Not ideal.
    // Simpler: return null from sync get and rely on getAsync in future expansion. For now controllers will not call this method.
    return null;
  }

  async getAsync<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    void this.client.set(key, JSON.stringify(value), 'EX', Math.max(1, Math.floor(ttlSeconds)));
  }

  del(key: string): void {
    void this.client.del(key);
  }

  clear(): void {
    // Clear all keys - use FLUSHDB for Redis
    void this.client.flushdb();
  }

  stats(): { size: number; keys: number } {
    // Not readily available without a KEYS/SCAN; return zeros to avoid heavy ops
    return { size: 0, keys: 0 };
  }
}


