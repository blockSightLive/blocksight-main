/**
 * @fileoverview Bitcoin RPC TypeScript types for BlockSight.live Backend
 * @version 1.0.0
 * @author Development Team
 * @since 2025-01-02
 * @lastModified 2025-01-02
 * 
 * @description
 * Backend-specific Bitcoin RPC type definitions. This file provides
 * the standardized RPC methods and types for backend adapters.
 * 
 * @source
 * - Bitcoin Core RPC API Reference: https://developer.bitcoin.org/reference/rpc/
 * - Bitcoin Core version: 25.0+
 * 
 * @dependencies
 * - TypeScript interfaces and types
 * - Bitcoin Core RPC specification
 * 
 * @usage
 * Import types for RPC method implementations in backend adapters
 * 
 * @state
 * ✅ Complete - All core RPC types defined for backend
 */

// ============================================================================
// RPC METHOD CONSTANTS
// ============================================================================

export const BITCOIN_RPC_METHODS = {
  // Blockchain RPCs
  GET_BEST_BLOCK_HASH: 'getbestblockhash',
  GET_BLOCK: 'getblock',
  GET_BLOCKCHAIN_INFO: 'getblockchaininfo',
  GET_BLOCK_COUNT: 'getblockcount',
  GET_BLOCK_FILTER: 'getblockfilter',
  GET_BLOCK_HASH: 'getblockhash',
  GET_BLOCK_HEADER: 'getblockheader',
  GET_BLOCK_STATS: 'getblockstats',
  GET_CHAIN_TIPS: 'getchaintips',
  GET_CHAIN_TX_STATS: 'getchaintxstats',
  GET_DIFFICULTY: 'getdifficulty',
  GET_MEMPOOL_ANCESTORS: 'getmempoolancestors',
  GET_MEMPOOL_DESCENDANTS: 'getmempooldescendants',
  GET_MEMPOOL_ENTRY: 'getmempoolentry',
  GET_MEMPOOL_INFO: 'getmempoolinfo',
  GET_RAW_MEMPOOL: 'getrawmempool',
  GET_TX_OUT: 'gettxout',
  GET_TX_OUT_PROOF: 'gettxoutproof',
  GET_TX_OUTSET_INFO: 'gettxoutsetinfo',
  PRECIOUS_BLOCK: 'preciousblock',
  PRUNE_BLOCKCHAIN: 'pruneblockchain',
  SAVE_MEMPOOL: 'savemempool',
  SCAN_TX_OUTSET: 'scantxoutset',
  VERIFY_CHAIN: 'verifychain',
  VERIFY_TX_OUT_PROOF: 'verifytxoutproof',

  // Network RPCs
  ADD_NODE: 'addnode',
  CLEAR_BANNED: 'clearbanned',
  DISCONNECT_NODE: 'disconnectnode',
  GET_ADDED_NODE_INFO: 'getaddednodeinfo',
  GET_CONNECTION_COUNT: 'getconnectioncount',
  GET_NET_TOTALS: 'getnettotals',
  GET_NETWORK_INFO: 'getnetworkinfo',
  GET_NODE_ADDRESSES: 'getnodeaddresses',
  GET_PEER_INFO: 'getpeerinfo',
  LIST_BANNED: 'listbanned',
  PING: 'ping',
  SET_BAN: 'setban',
  SET_NETWORK_ACTIVE: 'setnetworkactive',

  // Mining RPCs
  GET_BLOCK_TEMPLATE: 'getblocktemplate',
  GET_MINING_INFO: 'getmininginfo',
  GET_NETWORK_HASH_PS: 'getnetworkhashps',
  PRIORITISE_TRANSACTION: 'prioritisetransaction',
  SUBMIT_BLOCK: 'submitblock',
  SUBMIT_HEADER: 'submitheader',

  // Raw Transactions RPCs
  ANALYZE_PSBT: 'analyzepsbt',
  COMBINE_PSBT: 'combinepsbt',
  COMBINE_RAW_TRANSACTION: 'combinerawtransaction',
  CONVERT_TO_PSBT: 'converttopsbt',
  CREATE_PSBT: 'createpsbt',
  CREATE_RAW_TRANSACTION: 'createrawtransaction',
  DECODE_PSBT: 'decodepsbt',
  DECODE_RAW_TRANSACTION: 'decoderawtransaction',
  DECODE_SCRIPT: 'decodescript',
  FINALIZE_PSBT: 'finalizepsbt',
  FUND_RAW_TRANSACTION: 'fundrawtransaction',
  GET_RAW_TRANSACTION: 'getrawtransaction',
  JOIN_PSBTS: 'joinpsbts',
  SEND_RAW_TRANSACTION: 'sendrawtransaction',
  SIGN_RAW_TRANSACTION_WITH_KEY: 'signrawtransactionwithkey',
  TEST_MEMPOOL_ACCEPT: 'testmempoolaccept',
  UTXO_UPDATE_PSBT: 'utxoupdatepsbt',

  // Utility RPCs
  CREATE_MULTISIG: 'createmultisig',
  DERIVE_ADDRESSES: 'deriveaddresses',
  ESTIMATE_SMART_FEE: 'estimatesmartfee',
  GET_DESCRIPTOR_INFO: 'getdescriptorinfo',
  GET_INDEX_INFO: 'getindexinfo',
  SIGN_MESSAGE_WITH_PRIVKEY: 'signmessagewithprivkey',
  VALIDATE_ADDRESS: 'validateaddress',
  VERIFY_MESSAGE: 'verifymessage'
} as const;

