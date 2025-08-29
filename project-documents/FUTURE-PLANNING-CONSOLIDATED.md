# BlockSight.live - Future Planning & Advanced Features

/**
 * @fileoverview Consolidated future planning document covering advanced Bitcoin protocol features, analytics, and data collection
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-29
 * @lastModified 2025-08-29
 * 
 * @description
 * This document consolidates future planning considerations and advanced data collection strategies
 * for BlockSight.live, providing a comprehensive roadmap for post-MVP development phases.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - 01-development-roadmap.md (strategic direction)
 * - 01-execution-checklists.md (implementation tracking)
 * 
 * @usage
 * Reference for future development planning, advanced feature implementation, and data collection strategies
 * 
 * @state
 * [DONE] Consolidated from separate future planning documents
 */

## Overview

This document provides comprehensive technical specifications and implementation details for advanced Bitcoin protocol features, analytics, and data collection strategies that will be evaluated for future implementation phases after core system stability is achieved. These features represent enhancements that will be prioritized based on user value, implementation complexity, and alignment with our core mission.

**Strategic Approach**: Grounds-up development - master core Bitcoin layer before expanding to sub-layers and advanced protocols.

**Implementation Priority**: All features are evaluated against core mission alignment, implementation complexity, and user value to ensure they enhance rather than complicate the primary system objectives.

---

## 🎯 **STRATEGIC IMPLEMENTATION APPROACH**

### **Phase-Based Development Strategy**
- **Phase 1**: Core Bitcoin analysis platform with electrs integration (Current) ✅ **COMPLETED**
- **Phase 2**: Advanced transaction features (RBF, CoinJoin, privacy protocols) [NEXT]
- **Phase 3**: Extended analytics and economic metrics [FUTURE]
- **Phase 4**: Multi-protocol support and advanced data collection [FUTURE]

### **Decision Framework (Why/When/How)**
- **Why now**: Ship features only when they compound core value (search, blocks, fees) and we can meet SLOs without harming electrs.
- **When to add**: Feature gates open only if all are true:
  - Core SLOs green 30 days (API latency, tip-lag, error rate)
  - Backpressure budget available (CPU, I/O, memory)
  - Clear DoR/DoD in `01-execution-checklists.md` with rollback plan
  - Data contracts and PII/privacy review complete
- **How to add**: Ship as sidecar ETL + read-only Postgres views; no electrs modifications in production; feature-flagged rollouts with canary, metrics, and kill switch.

### **Feature Keys (High‑Level Plan per Item)**

For each feature below, we standardize on: Why → When → How → Interfaces → SLOs/Budgets → DoR/DoD → Risks/Mitigations.

---

## 🔧 **TRANSACTION ENHANCEMENT FEATURES**

### **1. Replace-by-Fee (RBF) Tracking**

#### **High-Level Description**
RBF allows Bitcoin users to replace unconfirmed transactions with higher-fee versions, creating transaction "chains" where multiple versions exist until one confirms.

#### **Technical Implementation Requirements**

**Data Model Changes:**
```sql
-- Transaction versioning table
CREATE TABLE transaction_versions (
    id SERIAL PRIMARY KEY,
    original_txid VARCHAR(64) NOT NULL,
    replacement_txid VARCHAR(64) NOT NULL,
    version_number INTEGER NOT NULL,
    fee_delta BIGINT NOT NULL, -- satoshis
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending'
);

-- RBF chain tracking
CREATE TABLE rbf_chains (
    chain_id SERIAL PRIMARY KEY,
    final_txid VARCHAR(64),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chain relationships
CREATE TABLE rbf_chain_versions (
    chain_id INTEGER REFERENCES rbf_chains(id),
    txid VARCHAR(64) NOT NULL,
    version_order INTEGER NOT NULL,
    PRIMARY KEY (chain_id, txid)
);
```

