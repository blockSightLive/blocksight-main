/**
 * @fileoverview Fake Electrum adapter for tests and local development without electrs
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import { ElectrumAdapter, FeeEstimates } from './types';

export class FakeElectrumAdapter implements ElectrumAdapter {
  async ping(): Promise<boolean> {
    return true;
  }

  async getFeeEstimates(): Promise<FeeEstimates> {
    return { fast: 20, normal: 10, slow: 5 };
  }

  async getTipHeight(): Promise<number> {
    // Return a monotonically increasing fake height based on time
    const genesis = 800000;
    const increment = Math.floor((Date.now() / 1000) % 600 === 0 ? 1 : 0);
    return genesis + increment;
  }

  async getTipHeader(): Promise<{ height: number; headerHex?: string }> {
    const height = await this.getTipHeight();
    // Use a static hex fingerprint placeholder for tests
    return { height, headerHex: '0000000000000000' };
  }

  async getMempoolSummary(): Promise<{ pendingTransactions?: number | null; vsize?: number }> {
    // Provide a stable, low-noise fake summary
    return { pendingTransactions: 0, vsize: 0 };
  }
}


