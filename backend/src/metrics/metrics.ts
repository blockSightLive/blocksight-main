/**
 * @fileoverview Minimal metrics counters for cache hit/miss and endpoint timings (skeleton)
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 *
 * @description
 * Lightweight in-process counters for observability. Intended to be swapped or wired to
 * Prometheus/OTel exporters later. Avoid heavy operations; no async I/O here.
 */

type CounterMap = Record<string, number>;
const counters: CounterMap = Object.create(null);
const recentMsByEvent: Record<string, number[]> = Object.create(null);

function inc(name: string, value: number = 1): void {
  counters[name] = (counters[name] || 0) + value;
}

function metricName(parts: Array<string | number>): string {
  return parts.join('.');
}

export function recordCacheHit(endpoint: string, key: string): void {
  inc(metricName(['cache', 'hit', endpoint]));
  inc(metricName(['cache', 'hit', endpoint, key]));
}

export function recordCacheMiss(endpoint: string, key: string): void {
  inc(metricName(['cache', 'miss', endpoint]));
  inc(metricName(['cache', 'miss', endpoint, key]));
}

export function recordLatency(endpoint: string, ms: number): void {
  // Basic histogram buckets
  const bucket = ms <= 10 ? 'le_10' : ms <= 50 ? 'le_50' : ms <= 100 ? 'le_100' : ms <= 250 ? 'le_250' : ms <= 500 ? 'le_500' : 'gt_500';
  inc(metricName(['latency', endpoint, bucket]));
}

export function getSnapshot(): Readonly<CounterMap> {
  return Object.freeze({ ...counters });
}

// Convenience helpers for WS metrics
export function recordWsProduced(eventType: string, producedInMs: number): void {
  const bucket = producedInMs <= 5 ? 'le_5' : producedInMs <= 20 ? 'le_20' : producedInMs <= 50 ? 'le_50' : producedInMs <= 100 ? 'le_100' : 'gt_100';
  inc(metricName(['ws', 'produced', eventType, bucket]));
  const key = `ws.produced.${eventType}`;
  const arr = (recentMsByEvent[key] ||= []);
  arr.push(producedInMs);
  if (arr.length > 200) arr.shift();
}

export function recordWsBroadcastDuration(eventType: string, durMs: number, delivered: number): void {
  const bucket = durMs <= 1 ? 'le_1' : durMs <= 5 ? 'le_5' : durMs <= 20 ? 'le_20' : durMs <= 50 ? 'le_50' : durMs <= 100 ? 'le_100' : 'gt_100';
  inc(metricName(['ws', 'broadcast', eventType, bucket]));
  inc(metricName(['ws', 'delivered', eventType]));
  inc(metricName(['ws', 'delivered.count', eventType]), delivered);
  const key = `ws.broadcast.${eventType}`;
  const arr = (recentMsByEvent[key] ||= []);
  arr.push(durMs);
  if (arr.length > 200) arr.shift();
}

export function getRollingP95(): Record<string, number> {
  const out: Record<string, number> = Object.create(null);
  for (const [k, arr] of Object.entries(recentMsByEvent)) {
    if (!arr.length) continue;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.floor(0.95 * (sorted.length - 1));
    out[k] = sorted[idx];
  }
  return out;
}


