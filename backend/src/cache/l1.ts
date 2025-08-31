/**
 * @fileoverview L1 cache abstraction (in-memory stub), ready to swap with Redis client
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 *
 * @description
 * Minimal cache interface with TTL support. This in-memory implementation is a placeholder
 * to validate integration points and TTL policy. For production, replace with Redis.
 *
 * @state
 * ✅ Functional (in-memory); Redis swap pending
 */

export interface L1Cache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlSeconds: number): void;
  del(key: string): void;
  clear(): void; // Add clear method for test compatibility
  stats(): { size: number; keys: number };
}

type Entry = { value: unknown; expiresAt: number };

export class InMemoryL1Cache implements L1Cache {
  private store = new Map<string, Entry>();

  get<T>(key: string): T | null {
    const e = this.store.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  del(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  stats(): { size: number; keys: number } {
    return { size: this.store.size, keys: this.store.size };
  }
}


