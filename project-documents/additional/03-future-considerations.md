# BlockSight.live - Future Bitcoin Protocol Considerations

## Overview

This document provides comprehensive technical specifications and implementation details for advanced Bitcoin protocol features that will be evaluated for future implementation phases after core system stability is achieved. These features represent enhancements that will be prioritized based on user value, implementation complexity, and alignment with our core mission.

**Strategic Approach**: Grounds-up development - master core Bitcoin layer before expanding to sub-layers and advanced protocols.

**Implementation Priority**: All features are evaluated against core mission alignment, implementation complexity, and user value to ensure they enhance rather than complicate the primary system objectives.

---

## 🎯 **STRATEGIC IMPLEMENTATION APPROACH**

### **Phase-Based Development Strategy**
- **Phase 1**: Core Bitcoin analysis platform with electrs integration (Current)
- **Phase 2**: Advanced transaction features (RBF, CoinJoin, privacy protocols)
- **Phase 3**: Extended analytics and economic metrics
- **Phase 4**: Multi-protocol support and advanced data collection

### Decision Framework (Why/When/How)
- Why now: ship features only when they compound core value (search, blocks, fees) and we can meet SLOs without harming electrs.
- When to add: feature gates open only if all are true:
  - Core SLOs green 30 days (API latency, tip-lag, error rate)
  - Backpressure budget available (CPU, I/O, memory)
  - Clear DoR/DoD in `01-execution-checklists.md` with rollback plan
  - Data contracts and PII/privacy review complete
- How to add: ship as sidecar ETL + read-only Postgres views; no electrs modifications in production; feature-flagged rollouts with canary, metrics, and kill switch.

### Feature Keys (High‑Level Plan per Item)

For each feature below, we standardize on: Why → When → How → Interfaces → SLOs/Budgets → DoR/DoD → Risks/Mitigations.

#### RBF Tracking
- Why: clarify mempool reality; improve fee guidance; visualize replacement chains.
- When: Phase 2 (after mempool adapter stability).
- How: stream mempool events, identify replacements, persist chain lineage; nightly reconciliation.
- Interfaces: `GET /api/v1/transactions/{txid}/rbf-chain`, WS `rbf_replacement`.
- SLOs/Budgets: compute ≤50ms per event; memory cap for active chains; purge after confirmation.
- DoR/DoD: schemas approved; chain viewer UI; parity test with Core mempool; backfill script.
- Risks: bursty replacements → mitigate with queues and sampling for UI; idempotent upserts.

#### CoinJoin/Privacy Detection
- Why: set user expectations and avoid false clustering; educational transparency.
- When: Phase 2 late → Phase 3 (after clustering MVP scaffolding exists).
- How: heuristic classifiers (equal output sets, timing, fee structure); assign confidence score; exclude from ownership clustering when high.
- Interfaces: `GET /api/v1/tx/{txid}/privacy`, tag in tx details.
- SLOs/Budgets: per-tx classify ≤5ms avg using cached features; offline re-scan nightly.
- DoR/DoD: precision/recall targets documented; false positive budget <5%; red/amber labels.
- Risks: protocol drift; mitigate with versioned rules, test fixtures, and manual overrides.

#### Soft Fork Activation Monitoring
- Why: protocol awareness; educate users on consensus changes.
- When: Phase 2 late (low risk, high info value).
- How: windowed version-bits analysis (2016 blocks); status transitions with alerts.
- Interfaces: `/api/v1/bip-activations`, UI banner when status changes.
- SLOs/Budgets: window rollup in <200ms; background only.
- DoR/DoD: historical backfill correct for past BIPs; alert hooks wired.
- Risks: mislabeling—cross-check with Core node signals; manual overrides allowed.

#### Inscriptions & Media (Ordinals/BRC‑20/Runes)
- Why: engagement and differentiation; protocol literacy.
- When: Phase 3 skeleton → Phase 4 gallery (see section below).
- How: parse, sanitize, hash, store in object storage; thumbnails; CDN.
- Interfaces: `/api/v1/inscriptions/*`, signed URLs, gallery endpoints.
- SLOs/Budgets: parse ≤50ms median; decode/thumbnail offloaded; quotas per block.
- DoR/DoD: moderation policy + storage budget; E2E parse→render tests.
- Risks: harmful content and costs—hash-blocklists, quotas, kill switch.

