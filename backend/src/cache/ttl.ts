/**
 * @fileoverview Confirmation-aware TTL policy helpers for L1 cache (skeleton)
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-22
 * @lastModified 2025-08-22
 *
 * @description
 * Provides functions to compute TTLs for different cached entities based on
 * confirmation depth or freshness requirements. This is a skeleton policy; values
 * are conservative defaults and can be tuned.
 *
 * @state
 * ✅ Functional (policy only); integration with Redis pending
 */

export type CacheEntity = 'block' | 'transaction' | 'addressSummary' | 'mempoolSummary' | 'feeEstimates';

/**
 * Compute TTL in seconds for block-like data based on confirmation depth.
 * Defaults:
 *  - 0 conf: 2s (volatile)
 *  - 1–5 conf: 30s
 *  - 6–100 conf: 600s (10m)
 *  - >100 conf: 3600s (1h)
 */
export function ttlForConfirmations(confirmations: number): number {
  if (confirmations <= 0) return 2;
  if (confirmations <= 5) return 30;
  if (confirmations <= 100) return 600;
  return 3600;
}

/**
 * Compute TTL for non-block entities.
 *  - mempoolSummary: 2–5s (near-real-time)
 *  - feeEstimates: 10–30s (depends on volatility)
 *  - addressSummary: 30–60s (adjust per UX)
 *  - transaction (unconfirmed): 2–5s; (confirmed): defer to confirmations policy
 */
export function ttlForEntity(entity: CacheEntity, options?: { confirmations?: number }): number {
  switch (entity) {
    case 'mempoolSummary':
      return 3;
    case 'feeEstimates':
      return 15;
    case 'addressSummary':
      return 45;
    case 'transaction': {
      const conf = options?.confirmations ?? 0;
      if (conf <= 0) return 3;
      return ttlForConfirmations(conf);
    }
    case 'block': {
      const conf = options?.confirmations ?? 0;
      return ttlForConfirmations(conf);
    }
    default:
      return 30;
  }
}


