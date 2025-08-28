/**
 * @fileoverview Bitcoin Core RPC adapter contracts
 * @version 1.0.0
 * @since 2025-08-20
 * @state In Development
 */

export type CoreMempoolSummary = {
  pendingTransactions: number; // count of txs in mempool
  bytes?: number; // memory usage in bytes
  usage?: number; // mempool usage in bytes (if provided)
  minFee?: number; // mempoolminfee (BTC/kB)
};

export interface CoreRpcAdapter {
  getMempoolSummary(): Promise<CoreMempoolSummary>;
  /**
   * Return the current best block height from Bitcoin Core via `getblockcount`.
   */
  getBlockCount(): Promise<number>;
}