**API Endpoints Required:**
```typescript
// RBF transaction chain endpoint
GET /api/v1/transactions/{txid}/rbf-chain
Response: {
  chainId: number,
  versions: Array<{
    txid: string,
    versionNumber: number,
    feeDelta: number,
    status: string,
    timestamp: string
  }>,
  finalTxid: string,
  chainStatus: string
}

// Address RBF transactions
GET /api/v1/addresses/{address}/rbf-transactions
Response: {
  rbfTransactions: Array<{
    txid: string,
    chainId: number,
    versionNumber: number,
    feeDelta: number
  }>
}
```

**WebSocket Events:**
```typescript
// RBF replacement event
interface RBFReplacementEvent {
  type: 'rbf_replacement',
  data: {
    originalTxid: string,
    replacementTxid: string,
    feeDelta: number,
    chainId: number
  }
}
```

**Implementation Complexity: MEDIUM-HIGH**
- **Development Time**: 3-4 weeks for full implementation
- **Testing Requirements**: RBF transaction simulation, chain validation
- **Integration Points**: Transaction display, fee analysis, memory pool monitoring

---

### **2. CoinJoin/Privacy Protocol Detection**

#### **High-Level Description**
Coinjoin protocols (Wasabi, Whirlpool, JoinMarket) mix multiple users' transactions to enhance privacy, creating special transaction patterns that require different analysis approaches.

#### **Technical Implementation Requirements**

**Pattern Recognition Algorithms:**
```typescript
interface CoinjoinPattern {
  type: 'wasabi' | 'whirlpool' | 'joinmarket' | 'custom',
  confidence: number, // 0-1
  indicators: {
    equalOutputs: boolean,
    timingPattern: boolean,
    feeStructure: boolean,
    outputCount: number
  }
}

class CoinjoinDetector {
  // Wasabi detection (0.1 BTC outputs)
  detectWasabi(transaction: Transaction): CoinjoinPattern {
    const equalOutputs = this.findEqualOutputs(transaction, 0.1);
    const timing = this.analyzeTiming(transaction);
    const feeStructure = this.analyzeFeeStructure(transaction);
    
    return {
      type: 'wasabi',
      confidence: this.calculateConfidence(equalOutputs, timing, feeStructure),
      indicators: { equalOutputs, timingPattern: timing, feeStructure, outputCount: transaction.outputs.length }
    };
  }
}
```

**Implementation Complexity: MEDIUM**
- **Development Time**: 4-5 weeks for comprehensive implementation
- **Testing Requirements**: Privacy protocol simulation, clustering validation
- **Integration Points**: Address clustering engine, transaction categorization, privacy scoring

---

### **3. Soft Fork Activation Monitoring**

#### **High-Level Description**
Bitcoin soft forks activate new consensus rules through various mechanisms (BIP9, Speedy Trial, Flag Day). Tracking activation states helps users understand network upgrade progress.

#### **Technical Implementation Requirements**

**BIP Implementation Support:**
```typescript
interface BIPActivation {
  bipNumber: number;
  name: string;
  activationMechanism: 'BIP9' | 'SpeedyTrial' | 'FlagDay';
  status: 'defined' | 'started' | 'locked_in' | 'active' | 'failed';
  startHeight: number;
  timeoutHeight: number;
  lockInHeight?: number;
  activationHeight?: number;
}

class BIPActivationTracker {
  private activations: Map<number, BIPActivation> = new Map();
  
  async trackActivation(bipNumber: number): Promise<void> {
    // Monitor block version fields for signaling
    const activation = await this.getActivationInfo(bipNumber);
    this.activations.set(bipNumber, activation);
    
    // Start monitoring for activation progress
    this.monitorActivationProgress(bipNumber);
  }
}
```

**Implementation Complexity: MEDIUM**
- **Development Time**: 3-4 weeks for full implementation
- **Testing Requirements**: BIP activation simulation, consensus rule validation
- **Integration Points**: Block validation, transaction validation, consensus compliance

---

## 📊 **ADVANCED ANALYTICS ENGINE**

### **1. Address Clustering**

