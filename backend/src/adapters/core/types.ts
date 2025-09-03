/**
 * @fileoverview Bitcoin Core RPC adapter contracts
 * @version 1.0.0
 * @since 2025-08-20
 * @lastModified 2025-01-02
 * @state ✅ Complete - Production Ready
 * 
 * @description
 * Standardized Bitcoin Core RPC adapter interface using proper types.
 * All methods use standardized RPC types from backend/src/types/bitcoin-rpc.ts
 * 
 * @dependencies
 * - backend/src/types/bitcoin-rpc.ts for all RPC types
 * 
 * @usage
 * Implemented by RealCoreRpcAdapter for production Bitcoin Core communication
 */

import type { BlockchainInfo, NetworkInfo, MiningInfo } from '../../types/bitcoin-rpc'

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
  /**
   * Return blockchain information from Bitcoin Core via `getblockchaininfo`.
   */
  getBlockchainInfo(): Promise<BlockchainInfo>;
  /**
   * Return network information from Bitcoin Core via `getnetworkinfo`.
   */
  getNetworkInfo(): Promise<NetworkInfo>;
  /**
   * Return mining information from Bitcoin Core via `getmininginfo`.
   */
  getMiningInfo(): Promise<MiningInfo>;
}


