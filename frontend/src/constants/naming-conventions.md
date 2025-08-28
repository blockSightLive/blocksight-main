# 🏷️ BlockSight.live - Naming Conventions & API Standards

## Purpose
This document serves as the single source of truth for all naming conventions, API endpoints, and data types across the BlockSight.live system. It ensures consistency, clarity, and maintainability across frontend, backend, and all system components.

**Purpose:** Centralized naming standards and API documentation  
**Audience:** All developers working on BlockSight.live  
**Usage:** Reference before naming any new component, action, or API endpoint  
**Version:** 1.0.0  
**Last Updated:** 2025-08-19  
**Level:** Production Standards

---

## 🎯 **Core Naming Principles**

### **1. KISS (Keep It Simple, Stupid)**
- **Short names over long names**
- **Clear names over descriptive names**
- **Consistent names over creative names**

### **2. Context is King**
- Names should make sense in their usage context
- Avoid redundant information that's obvious from context
- Prefer `BLOCK_NEW` over `RECEIVE_NEW_BLOCK_FROM_BACKEND`

### **3. Systematic Consistency**
- All similar concepts use the same naming pattern
- Follow established conventions religiously
- Document any deviations with clear rationale

---

## 🚀 **Action Naming Convention**

### **Pattern: `[ENTITY]_[ACTION]`**

#### **Block Actions**
```typescript
// ✅ GOOD - Clean, concise
BLOCK_NEW        // New block received
BLOCK_UPDATE     // Block data updated
BLOCK_REMOVE     // Block removed (reorg)

// ❌ BAD - Too verbose, obvious
RECEIVE_NEW_BLOCK_FROM_BACKEND
BLOCK_DATA_RECEIVED_FROM_ELECTRUM
```

#### **Transaction Actions**
```typescript
// ✅ GOOD
TX_NEW          // New transaction
TX_UPDATE       // Transaction updated
TX_MEMPOOL      // Mempool transaction
TX_CONFIRMED    // Transaction confirmed

// ❌ BAD
RECEIVE_NEW_TRANSACTION_FROM_BACKEND
TRANSACTION_MEMPOOL_UPDATE_FROM_ELECTRUM
```

#### **Network Actions**
```typescript
// ✅ GOOD
NETWORK_STATUS      // Network status update
NETWORK_ONLINE      // Online/offline status
NETWORK_DIFFICULTY  // Difficulty adjustment
NETWORK_HASHRATE    // Hashrate update

// ❌ BAD
RECEIVE_NETWORK_STATUS_FROM_BACKEND
NETWORK_STATUS_UPDATE_FROM_BITCOIN_CORE
```

#### **Fee Actions**
```typescript
// ✅ GOOD
FEES_UPDATE     // Fee estimates updated
FEES_MEMPOOL    // Mempool fee update
FEES_CONFIRMED  // Confirmed fee update

// ❌ BAD
RECEIVE_FEE_ESTIMATES_FROM_BACKEND
FEE_ESTIMATES_UPDATE_FROM_ELECTRUM
```

#### **Address Actions**
```typescript
// ✅ GOOD
ADDRESS_NEW     // New address data
ADDRESS_UPDATE  // Address data updated
ADDRESS_BALANCE // Balance update

// ❌ BAD
RECEIVE_ADDRESS_DATA_FROM_BACKEND
ADDRESS_INFORMATION_UPDATE_FROM_BLOCKCHAIN
```

---

## 🌐 **API Endpoint Naming Convention**

### **Pattern: `[RESOURCE]/[ACTION]`**

#### **Block Endpoints**
```typescript
// ✅ GOOD
GET    /blocks              // List blocks
GET    /blocks/:hash        // Get block by hash
GET    /blocks/latest       // Get latest blocks
GET    /blocks/height/:num  // Get block by height

// ❌ BAD
GET    /blockchain/blocks/retrieve
GET    /bitcoin/blocks/get-by-hash
```

