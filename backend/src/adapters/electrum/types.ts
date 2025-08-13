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
}