#### **Technical Implementation Requirements**

**Multi-Input Heuristics:**
```typescript
interface ClusteringHeuristic {
  name: string;
  weight: number;
  apply: (inputs: Input[]) => ClusteringResult;
}

class CommonInputOwnershipHeuristic implements ClusteringHeuristic {
  name = 'Common Input Ownership';
  weight = 0.8;
  
  apply(inputs: Input[]): ClusteringResult {
    // Group inputs by common ownership patterns
    const ownershipGroups = this.groupByOwnership(inputs);
    
    return {
      confidence: this.calculateConfidence(ownershipGroups),
      clusters: this.createClusters(ownershipGroups),
      metadata: this.extractMetadata(ownershipGroups)
    };
  }
}
```

**Implementation Complexity: HIGH**
- **Development Time**: 6-8 weeks for comprehensive implementation
- **Testing Requirements**: Clustering accuracy validation, performance testing
- **Integration Points**: Address analysis, transaction categorization, privacy scoring

---

### **2. Mining Pool Analysis**

#### **Technical Implementation Requirements**

**Coinbase Script Parsing:**
```typescript
interface MiningPool {
  name: string;
  identifier: string;
  coinbasePattern: string;
  feeAddress?: string;
}

class MiningPoolDetector {
  private poolPatterns: Map<string, MiningPool> = new Map();
  
  detectMiningPool(coinbaseTx: Transaction): MiningPool | null {
    const coinbaseScript = coinbaseTx.outputs[0].scriptPubKey;
    
    // Parse coinbase script for pool identifiers
    const poolIdentifier = this.extractPoolIdentifier(coinbaseScript);
    
    if (poolIdentifier) {
      return this.pools.get(poolIdentifier) || this.createUnknownPool(poolIdentifier);
    }
    
    return null;
  }
}
```

**Implementation Complexity: MEDIUM-HIGH**
- **Development Time**: 4-5 weeks for comprehensive implementation
- **Testing Requirements**: Pool pattern validation, hashrate calculation accuracy
- **Integration Points**: Block analysis, mining statistics, network metrics

---

### **3. Economic Metrics**

#### **Technical Implementation Requirements**

**HODL Score Calculation:**
```typescript
interface HODLScore {
  address: string;
  score: number; // 0-100
  lastMovement: Date;
  ageWeightedScore: number;
  amountWeightedScore: number;
}

class HODLScoreCalculator {
  calculateHODLScore(address: string): HODLScore {
    const utxos = this.getAddressUTXOs(address);
    const lastMovement = this.getLastMovement(address);
    
    const ageWeightedScore = this.calculateAgeWeightedScore(utxos);
    const amountWeightedScore = this.calculateAmountWeightedScore(utxos);
    
    return {
      address,
      score: this.combineScores(ageWeightedScore, amountWeightedScore),
      lastMovement,
      ageWeightedScore,
      amountWeightedScore
    };
  }
}
```

**Implementation Complexity: HIGH**
- **Development Time**: 5-6 weeks for comprehensive implementation
- **Testing Requirements**: Metric accuracy validation, performance optimization
- **Integration Points**: Analytics dashboard, economic reporting, trend analysis

---

## 🖼️ **INSCRIPTIONS & MEDIA RENDERING (ORDINALS / BRC‑20 / RUNES)**

### **Goal**
Enable the frontend to display embedded media and metadata carried in Taproot inscriptions or OP_RETURN payloads, including popular protocols (Ordinals, BRC‑20) and emerging ones (Runes), without degrading core performance.

### **Why (User/System Benefit)**
Showcasing inscriptions increases engagement, differentiates the explorer, and validates protocol‑aware parsing. Media previews on block/tx pages and dedicated galleries improve discovery without becoming the product's core.

### **When**
- **Earliest**: Phase 3 (after Data Exploration Layer and stability). Full gallery and protocol dashboards in Phase 4.
- **Gating**: Core SLOs green; ETL lag < 2 blocks; CPU headroom ≥ 30%; storage budget planned.

