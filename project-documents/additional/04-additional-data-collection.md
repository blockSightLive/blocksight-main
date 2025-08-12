## Purpose
Define advanced, non‑MVP analytics: facts, statistics, anomalies, milestones, Ordinals/BRC‑20 and protocol signals outside pure economics. This file is an execution plan for later phases.

## Data Governance & Formats
- Time: Unix epoch seconds UTC (int64). Derive calendar views in SQL.
- Values: store satoshis as int64; derive BTC via views. Column suffix `_sat`.
- Keys: `block_hash` (hex), `txid` (hex), `scripthash` (Electrum standard).
- Address: prefer `scripthash`; store canonical string if derivable.
- Script types enum: {p2pk, p2pkh, p2sh, p2wpkh, p2wsh, p2tr, multisig, op_return, unknown}.
- Eras: `era(era_id, start_height, end_height, name)` aligned to halvings.

## Macro Acquisition Strategy
- Keep `electrs` upstream unmodified in production. Use our Electrum adapter to mirror a minimal subset into PostgreSQL; compute rollups and materialized views (MVs). No direct RocksDB reads in prod.
- Real‑time: subscribe to Electrum notifications; incrementally update mirrors and rollups with reconciliation jobs.
- Research path: optional private sidecar/fork for pre‑aggregation experiments only; not a production dependency.

# Core On-Chain Metrics

| Category                | Metric                       | Description                                      | Collection / Calculation                                                |
| ----------------------- | ---------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| **Supply & Issuance**   | **Block Subsidy**            | Coins minted by protocol per block               | `block.vtx[0].vout[0].value` (or derive from height & halving schedule) |
|                         | **Transaction Fees**         | Total fees paid to miners in the block           | ∑(vin_value − vout_value) over all tx in block                          |
|                         | **Total Issued Supply**      | Cumulative coins in circulation up to this block | Running sum of block subsidy + transaction fees                         |
|                         | **Inflation Rate**           | Annualized % increase in supply                  | Δ(supply)/supply × (blocks_per_year / blocks_since_last_calc)           |
| **Block Metrics**       | **Height**                   | Block height                                     | `block.height`                                                          |
|                         | **Timestamp**                | Block’s timestamp                                | `block.time`                                                            |
|                         | **Size (bytes)**             | Serialized size of block                         | `block.size`                                                            |
|                         | **Weight (WU)**              | Block weight                                     | `block.weight`                                                          |
|                         | **Inter-Block Time**         | Seconds since previous block                     | `block.time – prev_block.time`                                          |
| **Transaction Metrics** | **TX Count**                 | Number of transactions in block                  | `block.tx.length`                                                       |
|                         | **Total Inputs**             | Count of all inputs across all tx                | ∑ tx.vin.length                                                         |
|                         | **Total Outputs**            | Count of all outputs across all tx               | ∑ tx.vout.length                                                        |
|                         | **Avg. TX Size (bytes)**     | Mean serialized size per tx                      | ∑ tx.size / tx_count                                                    |
|                         | **Avg. Fee per TX (BTC)**    | Mean fee                                         | (total fees) / tx_count                                                 |
|                         | **Median Fee Rate (sat/vB)** | Median fee rate                                  | median(tx.fee / tx.vsize)                                               |
| **UTXO Metrics**        | **UTXO Count**               | Total unspent outputs in UTXO set                | Track UTXO additions/removals per block                                 |
|                         | **UTXO Set Size (bytes)**    | Approx serialized size of entire UTXO set        | From `gettxoutsetinfo().serialized_size`                                |
|                         | **Avg. UTXO Value (BTC)**    | Mean BTC held per UTXO                           | `total_amount` / `txouts`                                               |
|                         | **Dust UTXOs**               | Count of outputs below dust threshold            | Filter new vout where value < dust_threshold                            |
| **Address Metrics**     | **Active Addresses**         | Unique addresses seen (in or out) in this block  | Unique set of all scriptPubKey and input scripts                        |
|                         | **New Addresses**            | Scripts never seen in any prior block            | Compare against global “seen‐scripts” set                               |
| **Activity & Movement** | **Txn Volume (BTC)**         | Sum of all output values                         | ∑ tx.vout.value                                                         |
|                         | **Coin-Days Destroyed**      | Σ(value × days since last spend)                 | For each input, Δ days = (current_ts − utxo_ts)/86400; sum(value×Δ)     |
|                         | **Dormancy (days)**          | Coin-days destroyed / BTC volume                 | `CDD` / `txn_volume`                                                    |
| **Network Metrics**     | **Difficulty**               | Proof-of-work difficulty target                  | `getblockheader(block.hash).difficulty`                                 |
|                         | **Est. Hash Rate (H/s)**     | Network hash power estimate                      | `difficulty × 2^32 / inter_block_time`                                  |
| **SegWit Adoption**     | **SegWit TX Count**          | TXs in block that include witness data           | Count tx where any `tx.vin[i].txinwitness.length > 0`                   |
|                         | **SegWit % of All TX**       | segwit_tx_count / tx_count                       | —                                                                       |

