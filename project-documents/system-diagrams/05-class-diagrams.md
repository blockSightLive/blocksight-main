# BlockSight.live - Class Diagrams

## Overview

This document contains Class Diagrams showing the core data structures and relationships in BlockSight.live, focusing on the most critical classes and their interactions with realistic implementation boundaries.

## 1. Core Blockchain Data Structures

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              BLOCKCHAIN CORE CLASSES                             │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              Block Class                                    │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + block_hash: String                                                  │ │ │
│  │  │  + height: u32                                                         │ │ │
│  │  │  + version: u32                                                        │ │ │
│  │  │  + prev_block_hash: String                                             │ │ │
│  │  │  + merkle_root: String                                                 │ │ │
│  │  │  + timestamp: u64                                                      │ │ │
│  │  │  + bits: u32                                                           │ │ │
│  │  │  + nonce: u32                                                          │ │ │
│  │  │  + transactions: Vec<Transaction>                                      │ │ │
│  │  │  + weight: u32                                                         │ │ │
│  │  │  + size: u32                                                           │ │ │
│  │  │  + fee_total: u64                                                      │ │ │
│  │  │  + created_at: DateTime                                                │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new() -> Block                                                      │ │ │
│  │  │  + validate() -> bool                                                  │ │ │
│  │  │  + calculate_merkle_root() -> String                                   │ │ │
│  │  │  + get_transaction_count() -> usize                                    │ │ │
│  │  │  + get_total_fees() -> u64                                             │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                            Transaction Class                                │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + txid: String                                                        │ │ │
│  │  │  + version: u32                                                        │ │ │
│  │  │  + locktime: u32                                                       │ │ │
│  │  │  + inputs: Vec<TxInput>                                                │ │ │
│  │  │  + outputs: Vec<TxOutput>                                              │ │ │
│  │  │  + weight: u32                                                         │ │ │
│  │  │  + size: u32                                                           │ │ │
│  │  │  + fee: u64                                                            │ │ │
│  │  │  + fee_rate: f64                                                       │ │ │
│  │  │  + block_height: Option<u32>                                           │ │ │
│  │  │  + block_hash: Option<String>                                          │ │ │
│  │  │  + memory_pool_status: MemoryPoolStatus                                │ │ │
│  │  │  + created_at: DateTime                                                │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new() -> Transaction                                                │ │ │
│  │  │  + validate() -> bool                                                  │ │ │
│  │  │  + calculate_fee_rate() -> f64                                         │ │ │
│  │  │  + get_input_count() -> usize                                          │ │ │
│  │  │  + get_output_count() -> usize                                         │ │ │
│  │  │  + is_coinbase() -> bool                                               │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              TxInput Class                                  │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + prev_txid: String                                                   │ │ │
│  │  │  + prev_vout: u32                                                      │ │ │
│  │  │  + script_sig: Script                                                  │ │ │
│  │  │  + sequence: u32                                                       │ │ │
│  │  │  + witness: Vec<Vec<u8>>                                               │ │ │
│  │  │  + value: u64                                                          │ │ │
│  │  │  + address: Option<String>                                             │ │ │
│  │  │  + script_type: ScriptType                                             │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new() -> TxInput                                                    │ │ │
│  │  │  + get_address() -> Option<String>                                     │ │ │
│  │  │  + get_script_type() -> ScriptType                                     │ │ │
│  │  │  + validate() -> bool                                                  │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                             TxOutput Class                                  │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + value: u64                                                          │ │ │
│  │  │  + script_pubkey: Script                                               │ │ │
│  │  │  + address: Option<String>                                             │ │ │
│  │  │  + script_type: ScriptType                                             │ │ │
│  │  │  + is_spent: bool                                                      │ │ │
│  │  │  + spent_by: Option<String>                                            │ │ │
│  │  │  + spent_height: Option<u32>                                           │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new() -> TxOutput                                                   │ │ │
│  │  │  + get_address() -> Option<String>                                     │ │ │
│  │  │  + get_script_type() -> ScriptType                                     │ │ │
│  │  │  + is_unspent() -> bool                                                │ │ │
│  │  │  + mark_spent(txid: String, height: u32)                               │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## 2. HTTP API Integration Classes (Our Implementation)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          HTTP API INTEGRATION CLASSES                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                         ElectrsHttpClient Class                             │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + base_url: String                                                    │ │ │
│  │  │  + timeout: Duration                                                   │ │ │
│  │  │  + retry_config: RetryConfig                                           │ │ │
│  │  │  + connection_pool: ConnectionPool                                     │ │ │
│  │  │  + circuit_breaker: CircuitBreaker                                     │ │ │
│  │  │  + metrics: HttpMetrics                                                │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: HttpConfig) -> ElectrsHttpClient                        │ │ │
│  │  │  + get_block(height: u32) -> Result<Block, Error>                      │ │ │
│  │  │  + get_transaction(txid: String) -> Result<Transaction, Error>         │ │ │
│  │  │  + get_address_history(addr: String) -> Result<Vec<Transaction>, Error>│ │ │
│  │  │  + get_memory_pool() -> Result<Vec<Transaction>, Error>                │ │ │
│  │  │  + get_network_stats() -> Result<NetworkStats, Error>                  │ │ │
│  │  │  + poll_updates() -> Result<Vec<Update>, Error>                        │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                         ConnectionPool Class                                │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + max_connections: u32                                                │ │ │
│  │  │  + timeout: Duration                                                   │ │ │
│  │  │  + keep_alive: bool                                                    │ │ │
│  │  │  + connections: Vec<HttpConnection>                                    │ │ │
│  │  │  + available_connections: Queue<HttpConnection>                        │ │ │
│  │  │  + connection_metrics: ConnectionMetrics                               │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: PoolConfig) -> ConnectionPool                           │ │ │
│  │  │  + get_connection() -> Result<HttpConnection, Error>                   │ │ │
│  │  │  + return_connection(conn: HttpConnection)                             │ │ │
│  │  │  + create_connection() -> Result<HttpConnection, Error>                │ │ │
│  │  │  + close_connection(conn: HttpConnection)                              │ │ │
│  │  │  + health_check() -> HealthStatus                                      │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                          CircuitBreaker Class                               │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + state: CircuitState                                                 │ │ │
│  │  │  + failure_threshold: u32                                              │ │ │
│  │  │  + timeout: Duration                                                   │ │ │
│  │  │  + failure_count: u32                                                  │ │ │
│  │  │  + last_failure_time: DateTime                                         │ │ │
│  │  │  + retry_strategy: RetryStrategy                                       │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: BreakerConfig) -> CircuitBreaker                        │ │ │
│  │  │  + call<T>(operation: Operation<T>) -> Result<T, Error>                │ │ │
│  │  │  + record_success()                                                    │ │ │
│  │  │  + record_failure()                                                    │ │ │
│  │  │  + is_open() -> bool                                                   │ │ │
│  │  │  + is_half_open() -> bool                                              │ │ │
│  │  │  + reset()                                                             │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## 3. Multi-Tier Cache Classes (Our Implementation)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            MULTI-TIER CACHE CLASSES                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                            CacheManager Class                               │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + l1_cache: RedisCache                                                │ │ │
│  │  │  + l2_cache: MemoryMappedCache                                         │ │ │
│  │  │  + l3_cache: NginxCache                                                │ │ │
│  │  │  + cache_strategy: CacheStrategy                                       │ │ │
│  │  │  + metrics: CacheMetrics                                               │ │ │
│  │  │  + config: CacheConfig                                                 │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: CacheConfig) -> CacheManager                            │ │ │
│  │  │  + get<T>(key: String) -> Option<T>                                    │ │ │
│  │  │  + set<T>(key: String, value: T, ttl: Duration) -> Result<(), Error>   │ │ │
│  │  │  + invalidate(key: String) -> Result<(), Error>                        │ │ │
│  │  │  + warm_cache(keys: Vec<String>) -> Result<(), Error>                  │ │ │
│  │  │  + get_hit_rate() -> f64                                               │ │ │
│  │  │  + get_stats() -> CacheStats                                           │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                             RedisCache Class                                │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + client: RedisClient                                                 │ │ │
│  │  │  + default_ttl: Duration                                               │ │ │
│  │  │  + key_prefix: String                                                  │ │ │
│  │  │  + serializer: Serializer                                              │ │ │
│  │  │  + connection_pool: RedisPool                                          │ │ │
│  │  │  + metrics: RedisMetrics                                               │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: RedisConfig) -> RedisCache                              │ │ │
│  │  │  + get<T>(key: String) -> Option<T>                                    │ │ │
│  │  │  + set<T>(key: String, value: T, ttl: Duration) -> Result<(), Error>   │ │ │
│  │  │  + delete(key: String) -> Result<(), Error>                            │ │ │
│  │  │  + exists(key: String) -> bool                                         │ │ │
│  │  │  + expire(key: String, ttl: Duration) -> Result<(), Error>             │ │ │
│  │  │  + flush() -> Result<(), Error>                                        │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                        MemoryMappedCache Class                              │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + file_path: Path                                                     │ │ │
│  │  │  + file_size: u64                                                      │ │ │
│  │  │  + record_size: usize                                                  │ │ │
│  │  │  + index: HashMap<String, u64>                                         │ │ │
│  │  │  + compression: CompressionType                                        │ │ │
│  │  │  + utxo_set: UTXOSet                                                   │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(path: Path, config: CacheConfig) -> MemoryMappedCache           │ │ │
│  │  │  + get(key: String) -> Option<Vec<u8>>                                 │ │ │
│  │  │  + set(key: String, value: Vec<u8>) -> Result<(), Error>               │ │ │
│  │  │  + get_utxo(outpoint: String) -> Option<UTXO>                          │ │ │
│  │  │  + update_utxo_set(updates: Vec<UTXOUpdate>) -> Result<(), Error>      │ │ │
│  │  │  + compact() -> Result<(), Error>                                      │ │ │
│  │  │  + get_memory_usage() -> u64                                           │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                            NginxCache Class                                 │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + cache_zones: Vec<CacheZone>                                         │ │ │
│  │  │  + cache_path: Path                                                    │ │ │
│  │  │  + max_size: u64                                                       │ │ │
│  │  │  + inactive_time: Duration                                             │ │ │
│  │  │  + cache_keys: HashMap<String, CacheKey>                               │ │ │
│  │  │  + purge_strategy: PurgeStrategy                                       │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: NginxConfig) -> NginxCache                              │ │ │
│  │  │  + cache_response(url: String, response: HttpResponse, ttl: Duration)  │ │ │
│  │  │  + get_cached_response(url: String) -> Option<HttpResponse>            │ │ │
│  │  │  + invalidate_cache(pattern: String) -> Result<(), Error>              │ │ │
│  │  │  + purge_expired() -> Result<u64, Error>                               │ │ │
│  │  │  + get_cache_stats() -> NginxCacheStats                                │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Analytics and Fee Analysis Classes (Our Implementation)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          ANALYTICS & FEE CLASSES                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           FeeAnalyzer Class                                 │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + memory_pool_txs: Vec<Transaction>                                   │ │ │
│  │  │  + fee_rates: Vec<f64>                                                 │ │ │
│  │  │  + fee_percentiles: FeePercentiles                                     │ │ │
│  │  │  + fee_categories: FeeCategories                                       │ │ │
│  │  │  + http_client: ElectrsHttpClient                                      │ │ │
│  │  │  + cache_manager: CacheManager                                         │ │ │
│  │  │  + config: FeeConfig                                                   │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: FeeConfig) -> FeeAnalyzer                               │ │ │
│  │  │  + analyze_memory_pool() -> FeeAnalysis                                │ │ │
│  │  │  + calculate_fee_rate(tx: Transaction) -> f64                          │ │ │
│  │  │  + categorize_fee_rate(rate: f64) -> FeeCategory                       │ │ │
│  │  │  + get_fee_percentiles() -> FeePercentiles                             │ │ │
│  │  │  + get_confirmation_estimate(fee_rate: f64) -> u32                     │ │ │
│  │  │  + update_memory_pool() -> Result<(), Error>                           │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                        NetworkLoadAnalyzer Class                            │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + pending_txs: Vec<Transaction>                                       │ │ │
│  │  │  + block_interval: Duration                                            │ │ │
│  │  │  + memory_pool_size: u64                                               │ │ │
│  │  │  + load_category: LoadCategory                                         │ │ │
│  │  │  + congestion_level: CongestionLevel                                   │ │ │
│  │  │  + http_client: ElectrsHttpClient                                      │ │ │
│  │  │  + cache_manager: CacheManager                                         │ │ │
│  │  │  + config: NetworkConfig                                               │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: NetworkConfig) -> NetworkLoadAnalyzer                   │ │ │
│  │  │  + analyze_network_load() -> NetworkLoad                               │ │ │
│  │  │  + calculate_congestion() -> CongestionLevel                           │ │ │
│  │  │  + get_load_category() -> LoadCategory                                 │ │ │
│  │  │  + estimate_confirmation_time(fee_rate: f64) -> Duration               │ │ │
│  │  │  + update_network_stats() -> Result<(), Error>                         │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                        EconomicMetrics Class                                │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + market_cap: f64                                                     │ │ │
│  │  │  + velocity: f64                                                       │ │ │
│  │  │  + hodl_ratio: f64                                                     │ │ │
│  │  │  + exchange_flows: ExchangeFlows                                       │ │ │
│  │  │  + mining_pools: Vec<MiningPool>                                       │ │ │
│  │  │  + price_data: PriceData                                               │ │ │
│  │  │  + postgresql_client: PostgreSQLClient                                 │ │ │
│  │  │  + cache_manager: CacheManager                                         │ │ │
│  │  │  + config: EconomicConfig                                              │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: EconomicConfig) -> EconomicMetrics                      │ │ │
│  │  │  + calculate_market_cap() -> f64                                       │ │ │
│  │  │  + calculate_velocity() -> f64                                         │ │ │
│  │  │  + calculate_hodl_ratio() -> f64                                       │ │ │
│  │  │  + analyze_exchange_flows() -> ExchangeFlows                           │ │ │
│  │  │  + identify_mining_pools() -> Vec<MiningPool>                          │ │ │
│  │  │  + update_price_data(price: f64)                                       │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## 5. API and WebSocket Classes (Our Implementation)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            API & WEBSOCKET CLASSES                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              APIServer Class                                │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + http_client: ElectrsHttpClient                                      │ │ │
│  │  │  + cache_manager: CacheManager                                         │ │ │
│  │  │  + fee_analyzer: FeeAnalyzer                                           │ │ │
│  │  │  + network_analyzer: NetworkLoadAnalyzer                               │ │ │
│  │  │  + websocket_server: WebSocketServer                                   │ │ │
│  │  │  + polling_scheduler: PollingScheduler                                 │ │ │
│  │  │  + config: APIConfig                                                   │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: APIConfig) -> APIServer                                 │ │ │
│  │  │  + start() -> Result<(), Error>                                        │ │ │
│  │  │  + stop() -> Result<(), Error>                                         │ │ │
│  │  │  + get_block(height: u32) -> Result<Block, Error>                      │ │ │
│  │  │  + get_transaction(txid: String) -> Result<Transaction, Error>         │ │ │
│  │  │  + get_address(address: String) -> Result<Address, Error>              │ │ │
│  │  │  + search(query: String) -> Result<SearchResults, Error>               │ │ │
│  │  │  + get_fee_analysis() -> Result<FeeAnalysis, Error>                    │ │ │
│  │  │  + get_network_load() -> Result<NetworkLoad, Error>                    │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                          WebSocketServer Class                              │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + connections: HashMap<String, WebSocketConnection>                   │ │ │
│  │  │  + subscriptions: HashMap<String, Vec<String>>                         │ │ │
│  │  │  + event_queue: VecDeque<WebSocketEvent>                               │ │ │
│  │  │  + polling_scheduler: PollingScheduler                                 │ │ │
│  │  │  + rate_limiter: RateLimiter                                           │ │ │
│  │  │  + config: WebSocketConfig                                             │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: WebSocketConfig) -> WebSocketServer                     │ │ │
│  │  │  + start() -> Result<(), Error>                                        │ │ │
│  │  │  + stop() -> Result<(), Error>                                         │ │ │
│  │  │  + broadcast(event: WebSocketEvent) -> Result<(), Error>               │ │ │
│  │  │  + subscribe(connection_id: String, event_type: String)                │ │ │
│  │  │  + unsubscribe(connection_id: String, event_type: String)              │ │ │
│  │  │  + handle_connection(connection: WebSocketConnection)                  │ │ │
│  │  │  + schedule_polling() -> Result<(), Error>                             │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                         PollingScheduler Class                              │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + polling_interval: Duration                                          │ │ │
│  │  │  + last_poll_time: DateTime                                            │ │ │
│  │  │  + polling_tasks: Vec<PollingTask>                                     │ │ │
│  │  │  + http_client: ElectrsHttpClient                                      │ │ │
│  │  │  + event_broadcaster: EventBroadcaster                                 │ │ │
│  │  │  + error_handler: ErrorHandler                                         │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: PollingConfig) -> PollingScheduler                      │ │ │
│  │  │  + start_polling() -> Result<(), Error>                                │ │ │
│  │  │  + stop_polling() -> Result<(), Error>                                 │ │ │
│  │  │  + poll_electrs_updates() -> Result<Vec<Update>, Error>                │ │ │
│  │  │  + schedule_task(task: PollingTask)                                    │ │ │
│  │  │  + handle_poll_error(error: Error) -> ErrorAction                      │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## 6. Configuration and Monitoring Classes

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION & MONITORING CLASSES                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           ConfigManager Class                               │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + electrs_config: ElectrsConfig                                       │ │ │
│  │  │  + cache_config: CacheConfig                                           │ │ │
│  │  │  + api_config: APIConfig                                               │ │ │
│  │  │  + fee_config: FeeConfig                                               │ │ │
│  │  │  + network_config: NetworkConfig                                       │ │ │
│  │  │  + monitoring_config: MonitoringConfig                                 │ │ │
│  │  │  + websocket_config: WebSocketConfig                                   │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new() -> ConfigManager                                              │ │ │
│  │  │  + load_from_file(path: Path) -> Result<(), Error>                     │ │ │
│  │  │  + load_from_env() -> Result<(), Error>                                │ │ │
│  │  │  + validate() -> Result<(), Error>                                     │ │ │
│  │  │  + get_electrs_config() -> ElectrsConfig                               │ │ │
│  │  │  + get_cache_config() -> CacheConfig                                   │ │ │
│  │  │  + get_api_config() -> APIConfig                                       │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ 1..*                                        │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                          MonitoringManager Class                            │ │
│  │                                                                             │ │
│  │  ┌────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │  + prometheus_client: PrometheusClient                                 │ │ │
│  │  │  + grafana_client: GrafanaClient                                       │ │ │
│  │  │  + alert_manager: AlertManager                                         │ │ │
│  │  │  + metrics: HashMap<String, Metric>                                    │ │ │
│  │  │  + alerts: Vec<Alert>                                                  │ │ │
│  │  │  + http_metrics: HttpMetrics                                           │ │ │
│  │  │  + cache_metrics: CacheMetrics                                         │ │ │
│  │  │  + config: MonitoringConfig                                            │ │ │
│  │  │                                                                        │ │ │
│  │  │  + new(config: MonitoringConfig) -> MonitoringManager                  │ │ │
│  │  │  + record_metric(name:String,value:f64,labels:HashMap<String, String>) │ │ │
│  │  │  + increment_counter(name: String, labels: HashMap<String, String>)    │ │ │
│  │  │  + record_histogram(name:String,value:f64,labels:HashMap<String,String>)│ │ │
│  │  │  + record_http_request(latency: Duration, status: u16)                  │ │ │
│  │  │  + record_cache_hit(tier: CacheTier, key: String)                      │ │ │
│  │  │  + record_cache_miss(tier: CacheTier, key: String)                     │ │ │
│  │  │  + create_alert(alert: Alert) -> Result<(), Error>                     │ │ │
│  │  │  + get_metrics() -> HashMap<String, Metric>                            │ │ │
│  │  │  + health_check() -> HealthStatus                                      │ │ │
│  │  └────────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## Key Relationships and Dependencies