### **How (Technical Blueprint)**

**1) Detect**
- **Ordinals**: Parse Taproot witness for the ord envelope; extract content‑type and body; verify integrity.
- **BRC‑20**: Detect `text/plain; charset=utf-8` inscriptions following BRC‑20 JSON schema; validate fields and limits.
- **Runes**: Detect protocol markers per published spec/heuristics (OP_RETURN or witness markers); versioned parser with allow‑list.

**2) Validate & Sanitize**
- **Content‑type allow‑list**: image/png, image/jpeg, image/webp, image/gif, text/plain, application/json.
- **Size caps**: Default 400KB per inscription; configurable. Reject oversized or multi‑chunk reassembly beyond cap.
- **Sanitize SVG/text**: Reject active content; strip metadata that could deanonymize users.

**3) Transform & Persist**
- **Compute SHA‑256 content hash**: Content‑addressed storage key.
- **Store binary payloads**: Object storage (S3 compatible); retain minimal metadata in Postgres.
- **Generate thumbnails**: Max 512px and WebP preview; precompute dimensions and dominant color.

**4) Index & Serve**
```sql
CREATE TABLE inscription (
  id BIGSERIAL PRIMARY KEY,
  txid VARCHAR(64) NOT NULL,
  vout SMALLINT,
  block_hash VARCHAR(64) NOT NULL,
  height INTEGER NOT NULL,
  content_sha256 BYTEA NOT NULL,
  content_type TEXT NOT NULL,
  content_size INTEGER NOT NULL,
  protocol TEXT CHECK (protocol IN ('ordinals','brc20','runes','unknown')),
  brc20_ticker TEXT,
  brc20_operation TEXT,
  brc20_amount TEXT,
  runes_ticker TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE UNIQUE INDEX ux_inscription_hash ON inscription(content_sha256);
```

**5) Safety, Ethics, Legal**
- **Moderation**: Hash‑block list; user report endpoint; admin quarantine flag.
- **Terms**: Display disclaimer on user‑generated content; opt‑in to render sensitive media.
- **Jurisdictional filters**: Configurable by deployment.

**6) Performance & Backpressure**
- **Quota**: At most N inscriptions per block processed synchronously; rest deferred to background queue.
- **Budget**: Decode/thumbnail pipelines run in worker pool; timebox processing; skip on pressure.
- **Observability**: Metrics for parse success rate, avg bytes per inscription, queue depth.

**Implementation Complexity**: Medium (Phase 3 skeleton), Medium‑High (Phase 4 gallery & dashboards)

---

## 🌐 **EXTENDED PROTOCOL SUPPORT**

### **1. Lightning Network Integration**

#### **Technical Implementation Requirements**

**Lightning Node Operation:**
```typescript
interface LightningNode {
  id: string;
  alias: string;
  publicKey: string;
  channels: LightningChannel[];
  capacity: number;
}

class LightningNetworkAnalyzer {
  private lndClient: LNDClient;
  
  async analyzeLightningNetwork(): Promise<LightningNetworkMetrics> {
    const nodes = await this.getLightningNodes();
    const channels = await this.getLightningChannels();
    const payments = await this.getPaymentData();
    
    return {
      nodeCount: nodes.length,
      channelCount: channels.length,
      totalCapacity: this.calculateTotalCapacity(channels),
      averageChannelSize: this.calculateAverageChannelSize(channels),
      paymentVolume: this.calculatePaymentVolume(payments),
      networkTopology: this.analyzeNetworkTopology(nodes, channels)
    };
  }
}
```

**Implementation Complexity: VERY HIGH**
- **Development Time**: 8-10 weeks for comprehensive implementation
- **Testing Requirements**: Lightning Network simulation, payment routing validation
- **Integration Points**: Separate Lightning analysis engine, network topology visualization

---

### **2. Bitcoin Fork Blockchains**

#### **Technical Implementation Requirements**

