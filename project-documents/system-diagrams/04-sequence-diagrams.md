# BlockSight.live - Sequence Diagrams

## Overview

This document contains key sequence diagrams showing the interaction flows between BlockSight.live system components for critical user scenarios and system operations with realistic performance characteristics.

## 1. Block Discovery and Real-Time Update Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Bitcoin     │    │ electrs     │    │ HTTP Client │    │ WebSocket   │    │ Frontend    │
│ Core        │    │ Open Source │    │ Manager     │    │ Server      │    │ Dashboard   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ 1. New Block      │                   │                   │                   │
       │    Detected       │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │ 2. Index Block    │                   │                   │
       │                   │    Data           │                   │                   │
       │                   │    (Internal)     │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 3. Store in       │                   │                   │
       │                   │    RocksDB        │                   │                   │
       │                   │    (Internal)     │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 4. HTTP API       │                   │                   │
       │                   │    Available      │                   │                   │
       │                   │    (Port 3000)    │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │ 5. Poll for       │                   │
       │                   │                   │    Updates        │                   │
       │                   │                   │    (~1-2s)        │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 6. Block Data     │                   │                   │
       │                   │    Response       │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │ 7. Cache & Push   │                   │
       │                   │                   │    Event          │                   │
       │                   │                   │──────────────────▶│                   │
       │                   │                   │                   │                   │
       │                   │                   │                   │ 8. WebSocket      │
       │                   │                   │                   │    Event          │
       │                   │                   │                   │    (~1-2s         │
       │                   │                   │                   │     latency)      │
       │                   │                   │                   │──────────────────▶│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 9. Update UI      │
       │                   │                   │                   │    Components     │
       │                   │                   │                   │    (Real-time)    │
       │                   │                   │                   │◀──────────────────│
```

## 1. Tip Discovery and Real-Time Update (Subscriptions-First)

```
┌─────────────┐    ┌─────────────┐    ┌────────────────┐    ┌───────────────┐    ┌─────────────┐
│ Bitcoin     │    │  electrs    │    │ ElectrumClient │    │ Cache (L1/L2) │    │ Frontend    │
│ Core        │    │ (Electrum)  │    │  (Node Adapter)│    │  + WebSocket  │    │ Dashboard   │
└─────────────┘    └─────────────┘    └────────────────┘    └───────────────┘    └─────────────┘
       │                  │                    │                      │                     │
       │ 1. New block     │                    │                      │                     │
       │    indexed       │                    │                      │                     │
       │─────────────────▶│                    │                      │                     │
       │                  │ 2. headers.sub     │                      │                     │
       │                  │    notification    │                      │                     │
       │                  │──────────────────▶│                      │                     │
       │                  │                    │ 3. Update L1/L2      │                     │
       │                  │                    │    caches            │                     │
       │                  │                    │────────────────────▶│                     │
       │                  │                    │ 4. Broadcast WS tip  │                     │
       │                  │                    │────────────────────▶│                     │
       │                  │                    │                      │ 5. UI updates       │
       │                  │                    │                      │──────────────────▶│
```

## 2. Address Search and Transaction Lookup (Scripthash)

```
┌─────────────┐    ┌─────────────┐    ┌────────────────┐    ┌───────────────┐    ┌─────────────┐
│ User        │    │ Frontend    │    │ API Server     │    │ ElectrumClient│    │  electrs    │
│ Browser     │    │ Search UI   │    │ (Node Adapter) │    │ (Node Adapter)│    │ (Electrum)  │
└─────────────┘    └─────────────┘    └────────────────┘    └───────────────┘    └─────────────┘
       │                  │                    │                      │                     │
       │ 1. Search addr   │                    │                      │                     │
       │─────────────────▶│                    │                      │                     │
       │                  │ 2. HTTP GET        │                      │                     │
       │                  │   /address/{addr}  │                      │                     │
       │                  │──────────────────▶│                      │                     │
       │                  │                    │ 3. Check L1/L2/HTTP  │                     │
       │                  │                    │    cache (hit?)      │                     │
       │                  │                    │──────────────────────│                     │
       │                  │                    │ 4. Derive scripthash │                     │
       │                  │                    │    from scriptPubKey │                     │
       │                  │                    │────────────────────▶│                      │
       │                  │                    │ 5. get_history /     │                      │
       │                  │                    │    get_balance       │                      │
       │                  │                    │────────────────────▶│                      │
       │                  │                    │                      │ 6. Response         │
       │                  │                    │                      │◀───────────────────│
       │                  │                    │ 7. Cache + paginate  │                     │
       │                  │                    │──────────────────────│                     │
       │                  │ 8. HTTP response   │                      │                     │
       │                  │◀──────────────────│                      │                     │
       │ 9. Render results │                   │                      │                     │
       │◀──────────────────│                   │                      │                     │