# Time-Window & Comparative Metrics

| Category                          | Metric                            | Description                           | Window(s)                                |
| --------------------------------- | --------------------------------- | ------------------------------------- | ---------------------------------------- |
| **Rolling Aggregates**            | Transaction Count                 | Total number of TXs                   | 1 day, 7 days, 30 days                   |
|                                   | Transaction Volume (BTC)          | Sum of all outputs                    | 1 day, 7 days, 30 days                   |
|                                   | Total Fees (BTC)                  | Sum of all miner fees                 | 1 day, 7 days, 30 days                   |
|                                   | Block Count                       | Number of blocks mined                | 1 day, 7 days, 30 days                   |
|                                   | Avg. Inter-Block Time (s)         | Mean seconds between blocks           | 1 day, 7 days, 30 days                   |
| **Period-over-Period Comparison** | YoY TX Count Change (%)           | % change vs same window last year     | daily, weekly, monthly                   |
|                                   | YoY Volume Change (%)             | % change vs same window last year     | daily, weekly, monthly                   |
|                                   | QoQ Fee Change (%)                | % change vs previous calendar quarter | quarterly                                |
| **Seasonal Metrics**              | Seasonal Avg. TX Count            | Avg. daily TX count in each season    | Winter (Dec–Feb), Spring, Summer, Autumn |
|                                   | Seasonal Avg. Fee per TX (sat/vB) | Avg. fee rate per TX in each season   | Winter, Spring, Summer, Autumn           |
|                                   | Seasonal CDD                      | Coin-days destroyed in each season    | Winter, Spring, Summer, Autumn           |

# Fee & Mining Dynamics
- Under‑10‑minute mining share per day and per era
- Min/avg/median/max fee rate per era
- Quickest/slowest blocks by inter‑block time

# Transaction Structure Extremes
- Most/least inputs per tx; most/least outputs per tx (daily top‑N)
- Average tx size and vsize trends

# Address Lifecycles
- Live vs dead addresses; new addresses; total addresses per era
- Never‑moved since coinbase (HODL from reward): counts, value, share per era

# Script Type Coverage
- Counts and value by script type per era (P2PKH, P2SH, P2WPKH, P2WSH, P2TR, OP_RETURN, multisig)

# Mempool Summaries
- Rolling fee histogram, next‑block fee estimates, tx counts
# First-occurrence & Milestones

| Metric                        | Description                                               | Collection / Calculation                                       |
| ----------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| **First P2SH Script**         | Block height & timestamp of first P2SH output             | Earliest block where `scriptPubKey` type = `p2sh`              |
| **First SegWit TX**           | Height & timestamp of first transaction with witness data | Earliest tx with non-empty `txinwitness`                       |
| **First Native SegWit (v0)**  | First P2WPKH / P2WSH outputs                              | Earliest block where `scriptPubKey` type = `p2wpkh` or `p2wsh` |
| **First OP_RETURN Output**    | Block & timestamp of first data-carrying output           | Earliest tx with `OP_RETURN` in any vout                       |
| **First Ordinal Inscription** | First use of Ordinal protocol                             | Earliest tx matching Ordinals inscription pattern              |
| **First BRC-20 Inscription**  | First BRC-20 token mint                                   | Earliest tx matching BRC-20 JSON schema in `OP_RETURN`         |
| **Halving Events**            | Each block reward halving                                 | Blocks at heights 210 000, 420 000, 630 000, …                 |
| **Soft Fork Activations**     | Activation heights of major soft forks                    | BIP16, BIP112, BIP141, BIP340, …                               |
| **Hard Forks & Chain Splits** | Blocks where mainnet split (BCH, BTG, BSV, etc.)          | Track for 2017-08-01, 2017-10-24, 2018-11-15, …                |