**Multi-Chain Support:**
```typescript
interface BitcoinFork {
  name: string;
  symbol: string;
  genesisHash: string;
  chainParams: ChainParams;
  rpcEndpoint: string;
  explorerEndpoint: string;
}

class ForkBlockchainAnalyzer {
  private forks: Map<string, BitcoinFork> = new Map();
  
  async analyzeFork(fork: BitcoinFork): Promise<ForkAnalysis> {
    const client = this.createForkClient(fork);
    
    return {
      fork: fork.name,
      currentHeight: await client.getBlockHeight(),
      totalSupply: await client.getTotalSupply(),
      difficulty: await client.getDifficulty(),
      hashrate: await client.getHashrate(),
      recentBlocks: await client.getRecentBlocks(10)
    };
  }
}
```

**Implementation Complexity: HIGH**
- **Development Time**: 6-8 weeks for comprehensive implementation
- **Testing Requirements**: Multi-chain validation, cross-chain pattern recognition
- **Integration Points**: Multi-chain dashboard, cross-chain analytics, fork comparison

---

## 📈 **ENHANCED DATA COLLECTION**

### **1. Core On-Chain Metrics**

#### **Technical Implementation Requirements**

**Supply Issuance Tracking:**
```typescript
class SupplyTracker {
  async calculateSupplyMetrics(blockHeight: number): Promise<SupplyMetrics> {
    const blockSubsidy = this.calculateBlockSubsidy(blockHeight);
    const totalFees = await this.calculateTotalFees(blockHeight);
    const totalSupply = await this.calculateTotalSupply(blockHeight);
    
    return {
      blockHeight,
      blockSubsidy,
      totalFees,
      totalSupply,
      inflationRate: this.calculateInflationRate(totalSupply, blockHeight),
      halvingSchedule: this.getHalvingSchedule(blockHeight)
    };
  }
  
  private calculateBlockSubsidy(height: number): number {
    const halvings = Math.floor(height / 210000);
    return 50 * Math.pow(0.5, halvings);
  }
}
```

**UTXO Analytics:**
```typescript
class UTXOAnalyzer {
  async analyzeUTXOSet(): Promise<UTXOMetrics> {
    const utxos = await this.getUTXOSet();
    
    return {
      totalCount: utxos.length,
      totalValue: utxos.reduce((sum, utxo) => sum + utxo.value, 0),
      averageValue: this.calculateAverageValue(utxos),
      valueDistribution: this.calculateValueDistribution(utxos),
      ageDistribution: this.calculateAgeDistribution(utxos),
      dustUTXOs: this.countDustUTXOs(utxos)
    };
  }
}
```

**Implementation Complexity: MEDIUM**
- **Development Time**: 4-5 weeks for comprehensive implementation
- **Testing Requirements**: Metric accuracy validation, performance optimization
- **Integration Points**: Analytics dashboard, reporting system, data export

---

### **2. Time-Window Analysis**

#### **Technical Implementation Requirements**

**Rolling Aggregates:**
```typescript
class TimeWindowAnalyzer {
  async calculateRollingAggregates(
    metric: string,
    window: TimeWindow
  ): Promise<RollingAggregate[]> {
    const data = await this.getMetricData(metric, window);
    
    return this.calculateAggregates(data, window);
  }
  
  private calculateAggregates(
    data: MetricData[],
    window: TimeWindow
  ): RollingAggregate[] {
    const aggregates: RollingAggregate[] = [];
    
    for (let i = window.size; i < data.length; i++) {
      const windowData = data.slice(i - window.size, i);
      aggregates.push({
        timestamp: data[i].timestamp,
        value: this.calculateAggregate(windowData, window.aggregationType),
        windowSize: window.size
      });
    }
    
    return aggregates;
  }
}
```