```

## 3. Fee Analysis and Network Load Calculation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ HTTP Client │    │ electrs     │    │ Analytics   │    │ Cache       │    │ Frontend    │
│ Manager     │    │ HTTP API    │    │ Engine      │    │ Layer       │    │ Dashboard   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ 1. Poll Memory    │                   │                   │                   │
       │    Pool Data      │                   │                   │                   │
       │    (~1-2s)        │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 2. Memory Pool    │                   │                   │                   │
       │    Response       │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 3. Feed Data to   │                   │                   │                   │
       │    Analytics      │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │ 4. Calculate      │                   │                   │
       │                   │    sats/vB        │                   │                   │
       │                   │    ~500-2000ms    │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 5. Categorize     │                   │                   │
       │                   │    Fees           │                   │                   │
       │                   │    (Low/Med/High) │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 6. Network Load   │                   │                   │
       │                   │    Analysis       │                   │                   │
       │                   │    ~200-1000ms    │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 7. Cache          │                   │                   │
       │                   │    Results        │                   │                   │
       │                   │    (1-2s TTL)     │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │ 8. Analytics      │                   │                   │                   │
       │    Available      │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 9. WebSocket      │                   │                   │                   │
       │    Update         │                   │                   │                   │
       │    (~1-2s)        │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │                   │ 10. Update Fee    │
       │                   │                   │                   │     Gauge         │
       │                   │                   │                   │     (Real-time)   │
       │                   │                   │                   │◀──────────────────│
```

## 4. Price Data Integration and Currency Conversion Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Price       │    │ API Layer   │    │ Cache       │    │ Frontend    │    │ User        │
│ Feeds       │    │ (NodeJS)    │    │ Layer       │    │ Calculator  │    │ Browser     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ 1. Price Update   │                   │                   │                   │
       │    (Hourly)       │                   │                   │                   │
       │    CoinGecko      │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │ 2. Validate       │                   │                   │
       │                   │    Price Data     │                   │                   │
       │                   │    ~10-50ms       │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 3. Cache Price    │                   │                   │
       │                   │    Data           │                   │                   │
       │                   │    (1hr TTL)      │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 4. Price Cached   │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 5. WebSocket      │                   │                   │
       │                   │    Update         │                   │                   │
       │                   │    (If Changed)   │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │                   │ 6. Price Update   │
       │                   │                   │                   │    Received       │
       │                   │                   │                   │    (Hourly)       │
       │                   │                   │                   │◀──────────────────│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 7. Update Price   │
       │                   │                   │                   │    Display        │
       │                   │                   │                   │◀──────────────────│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 8. Calculator     │
       │                   │                   │                   │    Request        │
       │                   │                   │                   │    (~10-20ms      │
       │                   │                   │                   │     cached)       │
       │                   │                   │                   │◀──────────────────│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 9. Real-time      │
       │                   │                   │                   │    Conversion     │
       │                   │                   │                   │◀──────────────────│
       │                   │                   │                   │                   │
       │                   │                   │                   │ 10. Display       │
       │                   │                   │                   │     Results       │
       │                   │                   │                   │◀──────────────────│
```

## 5. System Health Monitoring and Alerting Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ All System  │    │ Prometheus  │    │ Grafana     │    │ AlertManager│    │ DevOps      │
│ Components  │    │ (Metrics)   │    │ (Dashboards)│    │ (Alerting)  │    │ Team        │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ 1. Performance    │                   │                   │                   │
       │    Metrics        │                   │                   │                   │
       │    (HTTP API,     │                   │                   │                   │
       │     Cache,        │                   │                   │                   │
       │     Response      │                   │                   │                   │
       │     Times)        │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │ 2. Store Metrics  │                   │                   │
       │                   │    (Time Series)  │                   │                   │
       │                   │    ~15s interval  │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 3. Query Metrics  │                   │                   │
       │                   │    for Display    │                   │                   │
       │                   │    ~5s refresh    │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 4. Real-time      │                   │                   │
       │                   │    Dashboards     │                   │                   │
       │                   │    (Performance,  │                   │                   │
       │                   │     Cache Hit     │                   │                   │
       │                   │     Rates, API    │                   │                   │
       │                   │     Response)     │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 5. Alert Rules    │                   │                   │
       │                   │    Evaluation     │                   │                   │
       │                   │    (Response      │                   │                   │
       │                   │     time > 5s,    │                   │                   │
       │                   │     Error rate    │                   │                   │
       │                   │     > 5%)         │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 6. Threshold      │                   │                   │
       │                   │    Exceeded       │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 7. Generate       │                   │                   │
       │                   │    Alert          │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │ 8. Send           │                   │
       │                   │                   │    Notification   │                   │
       │                   │                   │    (Slack/Email)  │                   │
       │                   │                   │──────────────────▶│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 9. Alert          │                   │
       │                   │                   │    Received       │                   │
       │                   │                   │◀──────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 10. Investigate   │                   │
       │                   │                   │     Issue         │                   │
       │                   │                   │     (Check        │                   │
       │                   │                   │      electrs      │                   │
       │                   │                   │      HTTP API,    │                   │
       │                   │                   │      Cache        │                   │
       │                   │                   │      Performance) │                   │
       │                   │                   │◀──────────────────│                   │
```