#### **Transaction Endpoints**
```typescript
// ✅ GOOD
GET    /transactions              // List transactions
GET    /transactions/:txid        // Get transaction by ID
GET    /transactions/mempool      // Get mempool transactions
GET    /transactions/address/:addr // Get transactions for address

// ❌ BAD
GET    /txs/retrieve-by-transaction-id
GET    /bitcoin/transactions/get-mempool-data
```

#### **Network Endpoints**
```typescript
// ✅ GOOD
GET    /network/status      // Network status
GET    /network/fees        // Fee estimates
GET    /network/mempool     // Mempool info
GET    /network/difficulty  // Current difficulty

// ❌ BAD
GET    /bitcoin-network/status-information
GET    /network/get-current-fee-estimates
```

#### **Address Endpoints**
```typescript
// ✅ GOOD
GET    /addresses/:addr           // Address info
GET    /addresses/:addr/balance   // Address balance
GET    /addresses/:addr/utxos     // Address UTXOs
GET    /addresses/:addr/history   // Address history

// ❌ BAD
GET    /bitcoin-addresses/get-address-information
GET    /addresses/retrieve-balance-for-address
```

---

## 🔧 **Data Type Naming Convention**

### **Pattern: `[Entity][Type]`**

#### **Core Types**
```typescript
// ✅ GOOD
BitcoinBlock
BitcoinTransaction
BitcoinAddress
BitcoinUTXO
BitcoinFeeEstimates
BitcoinNetworkStatus

// ❌ BAD
BitcoinBlockData
BitcoinTransactionInformation
BitcoinAddressDataStructure
```

#### **Action Types**
```typescript
// ✅ GOOD
BitcoinAction
BitcoinActionTypes
BitcoinState

// ❌ BAD
BitcoinReducerAction
BitcoinStateManagementAction
BitcoinContextAction
```

#### **API Types**
```typescript
// ✅ GOOD
BitcoinAPIResponse<T>
BitcoinWebSocketEvent
BitcoinValidationResult

// ❌ BAD
BitcoinAPIRestResponseType<T>
BitcoinWebSocketEventData
BitcoinDataValidationResult
```

---

## 🏗️ **Component Naming Convention**

### **Pattern: `[Feature][Type]`**

#### **React Components**
```typescript
// ✅ GOOD
BitcoinBlockVisualizer
BitcoinFeeGauge
BitcoinNetworkLoadGauge
BitcoinPriceDashboard

// ❌ BAD
BitcoinBlock3DVisualizerComponent
BitcoinFeeEstimationGaugeComponent
BitcoinNetworkLoadDisplayGaugeComponent
```

#### **CSS Modules**
```typescript
// ✅ GOOD
BitcoinBlockVisualizer.module.css
BitcoinFeeGauge.module.css
BitcoinNetworkLoadGauge.module.css

// ❌ BAD
BitcoinBlockVisualizerStyles.module.css
BitcoinFeeGaugeComponentStyles.module.css
```

---

## 📡 **WebSocket Event Naming Convention**

### **Pattern: `[entity].[action]`**

#### **Block Events**
```typescript
// ✅ GOOD
block.new          // New block
block.update       // Block updated
block.reorg        // Block reorg

// ❌ BAD
bitcoin-block-new-received
block-data-updated-from-backend
```

#### **Transaction Events**
```typescript
// ✅ GOOD
transaction.new        // New transaction
transaction.mempool    // Mempool update
transaction.confirmed  // Transaction confirmed

// ❌ BAD
bitcoin-transaction-new-received
transaction-mempool-update-from-electrum
```

#### **Network Events**
```typescript
// ✅ GOOD
network.status     // Network status
network.fees       // Fee update
network.mempool    // Mempool update

// ❌ BAD
bitcoin-network-status-update
network-fee-estimates-updated-from-backend
```

---

## 🎨 **CSS Class Naming Convention**

### **Pattern: `[component]-[element]--[modifier]`**