**Seasonal Pattern Analysis:**
```typescript
class SeasonalAnalyzer {
  async analyzeSeasonalPatterns(metric: string): Promise<SeasonalPatterns> {
    const historicalData = await this.getHistoricalData(metric, '2y');
    
    return {
      winter: this.calculateSeasonalAverage(historicalData, 'winter'),
      spring: this.calculateSeasonalAverage(historicalData, 'spring'),
      summer: this.calculateSeasonalAverage(historicalData, 'summer'),
      autumn: this.calculateSeasonalAverage(historicalData, 'autumn'),
      seasonalTrends: this.identifySeasonalTrends(historicalData)
    };
  }
}
```

**Implementation Complexity: MEDIUM**
- **Development Time**: 3-4 weeks for comprehensive implementation
- **Testing Requirements**: Time series analysis validation, pattern recognition accuracy
- **Integration Points**: Trend analysis, forecasting, seasonal reporting

---

## 📊 **DATA GOVERNANCE & FORMATS**

### **Standard Data Formats**
- **Time**: Unix epoch seconds UTC (int64). Derive calendar views in SQL.
- **Values**: Store satoshis as int64; derive BTC via views. Column suffix `_sat`.
- **Keys**: `block_hash` (hex), `txid` (hex), `scripthash` (Electrum standard).
- **Address**: Prefer `scripthash`; store canonical string if derivable.
- **Script types enum**: {p2pk, p2pkh, p2sh, p2wpkh, p2wsh, p2tr, multisig, op_return, unknown}.
- **Eras**: `era(era_id, start_height, end_height, name)` aligned to halvings.

### **Macro Acquisition Strategy**
- Keep `electrs` upstream unmodified in production. Use our Electrum adapter to mirror a minimal subset into PostgreSQL; compute rollups and materialized views (MVs). No direct RocksDB reads in prod.
- **Real‑time**: Subscribe to Electrum notifications; incrementally update mirrors and rollups with reconciliation jobs.
- **Research path**: Optional private sidecar/fork for pre‑aggregation experiments only; not a production dependency.

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Phase 2: Advanced Transaction Features (Weeks 17-24)**
- **Week 17-18**: RBF Tracking implementation
- **Week 19-20**: CoinJoin detection and privacy protocols
- **Week 21-22**: Soft Fork activation monitoring
- **Week 23-24**: Testing and integration

### **Phase 3: Extended Analytics (Weeks 25-32)**
- **Week 25-27**: Address clustering and mining pool analysis
- **Week 28-30**: Economic metrics and HODL scoring
- **Week 31-32**: Testing and performance optimization

### **Phase 4: Multi-Protocol Support (Weeks 33-40)**
- **Week 33-35**: Lightning Network integration
- **Week 36-38**: Bitcoin fork blockchain support
- **Week 39-40**: Testing and cross-chain validation

### **Phase 5: Enhanced Data Collection (Weeks 41-48)**
- **Week 41-43**: Core on-chain metrics implementation
- **Week 44-46**: Time-window analysis and seasonal patterns
- **Week 47-48**: Final testing and documentation

---

## 📊 **RESOURCE REQUIREMENTS**

### **Development Team**
- **Phase 2**: 2-3 developers (Bitcoin protocol expertise)
- **Phase 3**: 3-4 developers (analytics and data science)
- **Phase 4**: 2-3 developers (multi-protocol integration)
- **Phase 5**: 2-3 developers (metrics and reporting)

### **Infrastructure Requirements**
- **Lightning Network**: Dedicated Lightning node infrastructure
- **Multi-Chain**: Additional blockchain nodes for fork analysis
- **Analytics**: Enhanced database capabilities for complex queries
- **Performance**: Additional caching layers for advanced analytics

### **Testing Requirements**
- **Test Networks**: Bitcoin testnet, Lightning testnet, fork testnets
- **Simulation Tools**: Transaction pattern simulation, network stress testing
- **Validation**: Cross-reference validation with multiple data sources
- **Performance**: Load testing for advanced analytics features

---

## 🎯 **SUCCESS METRICS**