#### Lightning Network Analytics
- Why: complement on-chain with layer‑2 visibility; user interest.
- When: Phase 4 (after core stability and analytics maturity).
- How: optional LND/CLN sidecar; fetch public graph, channel stats; no private data.
- Interfaces: `/api/v1/lightning/*` (nodes, channels, capacity, topology).
- SLOs/Budgets: cache graph snapshots; refresh every 5–15 min; queries <300ms.
- DoR/DoD: node connectivity tested; topology visuals render; opt‑in deployment.
- Risks: variability of LN APIs—adapter abstraction; degrade gracefully.

#### Forked Bitcoin Chains (BCH/BSV/…)
- Why: comparative analytics; research value.
- When: Phase 4 (optional module).
- How: pluggable RPC clients; normalized schemas; separate ETL workers.
- Interfaces: `/api/v1/forks/{chain}/…`, comparison dashboards.
- SLOs/Budgets: isolate resources by chain; do not impact BTC perf; rate limits.
- DoR/DoD: at least one fork fully operational with tests; feature flag per chain.
- Risks: maintenance burden—ship minimal read-only analytics; clear exit criteria.

#### Address Clustering
- Why: macro behavior insight; power users and research.
- When: Phase 3 (after robust data mirror & privacy gating).
- How: heuristic clusterer with confidence; write-once, append-only cluster states; re-cluster offline.
- Interfaces: `/api/v1/address/{addr}/cluster`, cluster summaries.
- SLOs/Budgets: cluster lookup <150ms; batch clustering offline; memory budgets enforced.
- DoR/DoD: accuracy gates with public datasets; opt-out for privacy‑tagged tx.
- Risks: misattribution—explain confidence; never claim identity; ethics notice.

#### Mining Pool Analysis
- Why: miner landscape visibility; market structure.
- When: Phase 3.
- How: coinbase markers + heuristics; rolling hashrate share per era.
- Interfaces: `/api/v1/mining/pools`, per‑pool pages.
- SLOs/Budgets: compute shares hourly; dashboards <300ms.
- DoR/DoD: pattern library versioned; accuracy documented; unknown bins visible.
- Risks: spoofing—show confidence and “unknown” category.

#### Economic Metrics (Velocity, HODL, Age Bands)
- Why: long‑term trends and investor behavior.
- When: Phase 3.
- How: build on UTXO mirror: age bands, HODL waves, velocity rollups.
- Interfaces: `/api/v1/metrics/*`, charts with seasonal overlays.
- SLOs/Budgets: nightly recompute; interactive queries <500ms via MVs.
- DoR/DoD: reconciliation tests vs known community metrics; docs include methodology.
- Risks: interpretability—add caveats, avoid prescriptive language.

#### Time‑Window & Seasonal Analysis
- Why: contextualize short‑term vs long‑term patterns.
- When: Phase 3.
- How: rolling aggregates (1/7/30d), YoY/QoQ deltas, STL/EWMA trend extraction.
- Interfaces: `/api/v1/metrics/windows`, `/seasonal` endpoints.
- SLOs/Budgets: MV refresh nightly; requests <300ms on indexed views.
- DoR/DoD: windows verified; trend decomposition reproducible.
- Risks: seasonal bias—document methodology; allow raw view toggle.

### **Feature Evaluation Criteria**
1. **User Value**: Does this enhance core Bitcoin analysis capabilities?
2. **Technical Complexity**: Implementation effort vs. core feature development
3. **Maintenance Burden**: Ongoing support requirements and edge cases
4. **Ecosystem Impact**: Effects on system robustness and user expectations
5. **Competitive Position**: Industry standard expectations vs. differentiation
6. **Resource Allocation**: Development time vs. core Bitcoin mastery

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

**Cache Considerations:**
- Invalidate transaction cache on replacement
- Track replacement chains in Redis with 5-minute TTL
- Handle memory pool cleanup for replaced transactions
- Update fee estimation algorithms to exclude replaced transactions

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
  
  // JoinMarket detection (multiple equal outputs)
  detectJoinMarket(transaction: Transaction): CoinjoinPattern {
    // Implementation details...
  }
}
```

**Address Clustering Modifications:**
```typescript
class PrivacyAwareClustering extends AddressClustering {
  analyzeCommonOwnership(inputs: Input[]): OwnershipGroup {
    // Exclude privacy-enhanced transactions from clustering
    const privacyScore = this.calculatePrivacyScore(inputs);
    
    if (privacyScore > 0.7) {
      return this.createPrivacyGroup(inputs);
    }
    
    return super.analyzeCommonOwnership(inputs);
  }
  