#### **Component Structure**
```css
/* ✅ GOOD */
.bitcoin-block {
  /* Base styles */
}

.bitcoin-block__header {
  /* Header element */
}

.bitcoin-block__header--expanded {
  /* Expanded header modifier */
}

.bitcoin-block__hash {
  /* Hash element */
}

.bitcoin-block__hash--truncated {
  /* Truncated hash modifier */
}

/* ❌ BAD */
.bitcoin-block-visualizer-component {
  /* Too long, redundant */
}

.bitcoin-block-header-expanded-state {
  /* Inconsistent with BEM */
}
```

---

## 🔄 **State Management Naming Convention**

### **Pattern: `[entity][Action]`**

#### **Action Creators**
```typescript
// ✅ GOOD
export const bitcoinActions = {
  // Block actions
  newBlock: (block: BitcoinBlock) => ({
    type: BitcoinActionTypes.BLOCK_NEW,
    payload: block
  }),
  
  updateBlock: (block: BitcoinBlock) => ({
    type: BitcoinActionTypes.BLOCK_UPDATE,
    payload: block
  }),
  
  // Transaction actions
  newTransaction: (tx: BitcoinTransaction) => ({
    type: BitcoinActionTypes.TX_NEW,
    payload: tx
  }),
  
  // Network actions
  updateNetworkStatus: (status: BitcoinNetworkStatus) => ({
    type: BitcoinActionTypes.NETWORK_STATUS,
    payload: status
  }),
  
  // Fee actions
  updateFees: (fees: BitcoinFeeEstimates) => ({
    type: BitcoinActionTypes.FEES_UPDATE,
    payload: fees
  })
};

// ❌ BAD
export const bitcoinActions = {
  receiveNewBlockFromBackend: (block: BitcoinBlock) => ({
    type: BitcoinActionTypes.RECEIVE_NEW_BLOCK_FROM_BACKEND,
    payload: block
  }),
  
  updateNetworkStatusFromElectrum: (status: BitcoinNetworkStatus) => ({
    type: BitcoinActionTypes.RECEIVE_NETWORK_STATUS_FROM_BACKEND,
    payload: status
  })
};
```

---

## 📚 **File Naming Convention**

### **Pattern: `[Entity][Type].[ext]`**

#### **Component Files**
```typescript
// ✅ GOOD
BitcoinBlockVisualizer.tsx
BitcoinFeeGauge.tsx
BitcoinNetworkLoadGauge.tsx
BitcoinPriceDashboard.tsx

// ❌ BAD
BitcoinBlockVisualizerComponent.tsx
BitcoinFeeEstimationGaugeComponent.tsx
```

#### **CSS Files**
```typescript
// ✅ GOOD
BitcoinBlockVisualizer.module.css
BitcoinFeeGauge.module.css
BitcoinNetworkLoadGauge.module.css

// ❌ BAD
BitcoinBlockVisualizerStyles.module.css
BitcoinFeeGaugeComponentStyles.module.css
```

#### **Type Files**
```typescript
// ✅ GOOD
bitcoin.ts
types.ts
interfaces.ts

// ❌ BAD
bitcoin-types.ts
bitcoin-interfaces.ts
bitcoin-type-definitions.ts
```

---

## 🎯 **Implementation Strategy**

### **Phase 1: Update Action Types**
```typescript
// OLD (❌ BAD)
export const BitcoinActionTypes = {
  RECEIVE_BLOCKS_FROM_BACKEND: 'RECEIVE_BLOCKS_FROM_BACKEND',
  RECEIVE_NEW_BLOCK_FROM_BACKEND: 'RECEIVE_NEW_BLOCK_FROM_BACKEND',
  RECEIVE_TRANSACTIONS_FROM_BACKEND: 'RECEIVE_TRANSACTIONS_FROM_BACKEND',
  // ... more verbose names
};

// NEW (✅ GOOD)
export const BitcoinActionTypes = {
  BLOCKS_UPDATE: 'BLOCKS_UPDATE',
  BLOCK_NEW: 'BLOCK_NEW',
  TRANSACTIONS_UPDATE: 'TRANSACTIONS_UPDATE',
  TX_NEW: 'TX_NEW',
  NETWORK_STATUS: 'NETWORK_STATUS',
  FEES_UPDATE: 'FEES_UPDATE',
  ADDRESS_NEW: 'ADDRESS_NEW',
  // ... clean, concise names
};
```