### **Feature Adoption**
- **RBF Tracking**: 80% of users utilize RBF transaction information
- **Privacy Protocols**: 90% accuracy in privacy protocol detection
- **Address Clustering**: 85% accuracy in address ownership clustering
- **Lightning Network**: 70% of users access Lightning analytics

### **Performance Targets**
- **Advanced Analytics**: <2s response time for complex queries
- **Multi-Protocol**: <1s response time for cross-chain queries
- **Real-Time Updates**: <500ms latency for advanced protocol events
- **Data Accuracy**: 99.5% accuracy for all advanced metrics

### **User Value Metrics**
- **User Engagement**: 25% increase in session duration
- **Feature Utilization**: 60% of users access advanced analytics
- **User Satisfaction**: 4.5/5 rating for advanced features
- **API Usage**: 200% increase in paid API consumption

---

## 📅 **IMPORTANT CALENDAR EVENTS**

### **Bitcoin Milestones**
| Event                         | Date       | Description                                                          |
| ----------------------------- | ---------- | -------------------------------------------------------------------- |
| Whitepaper Published          | 2008-10-31 | "Bitcoin: A Peer-to-Peer Electronic Cash System" released by Satoshi |
| Genesis Block Mined           | 2009-01-03 | Block 0 created by Satoshi                                           |
| Pizza Day                     | 2010-05-22 | First known real-world BTC purchase (10 000 BTC for two pizzas)      |
| BIP16 (P2SH) Activation       | 2012-02-15 | Soft fork enabling Pay-to-Script-Hash outputs                        |
| 1st Halving                   | 2012-11-28 | Block reward halved from 50 BTC → 25 BTC                             |
| 2nd Halving                   | 2016-07-09 | Block reward halved from 25 BTC → 12.5 BTC                           |
| 3rd Halving                   | 2020-05-11 | Block reward halved from 12.5 BTC → 6.25 BTC                         |
| 4th Halving                   | 2024-04-20 | Block reward halved from 6.25 BTC → 3.125 BTC                        |
| SegWit (BIP141) Activation    | 2017-08-24 | SegWit locked-in at block 481 824                                    |
| Taproot (BIP341) Activation   | 2021-11-14 | Taproot went live at block 709 632                                   |

### **Fork Events**
| Event                         | Date       | Description                                                          |
| ----------------------------- | ---------- | -------------------------------------------------------------------- |
| Bitcoin Cash Fork             | 2017-08-01 | BCH split at block 478 558                                           |
| Bitcoin Gold Fork             | 2017-10-24 | BTG split at block 491 407                                           |
| Bitcoin SV Fork               | 2018-11-15 | BSV split at block 556 766                                           |

---

## 🔍 **FEATURE EVALUATION CRITERIA**

### **Evaluation Framework**
1. **User Value**: Does this enhance core Bitcoin analysis capabilities?
2. **Technical Complexity**: Implementation effort vs. core feature development
3. **Maintenance Burden**: Ongoing support requirements and edge cases
4. **Ecosystem Impact**: Effects on system robustness and user expectations
5. **Competitive Position**: Industry standard expectations vs. differentiation
6. **Resource Allocation**: Development time vs. core Bitcoin mastery

### **Risk Assessment**
- **Protocol Drift**: Mitigate with versioned rules, test fixtures, and manual overrides
- **Performance Impact**: Monitor SLOs and implement backpressure mechanisms
- **Maintenance Burden**: Clear exit criteria and minimal read-only analytics
- **Content Moderation**: Hash-block lists and user report mechanisms

---

**This document serves as the comprehensive technical specification for future Bitcoin protocol enhancements, ensuring BlockSight maintains focus on core Bitcoin mastery while preparing for informed expansion into advanced Bitcoin ecosystem features. All implementations will be evaluated against core mission alignment and user value to ensure they enhance rather than complicate the primary system objectives.**

**Note**: This document consolidates content from the previous `03-future-considerations.md` and `04-additional-data-collection.md` files. Those files have been deprecated in favor of this consolidated version.