## Ordinals & Inscriptions
- Detection: scan witness/script for inscription patterns; include BRC‑20 (JSON in witness/OP_RETURN). Maintain evolving heuristics; treat as best‑effort classification.
- Storage: `inscription(txid, block_hash, type, size_b, meta jsonb)`; `inscription_stats(day, type, count)`.

## Anomaly Detection Scaffolding
- Outliers in inter‑block time, fees, sizes, activity using robust z‑scores/IQR; daily top‑N surfacing.
- Storage: `anomalies(day, metric, subject_id, score, meta jsonb)`.

## Reliability & ETL Quality
- Log failed parsing with context; expose Prometheus metrics and dashboards.
- Storage: append-only `etl_failures(ts, stage, entity_type, id_hex, error, meta jsonb)`.

## Important Calendar Events

| Event                         | Date       | Description                                                          |
| ----------------------------- | ---------- | -------------------------------------------------------------------- |
| Whitepaper Published          | 2008-10-31 | “Bitcoin: A Peer-to-Peer Electronic Cash System” released by Satoshi |
| Genesis Block Mined           | 2009-01-03 | Block 0 created by Satoshi                                           |
| Pizza Day                     | 2010-05-22 | First known real-world BTC purchase (10 000 BTC for two pizzas)      |
| BIP16 (P2SH) Activation       | 2012-02-15 | Soft fork enabling Pay-to-Script-Hash outputs                        |
| 1st Halving                   | 2012-11-28 | Block reward halved from 50 BTC → 25 BTC                             |
| 2nd Halving                   | 2016-07-09 | Block reward halved from 25 BTC → 12.5 BTC                           |
| 3rd Halving                   | 2020-05-11 | Block reward halved from 12.5 BTC → 6.25 BTC                         |
| 4th Halving                   | 2024-04-20 | Block reward halved from 6.25 BTC → 3.125 BTC                        |
| SegWit (BIP141) Activation    | 2017-08-24 | SegWit locked-in at block 481 824                                    |
| Taproot (BIP341) Activation   | 2021-11-14 | Taproot went live at block 709 632                                   |
| Bitcoin Cash Fork             | 2017-08-01 | BCH split at block 478 558                                           |
| Bitcoin Gold Fork             | 2017-10-24 | BTG split at block 491 407                                           |
| Bitcoin SV Fork               | 2018-11-15 | BSV split at block 556 766                                           |
| Satoshi Nakamoto’s “Birthday” | Unknown    | Celebrated Jan 3 by some; no public record of actual birth date      |

### Curated Milestone Additions
- 2008-08-18 – Bitcoin.org domain registered (The Dawn of Bitcoin.org)
- 2008-10-31 – Whitepaper Day (release of the Bitcoin whitepaper)
- 2008-11-09 – First use of the term “blockchain” (Hal Finney)
- 2009-01-03 – Genesis Block Day
- 2009-01-09 – Public release and first block mined; headline embedded in coinbase
- 2009-01-11 – Hal Finney “Running bitcoin” tweet
- 2009-01-12 – First Bitcoin transaction (10 BTC Satoshi → Hal Finney)
- 2010-05-22 – Bitcoin Pizza Day (10,000 BTC for two pizzas)
- April 5 (year unknown) – Satoshi’s Birthday (community Easter egg; EO 6102 reference)
- April 23 (2011) – “Bitcoin in good hands” — Satoshi’s last public message
- 2012-11-28 – First Halving Event (50 → 25 BTC)
- December 18 – HODL Day (forum meme origin)

## Implementation Notes (How/When/Based On/Storage summary)
- Views & MVs: `v_recent_blocks`, `v_fee_trends_mv`, `v_address_activity`, `v_per_era_stats_mv`, `v_anomalies_top_mv`.
- Scheduling: Dev on‑demand; Staging/Prod cron with SLOs and reconciliation.
- Storage norms: epoch seconds UTC; sats `int64`; JSONB for flexible metadata.
- Backpressure: throttle Electrum reads, batch writes, idempotent upserts.
- Access: read‑only role `explorer_ro`; no DML from analysts.