### **Phase 2: Update Action Creators**
```typescript
// OLD (❌ BAD)
export const bitcoinActions = {
  setBlocks: (blocks: BitcoinBlock[]) => ({
    type: BitcoinActionTypes.RECEIVE_BLOCKS_FROM_BACKEND,
    payload: blocks
  }),
  // ... more verbose actions
};

// NEW (✅ GOOD)
export const bitcoinActions = {
  updateBlocks: (blocks: BitcoinBlock[]) => ({
    type: BitcoinActionTypes.BLOCKS_UPDATE,
    payload: blocks
  }),
  // ... clean, concise actions
};
```

### **Phase 3: Update API Endpoints**
```typescript
// OLD (❌ BAD)
const API_ENDPOINTS = {
  GET_BLOCKS_FROM_BACKEND: '/api/bitcoin/blocks/retrieve',
  GET_TRANSACTIONS_FROM_BACKEND: '/api/bitcoin/transactions/retrieve',
  // ... more verbose endpoints
};

// NEW (✅ GOOD)
const API_ENDPOINTS = {
  BLOCKS: '/api/blocks',
  TRANSACTIONS: '/api/transactions',
  NETWORK_STATUS: '/api/network/status',
  FEES: '/api/network/fees',
  // ... clean, concise endpoints
};
```

---

## 📋 **Naming Checklist**

### **Before Naming Anything:**
- [ ] **Is it short and concise?** (KISS principle)
- [ ] **Is it clear in context?** (Context is King)
- [ ] **Does it follow established patterns?** (Systematic Consistency)
- [ ] **Is it documented here?** (Single Source of Truth)
- [ ] **Would another developer understand it immediately?** (Clarity Test)

### **Naming Quality Gates:**
- [ ] **Length:** ≤ 25 characters for actions, ≤ 15 for variables
- [ ] **Clarity:** Self-explanatory in context
- [ ] **Consistency:** Follows established patterns
- [ ] **Documentation:** Added to this guide
- [ ] **Review:** Reviewed by team member

---

## 🚨 **Common Anti-Patterns to Avoid**

### **❌ Verbose Names**
```typescript
// DON'T DO THIS
RECEIVE_NEW_BLOCK_FROM_BACKEND_VIA_ELECTRUM
UPDATE_NETWORK_STATUS_FROM_BITCOIN_CORE_NODE
RETRIEVE_TRANSACTION_DATA_FROM_BLOCKCHAIN_API

// DO THIS INSTEAD
BLOCK_NEW
NETWORK_STATUS
TX_DATA
```

### **❌ Redundant Information**
```typescript
// DON'T DO THIS
BitcoinBlockDataInterface        // "Interface" is obvious from context
BitcoinTransactionFromBackend    // "FromBackend" is implied
BitcoinAddressRetrievedFromAPI  // "RetrievedFromAPI" is obvious

// DO THIS INSTEAD
BitcoinBlock
BitcoinTransaction
BitcoinAddress
```

### **❌ Inconsistent Patterns**
```typescript
// DON'T DO THIS - Mixing different naming styles
RECEIVE_BLOCKS_FROM_BACKEND      // UPPER_SNAKE_CASE
blockNew                         // camelCase
Bitcoin_Transaction_New          // Mixed case with underscores

// DO THIS INSTEAD - Consistent UPPER_SNAKE_CASE for actions
BLOCKS_UPDATE
BLOCK_NEW
TX_NEW
```

---

## 💡 **Remember**

**Good naming is like good code - it should be self-documenting, consistent, and maintainable.**

**When in doubt, ask yourself: "Would I understand this name if I saw it for the first time?"**

**This document is your single source of truth - keep it updated and follow it religiously.**
