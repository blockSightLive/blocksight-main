/**
 * @fileoverview Electrum adapter contracts (interface and DTOs)
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

export type FeeEstimates = {
  fast: number;
  normal: number;
  slow: number;
};

export interface ElectrumAdapter {
  ping(): Promise<boolean>;
  getFeeEstimates(): Promise<FeeEstimates>;
  /**
   * Get current best chain tip height.
   * Implementations may poll or subscribe under the hood.
   */
  getTipHeight(): Promise<number>;
  /**
   * Get the current best chain tip header information, including raw header hex when available.
   */
  getTipHeader(): Promise<{ height: number; headerHex?: string }>;
  /**
   * Memory pool summary (pending tx count and virtual size in vBytes if available).
   */
  getMempoolSummary(): Promise<{ pendingTransactions?: number | null; vsize?: number }>;
}