### Electrum Integration Relationships
- ElectrumClient manages all communication over Electrum TCP (50001/50002)
- ConnectionPool handles persistent sockets and health; CircuitBreaker guards calls
- ApiServer uses ElectrumClient via adapter, not direct HTTP to electrs

### Multi‑Tier Cache Relationships
- CacheManager orchestrates L1 (Redis), L2 (Memory‑mapped), HTTP cache (our adapter responses)
- RedisCache provides hot data (~0.1–1ms); MemoryMappedCache serves warm data (~1–5ms)

### Analytics Processing Relationships
- AnalyticsETL reads via ElectrumClient; writes append‑only to PostgreSQL
- ApiServer reads mirror for heavy/long queries; WS pushes summaries

### API and Communication Relationships
- ApiServer provides REST; WebSocketHub manages real‑time subscriptions (headers, fees)
- No direct polling of electrs HTTP; subscriptions‑first, polling only as fallback via adapter

### Configuration and Monitoring Relationships
- ConfigManager provides Electrum endpoints, budgets, flags; MonitoringManager tracks electrum_call_latency, tip_lag, errors
- Alerts on Core/electrs divergence and reconnect storms

### Implementation Boundaries
- electrs (Open Source): Indexing + internal RocksDB; Electrum protocol over TCP
- Our Implementation: Electrum client adapter → HTTP/JSON + WS; multi‑tier caching; analytics ETL; observability/backpressure
- Data Flow: Bitcoin Core → electrs (TCP) → Node Adapter → Cache → Frontend / PostgreSQL mirror
