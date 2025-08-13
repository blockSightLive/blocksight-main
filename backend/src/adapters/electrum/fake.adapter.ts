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
}


