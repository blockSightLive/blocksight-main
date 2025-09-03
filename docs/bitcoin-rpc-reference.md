# Bitcoin RPC API Reference

> **Source**: [Bitcoin Core RPC API Reference](https://developer.bitcoin.org/reference/rpc/)
> **Version**: Bitcoin Core 25.0+
> **Last Updated**: 2025-08-31

## Overview

This document provides the complete reference for Bitcoin Core RPC methods used in BlockSight.live. All RPC calls should go through our MainOrchestrator system, not directly from components.

## Core Blockchain RPCs

### getbestblockhash
**Description**: Returns the hash of the best (tip) block in the longest blockchain.

**Parameters**: None

**Response**:
```typescript
interface GetBestBlockHashResponse {
  result: string;  // Block hash in hex
  error: null;
  id: string;
}
```

**Usage in BlockSight**: Latest block identification for real-time updates

---

### getblock
**Description**: Gets a block with a particular header hash.

**Parameters**:
```typescript
interface GetBlockParams {
  blockhash: string;      // Block hash in hex
  verbosity?: 0 | 1 | 2; // 0=hex, 1=json, 2=json with tx details
}
```

**Response** (verbosity=1):
```typescript
interface BlockData {
  hash: string;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  tx: string[];           // Transaction IDs
  time: number;           // Unix timestamp
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx: number;            // Transaction count
  previousblockhash: string;
  nextblockhash?: string;
}
```

**Usage in BlockSight**: 3D block visualization, transaction details

---

### getblockchaininfo
**Description**: Returns an object containing various state info regarding blockchain processing.

**Parameters**: None

**Response**:
```typescript
interface BlockchainInfo {
  chain: 'main' | 'test' | 'regtest';
  blocks: number;         // Current block height
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
```

**Usage in BlockSight**: Overall blockchain status, sync progress

---

### getblockcount
**Description**: Returns the number of blocks in the longest blockchain.

**Parameters**: None

**Response**:
```typescript
interface GetBlockCountResponse {
  result: number;         // Current block height
  error: null;
  id: string;
}
```

**Usage in BlockSight**: Real-time height updates, progress tracking

---

### getmempoolinfo
**Description**: Returns details on the active state of the TX memory pool.

**Parameters**: None

**Response**:
```typescript
interface MempoolInfo {
  loaded: boolean;
  size: number;           // Number of transactions
  bytes: number;          // Size in bytes
  usage: number;          // Memory usage
  maxmempool: number;     // Max memory pool size
  mempoolminfee: number;  // Minimum fee rate
  minrelaytxfee: number;  // Minimum relay fee
}
```

**Usage in BlockSight**: Mempool visualization, fee estimation

---

### getdifficulty
**Description**: Returns the proof-of-work difficulty as a multiple of the minimum difficulty.

**Parameters**: None

**Response**:
```typescript
interface GetDifficultyResponse {
  result: number;         // Current difficulty
  error: null;
  id: string;
}
```

**Usage in BlockSight**: Mining difficulty display, network health

---

### getblockstats
**Description**: Compute per block statistics for a range of blocks.

**Parameters**:
```typescript
interface GetBlockStatsParams {
  hash_or_height: string | number;
  stats?: string[];       // Array of stats to compute
}
```

**Response**:
```typescript
interface BlockStats {
  avgfee: number;
  avgfeerate: number;
  avgtxsize: number;
  blockhash: string;
  feerate_percentiles: number[];
  height: number;
  ins: number;
  maxfee: number;
  maxfeerate: number;
  maxtxsize: number;
  medianfee: number;
  medianfeerate: number;
  mediantime: number;
  mediantxsize: number;
  minfee: number;
  minfeerate: number;
  mintxsize: number;
  outs: number;
  subsidy: number;
  swtotal_size: number;
  swtotal_weight: number;
  swtxs: number;
  time: number;
  total_out: number;
  total_size: number;
  total_weight: number;
  totalfee: number;
  txs: number;
  utxo_increase: number;
  utxo_size_inc: number;
}
```

**Usage in BlockSight**: Detailed block analytics, fee analysis

## Network RPCs

### getnetworkinfo
**Description**: Returns an object containing various state info regarding P2P networking.

**Parameters**: None

**Response**:
```typescript
interface NetworkInfo {
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
  networks: Network[];
  relayfee: number;
  incrementalfee: number;
  localaddresses: LocalAddress[];
  warnings: string;
}
```

**Usage in BlockSight**: Network health monitoring, connection status

---

### getconnectioncount
**Description**: Returns the number of connections to other nodes.

**Parameters**: None

**Response**:
```typescript
interface GetConnectionCountResponse {
  result: number;         // Number of connections
  error: null;
  id: string;
}
```

**Usage in BlockSight**: Network connectivity display

---

### getnettotals
**Description**: Returns information about network traffic, including bytes in, bytes out, and current time.

**Parameters**: None

**Response**:
```typescript
interface NetTotals {
  totalbytesrecv: number;
  totalbytessent: number;
  timemillis: number;
  uploadtarget: UploadTarget;
}
```

**Usage in BlockSight**: Network performance metrics

## Mining RPCs

### getmininginfo
**Description**: Returns a json object containing mining-related information.

**Parameters**: None

**Response**:
```typescript
interface MiningInfo {
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
```

**Usage in BlockSight**: Mining statistics, network hash rate

---

### getnetworkhashps
**Description**: Returns the estimated network hashes per second based on the last n blocks.

**Parameters**:
```typescript
interface GetNetworkHashPSParams {
  nblocks?: number;       // Default: 120
  height?: number;        // Default: -1 (current height)
}
```

**Response**:
```typescript
interface GetNetworkHashPSResponse {
  result: number;         // Hashes per second
  error: null;
  id: string;
}
```

**Usage in BlockSight**: Network hash rate visualization

## Transaction RPCs

### getrawtransaction
**Description**: Returns the raw transaction data.

**Parameters**:
```typescript
interface GetRawTransactionParams {
  txid: string;           // Transaction ID
  verbose?: boolean;      // Default: false
  blockhash?: string;     // Block hash for context
}
```

**Response** (verbose=true):
```typescript
interface Transaction {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  blockhash: string;
  confirmations: number;
  blocktime: number;
  time: number;
}
```

**Usage in BlockSight**: Transaction details, mempool transactions

---

### getmempoolentry
**Description**: Returns mempool data for a specific transaction.

**Parameters**:
```typescript
interface GetMempoolEntryParams {
  txid: string;           // Transaction ID
}
```

**Response**:
```typescript
interface MempoolEntry {
  vsize: number;
  weight: number;
  time: number;
  height: number;
  descendantcount: number;
  descendantsize: number;
  descendantfees: number;
  ancestorcount: number;
  ancestorsize: number;
  ancestorfees: number;
  wtxid: string;
  fees: Fees;
  'unbroadcast': boolean;
}
```

**Usage in BlockSight**: Mempool transaction details, fee analysis

## Fee Estimation RPCs

### estimatesmartfee
**Description**: Estimates the approximate fee per kilobyte needed for a transaction to be included within a certain number of blocks.

**Parameters**:
```typescript
interface EstimateSmartFeeParams {
  conf_target: number;    // Confirmation target in blocks
  estimate_mode?: 'UNSET' | 'ECONOMICAL' | 'CONSERVATIVE';
}
```

**Response**:
```typescript
interface EstimateSmartFeeResponse {
  feerate: number;        // Fee rate in BTC/kB
  errors: string[];
  blocks: number;
}
```

**Usage in BlockSight**: Fee estimation for transactions

## Implementation in BlockSight

### 1. RPC Method Registry
All RPC methods should be registered in our `BlockchainContext` plugin:

```typescript
// In BlockchainContext plugin
const RPC_METHODS = {
  GET_BEST_BLOCK_HASH: 'getbestblockhash',
  GET_BLOCK: 'getblock',
  GET_BLOCKCHAIN_INFO: 'getblockchaininfo',
  GET_BLOCK_COUNT: 'getblockcount',
  GET_MEMPOOL_INFO: 'getmempoolinfo',
  GET_DIFFICULTY: 'getdifficulty',
  GET_BLOCK_STATS: 'getblockstats',
  GET_NETWORK_INFO: 'getnetworkinfo',
  GET_CONNECTION_COUNT: 'getconnectioncount',
  GET_NET_TOTALS: 'getnettotals',
  GET_MINING_INFO: 'getmininginfo',
  GET_NETWORK_HASH_PS: 'getnetworkhashps',
  GET_RAW_TRANSACTION: 'getrawtransaction',
  GET_MEMPOOL_ENTRY: 'getmempoolentry',
  ESTIMATE_SMART_FEE: 'estimatesmartfee'
} as const;
```

### 2. Type Safety
All RPC responses should use the TypeScript interfaces defined above.

### 3. Error Handling
Standardized error handling for RPC failures:

```typescript
interface RPCError {
  code: number;
  message: string;
  method: string;
  params?: unknown[];
}
```

### 4. Rate Limiting
Implement rate limiting per RPC method to avoid hitting Bitcoin Core limits.

## Best Practices

1. **Never call RPC methods directly** from components
2. **Always go through MainOrchestrator** and context plugins
3. **Cache RPC responses** appropriately using our cache strategies
4. **Handle RPC errors gracefully** with fallback data
5. **Monitor RPC performance** through our performance metrics system
6. **Use WebSocket events** when available instead of polling RPC methods

## Rate Limits

Bitcoin Core has built-in rate limiting:
- **Default**: 15 requests per 15 seconds
- **Configurable**: Via `rpcworkqueue` and `rpcthreads` settings
- **Recommendation**: Implement client-side rate limiting at 1 request per second

## Security Considerations

1. **RPC authentication** required for production
2. **Network isolation** for RPC endpoints
3. **Input validation** for all RPC parameters
4. **Response sanitization** before processing
5. **Error message filtering** to avoid information leakage
