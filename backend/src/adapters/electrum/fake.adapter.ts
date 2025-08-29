/**
 * @fileoverview Fake Electrum adapter for tests and local development without electrs
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-28
 * @state ✅ Complete - Test Implementation Only
 * 
 * @description
 * This adapter provides mock implementations for testing and development
 * when a real electrum server is not available. All methods return
 * predictable, stable values for consistent testing.
 * 
 * @dependencies
 * - ElectrumAdapter interface
 * 
 * @usage
 * Used ONLY for testing and local development without electrum servers
 * 
 * @state
 * ✅ Complete - Test Implementation Only
 * 
 * @bugs
 * - None - This is intentionally simplified for testing
 * 
 * @todo
 * - None - This adapter is complete for its intended purpose
 * 
 * @performance
 * - Instant responses - No network calls
 * - Predictable values - Consistent test results
 * 
 * @security
 * - No external connections - Safe for testing
 * - No real data exposure - All values are mock
 */

import { ElectrumAdapter, FeeEstimates } from './types';

export class FakeElectrumAdapter implements ElectrumAdapter {
  /**
   * ✅ MOCK IMPLEMENTATION - Always returns true for testing
   */
  async ping(): Promise<boolean> {
    return true;
  }

  /**
   * ✅ MOCK IMPLEMENTATION - Returns stable fee estimates for testing
   */
  async getFeeEstimates(): Promise<FeeEstimates> {
    return { fast: 20, normal: 10, slow: 5 };
  }

  /**
   * ✅ MOCK IMPLEMENTATION - Returns monotonically increasing height for testing
   * Simulates blockchain progression without real network calls
   */
  async getTipHeight(): Promise<number> {
    // Return a monotonically increasing fake height based on time
    const genesis = 800000;
    const increment = Math.floor((Date.now() / 1000) % 600 === 0 ? 1 : 0);
    return genesis + increment;
  }

  /**
   * ✅ MOCK IMPLEMENTATION - Returns mock header data for testing
   * Uses static hex fingerprint placeholder
   */
  async getTipHeader(): Promise<{ height: number; headerHex?: string }> {
    const height = await this.getTipHeight();
    // Use a static hex fingerprint placeholder for tests
    return { height, headerHex: '0000000000000000' };
  }

  /**
   * ✅ MOCK IMPLEMENTATION - Returns stable mempool data for testing
   * Provides consistent, low-noise data for predictable tests
   */
  async getMempoolSummary(): Promise<{ pendingTransactions?: number | null; vsize?: number }> {
    // Provide a stable, low-noise fake summary
    return { pendingTransactions: 0, vsize: 0 };
  }
}