## Advanced Data Points (Addendum)
- Reorgs & Stale Blocks
  - How: detect competing headers and canonical tip switches; mark orphaned blocks.
  - When: on header updates; daily rollups.
  - Based on: Electrum headers, Core RPC parity checks.
  - Storage: `reorg_event(ts, depth, from_height, to_height, orphaned_hashes jsonb)`; `stale_block(height, hash, ts, replaced_by_hash)`.

- Version Bits Signaling (BIP9)
  - How: parse block header `version`; count set bits per window; compute thresholds.
  - When: per block; windowed per 2016 blocks.
  - Storage: `version_bits(window_start, bit, set_count, threshold, status)`.

- RBF & CPFP Usage
  - How: track mempool replacements chains; infer CPFP via parent low-fee confirmed with high-fee child.
  - When: streaming from mempool; confirm on block arrival.
  - Storage: `rbf_event(first_txid, replacing_txid, first_seen, replaced_at, fee_delta_sat, satvb_delta, chain_len)`; `cpfp_event(parent_txid, child_txid, delta_fee_sat)`.

- Address Reuse Metrics
  - How: count addresses with >1 spend received/spent across windows; privacy heuristic counters.
  - When: nightly.
  - Storage: `address_reuse_stats(day, reused_addresses, share_pct)`.

- Taproot Adoption Breakdown
  - How: classify spends: key‑path vs script‑path (control block presence); annex usage.
  - When: per tx; rollup daily/era.
  - Storage: `taproot_usage(day, key_path_count, script_path_count, annex_count)`.

- OP_RETURN Payloads
  - How: parse OP_RETURN; record size; classify JSON/text/binary; detect BRC‑20‑like schema.
  - When: per tx; rollup daily.
  - Storage: `op_return_stats(day, count, avg_size_b, p95_size_b, brc20_like_count)`.

- UTXO Age Bands (HODL Waves)
  - How: bucket unspent outputs by age bands (e.g., <1m, 1–3m, 3–6m, 6–12m, 1–2y, 2–3y, 3–5y, >5y) weighted by value.
  - When: nightly snapshot.
  - Storage: `utxo_age_bands(day, band, value_sat, count)`.

- Address Lifespan Distribution
  - How: measure duration from `first_seen` to `last_spend` per address.
  - When: nightly.
  - Storage: `address_lifespan_hist(day, bucket, count)`.

- Coinbase Spend Delay
  - How: time from coinbase creation to first spend (after maturity ≥100 blocks).
  - When: on spend; rollup daily.
  - Storage: `coinbase_spend_delay(block_height, delay_days)` and MV of distribution.

- Fee Sniping Risk Proxy
  - How: compare next‑block total fees vs subsidy; flag blocks where fee_total > X% of subsidy.
  - When: per block; rollup daily/era.
  - Storage: `fee_sniping_proxy(day, over_threshold_pct)`.

- Mempool Evictions
  - How: track transactions dropped due to size/fee policies; correlate with replacements.
  - When: streaming; rollup hourly.
  - Storage: `mempool_eviction(ts, txid, reason)`; `mempool_eviction_stats(hour, count, reason_breakdown jsonb)`.

- Version Bits (Unknown) Usage
  - How: count non‑standard bits set outside active deployments; monitor for anomalies.
  - Storage: `version_bits_unknown(window_start, bit, set_count)`.

## Algorithmic Methods & Axioms
- Axioms
  - Conservation of value: sum(inputs) = sum(outputs) + fee.
  - Chain is append‑only; reorgs of finite depth only; all rollups must be idempotent.
  - Block arrivals approximate a Poisson process; difficulty retarget every 2016 blocks.
  - Halving schedule deterministic; use era table for joins not string math.
- Robust statistics
  - Medians and trimmed means for fee rates and sizes; IQR for outlier thresholds.
  - STL decomposition or EWMA for trend/seasonality separation on time series.
  - Changepoints via Bayesian Online Change Point Detection for regime shifts.
  - Anomalies via Generalized ESD or robust z‑scores; rate‑limit alerts.
- Streaming & scale
  - Batch writes with upsert keys; incremental windows; HyperLogLog for distincts when needed.
  - Deterministic replays for recovery; checkpointed cursors per source.