  private calculatePrivacyScore(inputs: Input[]): number {
    // Calculate anonymity set size, timing patterns, etc.
    // Return 0-1 score where 1 = high privacy
  }
}
```

**Privacy Metrics Calculation:**
```typescript
class PrivacyAnalyzer {
  calculateAnonymitySet(transaction: Transaction): number {
    // Count unique input addresses
    const uniqueInputs = new Set(transaction.inputs.map(i => i.address));
    
    // Analyze output patterns
    const outputPatterns = this.analyzeOutputPatterns(transaction);
    
    // Return estimated anonymity set size
    return this.estimateAnonymitySet(uniqueInputs.size, outputPatterns);
  }
  
  calculatePrivacyScore(transaction: Transaction): PrivacyScore {
    return {
      anonymitySet: this.calculateAnonymitySet(transaction),
      timingPrivacy: this.analyzeTimingPrivacy(transaction),
      amountPrivacy: this.analyzeAmountPrivacy(transaction),
      overallScore: this.combinePrivacyMetrics(transaction)
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
  
  private async monitorActivationProgress(bipNumber: number): Promise<void> {
    // Monitor blocks for version bit signaling
    // Update activation state based on signaling progress
    // Trigger alerts when activation state changes
  }
}
```

**Version Bit Analysis:**
```typescript
class VersionBitAnalyzer {
  analyzeBlockVersion(block: Block): VersionBitInfo {
    const version = block.version;
    const versionBits = this.extractVersionBits(version);
    
    return {
      version,
      versionBits,
      bipSignaling: this.analyzeBIPSignaling(versionBits),
      activationProgress: this.calculateActivationProgress(versionBits)
    };
  }
  
  private extractVersionBits(version: number): boolean[] {
    // Extract individual version bits for BIP signaling
    const bits: boolean[] = [];
    for (let i = 0; i < 29; i++) {
      bits.push((version & (1 << i)) !== 0);
    }
    return bits;
  }
}
```

**Consensus Rule Updates:**
```typescript
class ConsensusRuleManager {
  private activeRules: Map<string, ConsensusRule> = new Map();
  
  async updateConsensusRules(blockHeight: number): Promise<void> {
    // Check for new BIP activations
    const newActivations = await this.checkNewActivations(blockHeight);
    
    for (const activation of newActivations) {
      await this.activateConsensusRule(activation);
    }
  }
  
  private async activateConsensusRule(activation: BIPActivation): Promise<void> {
    // Load new consensus rule implementation
    const rule = await this.loadConsensusRule(activation.bipNumber);
    
    // Update validation logic
    this.activeRules.set(activation.name, rule);
    
    // Notify components of rule change
    this.notifyRuleChange(activation);
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
  
  private groupByOwnership(inputs: Input[]): OwnershipGroup[] {
    // Implementation for grouping inputs by ownership
    // Consider transaction patterns, timing, amounts
  }
}

class ChangeAddressDetectionHeuristic implements ClusteringHeuristic {
  name = 'Change Address Detection';
  weight = 0.6;
  
  apply(inputs: Input[], outputs: Output[]): ClusteringResult {
    // Identify change addresses based on output patterns
    const changeAddresses = this.identifyChangeAddresses(inputs, outputs);
    
    return {
      confidence: this.calculateConfidence(changeAddresses),
      clusters: this.createChangeClusters(changeAddresses),
      metadata: { changeAddressCount: changeAddresses.length }
    };
  }
}
```

**Exchange Pattern Recognition:**
```typescript
class ExchangePatternDetector {
  private knownPatterns: ExchangePattern[] = [];
  
  detectExchangePattern(address: string): ExchangePattern | null {
    // Analyze address behavior for exchange-like patterns
    const behavior = this.analyzeAddressBehavior(address);
    
    for (const pattern of this.knownPatterns) {
      if (this.matchesPattern(behavior, pattern)) {
        return pattern;
      }
    }
    
    return null;
  }
  
  private analyzeAddressBehavior(address: string): AddressBehavior {
    // Analyze transaction frequency, amounts, timing
    // Return behavior classification
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
  
  private extractPoolIdentifier(script: string): string | null {
    // Parse OP_RETURN data for pool identifiers
    // Handle various pool script formats
    // Return pool identifier or null
  }
}
```

**Hashrate Distribution Analysis:**
```typescript
class HashrateAnalyzer {
  calculatePoolHashrate(pool: MiningPool, blocks: Block[]): HashrateData {
    const poolBlocks = blocks.filter(b => this.isPoolBlock(b, pool));
    const timeWindow = this.calculateTimeWindow(blocks);
    
    return {
      pool: pool.name,
      hashrate: this.calculateHashrate(poolBlocks.length, timeWindow),
      blockCount: poolBlocks.length,
      percentage: (poolBlocks.length / blocks.length) * 100
    };
  }
  
  private calculateHashrate(blockCount: number, timeWindow: number): number {
    // Calculate hashrate based on block count and time window
    // Consider difficulty adjustments
    return (blockCount * this.getAverageDifficulty()) / timeWindow;
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
  
  private calculateAgeWeightedScore(utxos: UTXO[]): number {
    // Calculate score based on UTXO age
    // Weight older UTXOs higher
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const utxo of utxos) {
      const age = this.calculateUTXOAge(utxo);
      const weight = this.calculateAgeWeight(age);
      totalScore += weight * this.ageToScore(age);
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
}
```

**Bitcoin Velocity Analysis:**
```typescript
class VelocityAnalyzer {
  calculateVelocity(timeWindow: number): VelocityMetrics {
    const transactions = this.getTransactionsInWindow(timeWindow);
    const utxoSet = this.getUTXOSet();
    
    return {
      velocity: this.calculateVelocity(transactions, utxoSet),
      turnoverRate: this.calculateTurnoverRate(transactions, utxoSet),
      averageHoldingTime: this.calculateAverageHoldingTime(utxos),
      velocityTrend: this.calculateVelocityTrend(timeWindow)
    };
  }
  
  private calculateVelocity(transactions: Transaction[], utxoSet: UTXO[]): number {
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.totalOutput, 0);
    const averageUTXOValue = utxoSet.reduce((sum, utxo) => sum + utxo.value, 0) / utxoSet.length;
    
    return totalVolume / averageUTXOValue;
  }
}
```

**Implementation Complexity: HIGH**
- **Development Time**: 5-6 weeks for comprehensive implementation
- **Testing Requirements**: Metric accuracy validation, performance optimization
- **Integration Points**: Analytics dashboard, economic reporting, trend analysis

---

## 🖼️ Inscriptions & Media Rendering (Ordinals / BRC‑20 / Runes)

Goal
- Enable the frontend to display embedded media and metadata carried in Taproot inscriptions or OP_RETURN payloads, including popular protocols (Ordinals, BRC‑20) and emerging ones (Runes), without degrading core performance.

Why (User/System Benefit)
- Showcasing inscriptions increases engagement, differentiates the explorer, and validates protocol‑aware parsing. Media previews on block/tx pages and dedicated galleries improve discovery without becoming the product’s core.

When
- Earliest: Phase 3 (after Data Exploration Layer and stability). Full gallery and protocol dashboards in Phase 4.
- Gating: Core SLOs green; ETL lag < 2 blocks; CPU headroom ≥ 30%; storage budget planned.

How (Technical Blueprint)
1) Detect
   - Ordinals: parse Taproot witness for the ord envelope; extract content‑type and body; verify integrity.
   - BRC‑20: detect `text/plain; charset=utf-8` inscriptions following BRC‑20 JSON schema; validate fields and limits.
   - Runes: detect protocol markers per published spec/heuristics (OP_RETURN or witness markers); versioned parser with allow‑list.

2) Validate & Sanitize
   - Content‑type allow‑list: image/png, image/jpeg, image/webp, image/gif, text/plain, application/json.
   - Size caps: default 400KB per inscription; configurable. Reject oversized or multi‑chunk reassembly beyond cap.
   - Sanitize SVG/text; reject active content; strip metadata that could deanonymize users.

3) Transform & Persist
   - Compute SHA‑256 content hash; content‑addressed storage key.
   - Store binary payloads in object storage (S3 compatible); retain minimal metadata in Postgres.
   - Generate thumbnails (max 512px) and WebP preview; precompute dimensions and dominant color.

4) Index & Serve
   - Tables:
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
   - API: `GET /api/v1/inscriptions/{id|txid}`, `GET /api/v1/blocks/{height}/inscriptions`.
   - CDN: signed URLs for `content` and `thumb` endpoints; long‑TTL caching; cache‑bust by hash.

5) Safety, Ethics, Legal
   - Moderation: hash‑block list; user report endpoint; admin quarantine flag.
   - Terms: display disclaimer on user‑generated content; opt‑in to render sensitive media.
   - Jurisdictional filters configurable by deployment.

6) Performance & Backpressure
   - Quota: at most N inscriptions per block processed synchronously; rest deferred to background queue.
   - Budget: decode/thumbnail pipelines run in worker pool; timebox processing; skip on pressure.
   - Observability: metrics for parse success rate, avg bytes per inscription, queue depth.

Frontend Integration (Phase 3 → 4)
- Block/Tx pages: small inline badge + preview modal when present.
- Gallery: filter by protocol, time, size, content‑type; lazy loading; CDN thumbnails.
- BRC‑20: minimal token metadata table and activity feed (mint/transfer/deploy) with strict validation.

DoR / DoD
- DoR: schema and API contracts reviewed; storage & CDN budgeted; moderation policy approved.
- DoD: end‑to‑end parse→store→render e2e test; performance SLOs met; kill switch documented.

Estimated Complexity: Medium (Phase 3 skeleton), Medium‑High (Phase 4 gallery & dashboards)

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
  
  private async getLightningNodes(): Promise<LightningNode[]> {
    // Connect to Lightning Network daemon (LND/CLN)
    // Retrieve node information
    // Parse and format node data
  }
}
```

**Channel Graph Analysis:**
```typescript
class ChannelGraphAnalyzer {
  analyzeChannelGraph(channels: LightningChannel[]): ChannelGraph {
    const graph = this.buildGraph(channels);
    
    return {
      nodes: this.analyzeNodes(graph.nodes),
      edges: this.analyzeEdges(graph.edges),
      connectivity: this.analyzeConnectivity(graph),
      routing: this.analyzeRouting(graph)
    };
  }
  
  private buildGraph(channels: LightningChannel[]): Graph {
    // Build graph representation of Lightning Network
    // Nodes = Lightning nodes, Edges = payment channels
    // Implement graph algorithms for analysis
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
  
  private createForkClient(fork: BitcoinFork): ForkClient {
    // Create RPC client for specific fork
    // Handle different RPC methods and response formats
    // Implement error handling and fallback mechanisms
  }
}
```

**Cross-Chain Analysis:**
```typescript
class CrossChainAnalyzer {
  async analyzeCrossChainActivity(address: string): Promise<CrossChainActivity> {
    const activities = await Promise.all([
      this.analyzeBitcoinActivity(address),
      this.analyzeBCHActivity(address),
      this.analyzeBSVActivity(address)
    ]);
    
    return {
      address,
      bitcoin: activities[0],
      bitcoinCash: activities[1],
      bitcoinSV: activities[2],
      crossChainPatterns: this.identifyCrossChainPatterns(activities)
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
  
  private calculateAgeDistribution(utxos: UTXO[]): AgeDistribution {
    // Group UTXOs by age ranges
    // Calculate percentage distribution
    // Identify aging patterns
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
  
  private calculateSeasonalAverage(data: MetricData[], season: string): number {
    const seasonData = data.filter(d => this.getSeason(d.timestamp) === season);
    return seasonData.reduce((sum, d) => sum + d.value, 0) / seasonData.length;
  }
}
```

**Implementation Complexity: MEDIUM**
- **Development Time**: 3-4 weeks for comprehensive implementation
- **Testing Requirements**: Time series analysis validation, pattern recognition accuracy
- **Integration Points**: Trend analysis, forecasting, seasonal reporting

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

**This document serves as the comprehensive technical specification for future Bitcoin protocol enhancements, ensuring BlockSight maintains focus on core Bitcoin mastery while preparing for informed expansion into advanced Bitcoin ecosystem features. All implementations will be evaluated against core mission alignment and user value to ensure they enhance rather than complicate the primary system objectives.**
