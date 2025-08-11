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

Important Calendar Events

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
