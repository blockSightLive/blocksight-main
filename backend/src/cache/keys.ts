/**
 * @fileoverview Centralized cache key helpers (L1)
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 *
 * @description
 * Provides stable cache key builders with explicit versioning and namespacing.
 */

const NS = 'l1';

/**
 * Construct a namespaced cache key with a version tag.
 */
export function key(parts: Array<string | number>): string {
  return [NS, ...parts].join(':');
}

// Specific helpers (bump version when payload shape changes)
export const keys = {
  feesEstimates: () => key(['fees', 'estimates', 'v1']),
  mempoolSummary: () => key(['mempool', 'summary', 'v1']),
  tipHeight: () => key(['network', 'height', 'v1']),
  bootstrap: () => key(['bootstrap', 'v1']),
  // Core-specific keys
  coreTipHeight: () => key(['core', 'height', 'v1']),
  coreMempoolSummary: () => key(['core', 'mempool', 'summary', 'v1']),
  priceCurrent: (fiat: string) => key(['price', String(fiat).toLowerCase(), 'v1']),
  fxRates: (base: string) => key(['fx', String(base).toLowerCase(), 'v1']),
  blockByHeight: (height: number) => key(['block', height, 'v1']),
  txById: (txid: string) => key(['tx', txid, 'v1']),
  addressSummary: (address: string) => key(['address', address, 'summary', 'v1'])
} as const;


