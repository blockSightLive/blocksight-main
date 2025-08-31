/**
 * @fileoverview Electrum adapter contracts (interface and DTOs)
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-30
 * @state In Development
 */

export type FeeEstimates = {
  fast: number;
  normal: number;
  slow: number;
};

export type PaginationOptions = {
  page: number;
  limit: number;
};

export type TransactionHistory = {
  txid: string;
  height: number;
  timestamp: number;
  value: number;
  fee?: number;
};

export type MempoolTransaction = {
  txid: string;
  fee: number;
  vsize: number;
  timestamp: number;
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
  getMempoolSummary(): Promise<{ count: number; vsize: number }>;
  /**
   * Health check for the adapter connection.
   */
  isConnected(): Promise<boolean>;
  /**
   * Get balance for a Bitcoin address
   */
  getBalance(address: string): Promise<number>;
  /**
   * Get transaction details by transaction ID
   */
  getTransaction(txid: string): Promise<ElectrumTransaction>;
  /**
   * Get transaction history for a Bitcoin address with pagination
   */
  getHistory(address: string, options: PaginationOptions): Promise<TransactionHistory[]>;
  /**
   * Get mempool transactions with pagination
   */
  getMempool(options: PaginationOptions): Promise<MempoolTransaction[]>;
  /**
   * Get fee estimate for specific number of blocks
   */
  getFeeEstimate(blocks: number): Promise<number>;
}

// Bitcoin transaction type for Electrum responses
export interface ElectrumTransaction {
  txid: string;
  version: number;
  locktime: number;
  vin: Array<{
    txid: string;
    vout: number;
    scriptSig?: string;
    sequence?: number;
  }>;
  vout: Array<{
    value: number;
    scriptPubKey: {
      addresses: string[];
      asm?: string;
      hex?: string;
      type?: string;
    };
  }>;
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
  size?: number;
  vsize?: number;
  weight?: number;
  fee?: number;
}