export type BitcoinRPCMethod = typeof BITCOIN_RPC_METHODS[keyof typeof BITCOIN_RPC_METHODS];

// ============================================================================
// COMMON RPC INTERFACES
// ============================================================================

export interface RPCRequest<T = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  method: BitcoinRPCMethod;
  params: T;
}

export interface RPCResponse<T = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  result: T;
  error: null;
}

export interface RPCErrorResponse {
  jsonrpc: '2.0';
  id: string | number;
  result: null;
  error: {
    code: number;
    message: string;
  };
}

export type RPCResult<T> = RPCResponse<T> | RPCErrorResponse;

// ============================================================================
// BLOCKCHAIN RPC TYPES
// ============================================================================

export interface BlockchainInfo {
  chain: 'main' | 'test' | 'regtest';
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
  pruneheight?: number;
  automatic_pruning?: boolean;
  prune_target_size?: number;
  warnings: string;
}

export interface MempoolInfo {
  loaded: boolean;
  size: number;
  bytes: number;
  usage: number;
  maxmempool: number;
  mempoolminfee: number;
  minrelaytxfee: number;
}

export interface NetworkInfo {
  version: number;
  subversion: string;
  protocolversion: number;
  localservices: string;
  localservicesnames: string[];
  localrelay: boolean;
  timeoffset: number;
  networkactive: boolean;
  connections: number;
  connections_in: number;
  connections_out: number;
  networks: Array<{
    name: string;
    limited: boolean;
    reachable: boolean;
    proxy: string;
    proxy_randomize_credentials: boolean;
  }>;
  relayfee: number;
  incrementalfee: number;
  localaddresses: Array<{
    address: string;
    port: number;
    score: number;
  }>;
  warnings: string;
}

export interface MiningInfo {
  blocks: number;
  currentblockweight?: number;
  currentblocktx?: number;
  difficulty: number;
  errors: string;
  networkhashps: number;
  pooledtx: number;
  chain: string;
  warnings: string;
}

// ============================================================================
// TYPE HELPERS
// ============================================================================

export function isRPCSuccess<T>(response: RPCResult<T>): response is RPCResponse<T> {
  return 'result' in response && response.result !== null;
}

export function isRPCError<T>(response: RPCResult<T>): response is RPCErrorResponse {
  return 'error' in response && response.error !== null;
}

export function extractRPCResult<T>(response: RPCResult<T>): T | null {
  return isRPCSuccess(response) ? response.result : null;
}

export function extractRPCError<T>(response: RPCResult<T>): string | null {
  return isRPCError(response) ? response.error.message : null;
}