## 6. User Settings and Preferences Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ User        │    │ Frontend    │    │ Settings    │    │ Cache       │    │ Local       │
│ Browser     │    │ Settings    │    │ API         │    │ Layer       │    │ Storage     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ 1. Change         │                   │                   │                   │
       │    Settings       │                   │                   │                   │
       │    (Language/     │                   │                   │                   │
       │     Theme/        │                   │                   │                   │
       │     Currency)     │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │ 2. Validate       │                   │                   │
       │                   │    Settings       │                   │                   │
       │                   │    ~1-5ms         │                   │                   │
       │                   │──────────────────▶│                   │                   │
       │                   │                   │                   │                   │
       │                   │ 3. Settings       │                   │                   │
       │                   │    Update         │                   │                   │
       │                   │    ~10-20ms       │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │                   │                   │ 4. Store in       │                   │
       │                   │                   │    Session        │                   │
       │                   │                   │    Cache          │                   │
       │                   │                   │    ~0.1-1ms       │                   │
       │                   │                   │──────────────────▶│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 5. Cache          │                   │
       │                   │                   │    Updated        │                   │
       │                   │                   │◀──────────────────│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 6. Persist to     │                   │
       │                   │                   │    Local Storage  │                   │
       │                   │                   │    ~1-5ms         │                   │
       │                   │                   │──────────────────▶│                   │
       │                   │                   │                   │                   │
       │                   │                   │ 7. Settings       │                   │
       │                   │                   │    Saved          │                   │
       │                   │                   │◀──────────────────│                   │
       │                   │                   │                   │                   │
       │                   │ 8. Settings       │                   │                   │
       │                   │    Applied        │                   │                   │
       │                   │    (Immediate     │                   │                   │
       │                   │     UI Update)    │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │ 9. UI Updated     │                   │                   │                   │
       │    (Language/     │                   │                   │                   │
       │     Theme/        │                   │                   │                   │
       │     Currency      │                   │                   │                   │
       │     Applied       │                   │                   │                   │
       │     Instantly)    │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
```

## 7. Error Handling and Recovery Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ HTTP Client │    │ electrs     │    │ Circuit     │    │ Cache       │    │ Frontend    │
│ Manager     │    │ HTTP API    │    │ Breaker     │    │ Layer       │    │ Dashboard   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │                   │
       │                   │                   │                   │                   │
       │ 1. HTTP Request   │                   │                   │                   │
       │    Timeout        │                   │                   │                   │
       │    (>10s)         │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 2. Timeout        │                   │                   │                   │
       │    Error          │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 3. Error          │                   │                   │                   │
       │    Detected       │                   │                   │                   │
       │    (Failure       │                   │                   │                   │
       │     Count > 3)    │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 4. Circuit        │                   │                   │                   │
       │    Breaker        │                   │                   │                   │
       │    Activated      │                   │                   │                   │
       │    (Open State)   │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 5. Fallback to    │                   │                   │                   │
       │    Cached Data    │                   │                   │                   │
       │    (Multi-tier)   │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 6. Cached Data    │                   │                   │                   │
       │    Retrieved      │                   │                   │                   │
       │    ~1-20ms        │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 7. Service        │                   │                   │                   │
       │    Degraded       │                   │                   │                   │
       │    Mode           │                   │                   │                   │
       │    (Stale Data    │                   │                   │                   │
       │     Warning)      │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │                   │ 8. Retry Logic    │                   │                   │
       │                   │    (Exponential   │                   │                   │
       │                   │     Backoff:      │                   │                   │
       │                   │     2s, 4s, 8s,   │                   │                   │
       │                   │     16s, 32s)     │                   │                   │
       │                   │◀──────────────────│                   │                   │
       │                   │                   │                   │                   │
       │ 9. Recovery       │                   │                   │                   │
       │    Attempt        │                   │                   │                   │
       │    (Half-Open     │                   │                   │                   │
       │     State)        │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 10. Service       │                   │                   │                   │
       │     Restored      │                   │                   │                   │
       │     (Normal       │                   │                   │                   │
       │      Operation)   │                   │                   │                   │
       │◀──────────────────│                   │                   │                   │
       │                   │                   │                   │                   │
       │ 11. Circuit       │                   │                   │                   │
       │     Breaker       │                   │                   │                   │
       │     Closed        │                   │                   │                   │
       │     (Normal       │                   │                   │                   │
       │      State)       │                   │                   │                   │
       │──────────────────▶│                   │                   │                   │
```

## 3. Fee/Mempool Update and Push

```
┌────────────────┐    ┌─────────────┐    ┌─────────────────┐    ┌───────────────┐    ┌─────────────┐
│ ElectrumClient │    │  electrs    │    │ Analytics Engine│    │ Cache (L1/L2) │    │ Frontend    │
│ (Node Adapter) │    │ (Electrum)  │    │  (Node Adapter) │    │ + WebSocket   │    │ Dashboard   │
└────────────────┘    └─────────────┘    └─────────────────┘    └───────────────┘    └─────────────┘
       │                    │                    │                      │                     │
       │ 1. mempool signal  │                    │                      │                     │
       │ (sub or periodic)  │◀───────────────────│                      │                     │
       │ 2. Fetch mempool   │                    │                      │                     │
       │    summary/histo   │───────────────────▶│                      │                     │
       │                    │ 3. Data            │                      │                     │
       │                    │◀───────────────────│                      │                     │
       │ 4. Analyze fees    │                    │ 5. Fee bands/metrics │                     │
       │    (sats/vB)       │──────────────────────────────────────────▶│                     │
       │ 6. Cache results   │                    │                      │                     │
       │───────────────────────────────────────────────────────────────▶│                     │
       │ 7. WS broadcast    │                    │                      │ 8. UI updates       │
       │───────────────────────────────────────────────────────────────▶│──────────────────▶│
```

## 4. Error Handling: Circuit Breaker on Electrum Calls

```
┌────────────────┐    ┌──────────────────────┐    ┌─────────────┐
│ API/Adapter    │    │ Circuit Breaker      │    │  electrs    │
│ (Node)         │    │ (Closed/Open/Half)   │    │ (Electrum)  │
└────────────────┘    └──────────────────────┘    └─────────────┘
       │                      │                         │
       │ 1. Request          │                         │
       │────────────────────▶│                         │
       │                      │ 2. Closed → pass       │
       │                      │───────────────────────▶│
       │                      │                         │ 3. Error/timeout
       │                      │                         │◀──────────────────
       │                      │ 4. Record failure, open │
       │                      │    if over threshold    │
       │                      │◀────────────────────────│
       │ 5. Serve from cache │                         │
       │    or degrade       │                         │
       │◀────────────────────│                         │
       │                      │ 6. Half‑open probe     │
       │                      │    after timeout       │
       │                      │───────────────────────▶│
       │                      │ 7. Close on success    │
```

## Key Interaction Patterns

### **Real-Time Data Flow (Realistic)**

- **Block Discovery**: Bitcoin Core → electrs → HTTP API → 1-2s Polling → WebSocket → Frontend
- **Memory Pool Updates**: HTTP polling every 1-2s → Analytics Engine → WebSocket push
- **Price Updates**: External APIs → Hourly updates → Cache → WebSocket (if changed)

### **Search and Query Flow (Multi-tier Cache)**

- **Cache Hierarchy**: L1 Redis (~0.1-1ms) → L2 Memory-mapped (~1-5ms) → L3 Nginx (~5-20ms)
- **API Fallback**: Cache miss → electrs HTTP API (~50-200ms) → PostgreSQL (~100-500ms)
- **Performance Optimization**: Aggressive caching with realistic response times

### **Analytics and Processing (Our Implementation)**

- **Fee Analysis**: Memory pool data → Analytics Engine → Real-time categorization (~500-2000ms)
- **Network Load**: Transaction analysis → Load categorization → Cached results (~200-1000ms)
- **Economic Metrics**: Historical data → Complex calculations → Multi-tier cache (~1-5s)

### **Error Handling and Resilience**

- **Circuit Breaker Pattern**: Automatic failure detection with exponential backoff
- **Graceful Degradation**: Fallback to multi-tier cache during electrs HTTP API outages
- **Service Recovery**: Half-open state testing with intelligent retry mechanisms

### **User Experience (Realistic Expectations)**

- **Real-time Updates**: WebSocket-based updates with 1-2 second latency
- **Responsive Design**: Cached responses for immediate UI feedback (~10-50ms)
- **Persistent Settings**: User preferences with local storage and session cache
