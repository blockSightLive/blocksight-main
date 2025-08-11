# BlockSight.live - Deployment Diagram

## Overview

This Deployment Diagram shows the physical infrastructure and deployment architecture for BlockSight.live, including realistic hardware specifications, HTTP API integration, and evidence-based deployment strategies.

## Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION INFRASTRUCTURE                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              EDGE & LOAD BALANCING                         │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   CDN/Edge      │    │   Load Balancer │    │   Nginx L3      │         │ │
│  │  │   (Cloudflare)  │    │   (HAProxy)     │    │   Cache         │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • Global CDN    │    │ • SSL/TLS       │    │ • HTTP Cache    │         │ │
│  │  │ • DDoS          │    │   Termination   │    │ • electrs       │         │ │
│  │  │   Protection    │    │ • Rate Limiting │    │   Response      │         │ │
│  │  │ • Static        │    │ • Health Checks │    │   Cache         │         │ │
│  │  │   Content       │    │ • Load          │    │ • 1s-24h TTL    │         │ │
│  │  │ • Edge Caching  │    │   Distribution  │    │ • ~5-20ms       │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        CORE APPLICATION TIER                          │ │ │
│  │  │                              (NodeJS)                                 │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   API Server 1  │    │   API Server 2  │    │   API Server 3  │    │ │ │
│  │  │  │   (Our Impl.)   │    │   (Our Impl.)   │    │   (Our Impl.)   │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • 8 vCPU        │    │ • 8 vCPU        │    │ • 8 vCPU        │    │ │ │
│  │  │  │ • 16GB RAM      │    │ • 16GB RAM      │    │ • 16GB RAM      │    │ │ │
│  │  │  │ • 500GB SSD     │    │ • 500GB SSD     │    │ • 500GB SSD     │    │ │ │
│  │  │  │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ │ │
│  │  │  │ • HTTP Client   │    │ • HTTP Client   │    │ • HTTP Client   │    │ │ │
│  │  │  │ • REST API      │    │ • REST API      │    │ • REST API      │    │ │ │
│  │  │  │ • WebSocket     │    │ • WebSocket     │    │ • WebSocket     │    │ │ │
│  │  │  │ • 1-2s Polling  │    │ • 1-2s Polling  │    │ • 1-2s Polling  │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           HTTP API INTEGRATION                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Connection    │    │   Circuit       │    │   Load          │         │ │
│  │  │   Pool          │    │   Breaker       │    │   Balancer      │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • Keep-Alive    │    │ • Failure       │    │ • Round Robin   │         │ │
│  │  │ • 50 Max Conn   │    │   Detection     │    │ • Health Checks │         │ │
│  │  │ • 10s Timeout   │    │ • Auto Failover │    │ • electrs       │         │ │
│  │  │ • Retry Logic   │    │ • Exponential   │    │   Instance      │         │ │
│  │  │ • Pool Health   │    │   Backoff       │    │   Selection     │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │                                   ▼                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                           ELECTRS TIER                                │ │ │
│  │  │                         (Open Source)                                 │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   electrs 1     │    │   electrs 2     │    │   electrs 3     │    │ │ │
│  │  │  │   (Rust)        │    │   (Rust)        │    │   (Rust)        │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • 16 vCPU       │    │ • 16 vCPU       │    │ • 16 vCPU       │    │ │ │
│  │  │  │ • 32GB RAM      │    │ • 32GB RAM      │    │ • 32GB RAM      │    │ │ │
│  │  │  │ • 2TB NVMe SSD  │    │ • 2TB NVMe SSD  │    │ • 2TB NVMe SSD  │    │ │ │
│  │  │  │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ │ │
│  │  │  │ • RocksDB       │    │ • RocksDB       │    │ • RocksDB       │    │ │ │
│  │  │  │   (Internal)    │    │   (Internal)    │    │   (Internal)    │    │ │ │
│  │  │  │ • HTTP API      │    │ • HTTP API      │    │ • HTTP API      │    │ │ │
│  │  │  │   (Port 3000)   │    │   (Port 3000)   │    │   (Port 3000)   │    │ │ │
│  │  │  │ • Two-Phase     │    │ • Two-Phase     │    │ • Two-Phase     │    │ │ │
│  │  │  │   Indexing      │    │   Indexing      │    │   Indexing      │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           BITCOIN CORE TIER                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Bitcoin Core  │    │   Bitcoin Core  │    │   Bitcoin Core  │         │ │
│  │  │   (Primary)     │    │   (Secondary)   │    │   (Tertiary)    │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • 8 vCPU        │    │ • 8 vCPU        │    │ • 8 vCPU        │         │ │
│  │  │ • 16GB RAM      │    │ • 16GB RAM      │    │ • 16GB RAM      │         │ │
│  │  │ • 2TB NVMe SSD  │    │ • 2TB NVMe SSD  │    │ • 2TB NVMe SSD  │         │ │
│  │  │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ • 1Gbps NIC     │         │ │
│  │  │ • Full Node     │    │ • Full Node     │    │ • Full Node     │         │ │
│  │  │ • RPC Server    │    │ • RPC Server    │    │ • RPC Server    │         │ │
│  │  │ • .blk Files    │    │ • .blk Files    │    │ • .blk Files    │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        MULTI-TIER CACHE & STORAGE                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Redis L1      │    │   Memory-Mapped │    │   PostgreSQL    │         │ │
│  │  │   (Hot Cache)   │    │   L2 (Warm)     │    │   (Analytics)   │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • 4 vCPU        │    │ • 8 vCPU        │    │ • 8 vCPU        │         │ │
│  │  │ • 16GB RAM      │    │ • 64GB RAM      │    │ • 32GB RAM      │         │ │
│  │  │ • 500GB SSD     │    │ • 1TB NVMe SSD  │    │ • 4TB SSD       │         │ │
│  │  │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ • 1Gbps NIC     │         │ │
│  │  │ • 1-2s TTL      │    │ • UTXO Set      │    │ • Read Replicas │         │ │
│  │  │ • Session Data  │    │ • Compression   │    │ • Analytics     │         │ │
│  │  │ • ~0.1-1ms      │    │ • O(1) Lookups  │    │ • Complex       │         │ │
│  │  │ • Hot Data      │    │ • ~1-5ms        │    │   Queries       │         │ │
│  │  │                 │    │ • 50GB+ Dataset │    │ • ~100-500ms    │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        MONITORING TIER                                │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   Prometheus    │    │   Grafana       │    │   AlertManager  │    │ │ │
│  │  │  │   (Metrics)     │    │   (Dashboards)  │    │   (Alerting)    │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • 4 vCPU        │    │ • 2 vCPU        │    │ • 2 vCPU        │    │ │ │
│  │  │  │ • 16GB RAM      │    │ • 8GB RAM       │    │ • 8GB RAM       │    │ │ │
│  │  │  │ • 1TB SSD       │    │ • 500GB SSD     │    │ • 250GB SSD     │    │ │ │
│  │  │  │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ • 1Gbps NIC     │    │ │ │
│  │  │  │ • HTTP API      │    │ • Real-time     │    │ • Response Time │    │ │ │
│  │  │  │   Metrics       │    │   Dashboards    │    │   > 5s Alerts   │    │ │ │
│  │  │  │ • Cache Hit     │    │ • Cache         │    │ • Error Rate    │    │ │ │
│  │  │  │   Rates         │    │   Performance   │    │   > 5% Alerts   │    │ │ │
│  │  │  │ • Response      │    │ • electrs       │    │ • Capacity      │    │ │ │
│  │  │  │   Times         │    │   Health        │    │   Monitoring    │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              EXTERNAL CONNECTIONS                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Price APIs    │    │   External      │    │   Admin         │         │ │
│  │  │   (Hourly)      │    │   Services      │    │   Access        │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • CoinGecko     │    │ • Exchange APIs │    │ • VPN Gateway   │         │ │
│  │  │ • CoinMarketCap │    │ • Mining Pool   │    │ • SSH Access    │         │ │
│  │  │ • Hourly        │    │   APIs          │    │ • Monitoring    │         │ │
│  │  │   Updates       │    │ • Blockchain    │    │   Access        │         │ │
│  │  │ • Rate Limiting │    │   APIs          │    │ • Firewall      │         │ │
│  │  │ • Circuit       │    │ • Analytics     │    │ • Port          │         │ │
│  │  │   Breaker       │    │   Services      │    │   Filtering     │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Infrastructure Specifications

### **Hardware Requirements (Evidence-Based)**

#### **Production Requirements**

- **electrs Nodes**: 16 vCPU, 32GB RAM, 2TB NVMe SSD per instance
- **API Servers**: 8 vCPU, 16GB RAM, 500GB SSD per instance
- **Bitcoin Core**: 8 vCPU, 16GB RAM, 2TB NVMe SSD per node
- **Cache Servers**: 4-8 vCPU, 16-64GB RAM depending on tier
- **Network**: 1Gbps+ connections for all nodes

#### **Minimum Requirements**

- **CPU**: 4 cores (8 threads)
- **RAM**: 16GB
- **Storage**: 1TB NVMe SSD
- **Network**: 100Mbps

#### **Recommended Requirements**

- **CPU**: 8 cores (16 threads)
- **RAM**: 32GB
- **Storage**: 2TB NVMe SSD
- **Network**: 1Gbps

### **HTTP API Integration Architecture**

#### **Connection Management**

- **Connection Pool**: Keep-alive connections with 50 max concurrent
- **Circuit Breaker**: Automatic failure detection with exponential backoff
- **Load Balancer**: Round-robin distribution across electrs instances
- **Health Checks**: Regular endpoint health monitoring

#### **Performance Characteristics**

- **Polling Frequency**: 1-2 second intervals for real-time updates
- **Timeout Configuration**: 10s HTTP timeout, 5-10s circuit breaker timeout
- **Retry Strategy**: 3 retries with exponential backoff (2s, 4s, 8s)
- **Connection Pooling**: Persistent connections with keep-alive

### **Multi-Tier Caching Strategy**

#### **Cache Hierarchy**

- **L1 (Redis)**: Hot data cache with 1-2s TTL, ~0.1-1ms access
- **L2 (Memory-mapped)**: UTXO set and warm data, ~1-5ms access
- **L3 (Nginx)**: HTTP response cache with 1s-24h TTL, ~5-20ms access
- **Database**: PostgreSQL for complex analytics, ~100-500ms

#### **Cache Performance**

- **Hit Rates**: L1: 60-80%, L2: 15-25%, L3: 5-15%
- **Miss Penalty**: electrs HTTP API ~50-200ms
- **Total Response Time**: Cached: 10-50ms, Cache Miss: 100-500ms
- **Complex Queries**: 1-5s with timeout at 5-10s

### **Network Architecture**

#### **Network Segmentation**

- **Edge Tier**: CDN, Load balancers, Nginx L3 cache
- **Application Tier**: NodeJS API servers with HTTP client integration
- **Integration Tier**: Connection pools, circuit breakers, load balancers
- **Data Tier**: electrs instances, Bitcoin Core nodes
- **Storage Tier**: Multi-tier cache and PostgreSQL analytics

#### **Network Security**

- **Firewall Rules**: Port filtering for electrs HTTP API (3000)
- **VPN Access**: Secure administrative access
- **SSL/TLS**: End-to-end encryption for all HTTP communications
- **Rate Limiting**: API request throttling with circuit breakers

### **Deployment Strategy**

#### **Container Orchestration**

- **Docker**: Application containerization for all NodeJS components
- **Kubernetes**: Container orchestration for API servers and cache layers
- **Native Deployment**: electrs and Bitcoin Core deployed directly on VMs
- **Service Mesh**: HTTP API communication management

#### **High Availability**

- **Load Balancing**: HAProxy with health checks for electrs HTTP APIs
- **Failover**: Automatic circuit breaker activation and recovery
- **Data Replication**: PostgreSQL read replicas for analytics
- **Cache Redundancy**: Redis clustering with persistence

#### **Scaling Strategy**

- **Horizontal Scaling**: Multiple electrs instances behind load balancer
- **API Scaling**: Multiple NodeJS instances with shared cache
- **Cache Scaling**: Redis clustering and memory-mapped file distribution
- **Auto-scaling**: Dynamic resource allocation based on HTTP API load

### **Monitoring and Observability**

#### **Metrics Collection**

- **HTTP API Metrics**: Request latency, error rates, timeout frequency
- **Cache Performance**: Hit rates, miss penalties, TTL effectiveness
- **electrs Health**: HTTP endpoint availability, response times
- **System Resources**: CPU, memory, disk, network utilization

#### **Alert Thresholds**

- **Response Time**: Alert if >5s average response time
- **Error Rate**: Alert if >5% error rate over 5 minutes
- **Cache Hit Rate**: Alert if L1 cache hit rate <50%
- **electrs Availability**: Alert on HTTP API endpoint failures

### **Performance Optimization**

#### **HTTP Integration Optimization**

- **Connection Reuse**: Persistent HTTP connections with keep-alive
- **Request Batching**: Batch multiple requests when possible
- **Compression**: gzip compression for HTTP responses
- **Parallel Requests**: Concurrent HTTP requests with connection pooling

#### **Cache Optimization**

- **Predictive Caching**: Pre-load frequently accessed data
- **Cache Warming**: Scheduled cache warming for popular endpoints
- **TTL Optimization**: Dynamic TTL based on data volatility
- **Memory Management**: Efficient memory allocation for cache layers

### **Disaster Recovery**

#### **Backup Strategy**

- **electrs Data**: Bitcoin Core handles blockchain data persistence
- **Cache Data**: Redis persistence with RDB snapshots
- **PostgreSQL**: Daily full backups with point-in-time recovery
- **Configuration**: Version-controlled configuration management

#### **Recovery Procedures**

- **RTO (Recovery Time Objective)**: <2 hours for full service restoration
- **RPO (Recovery Point Objective)**: <30 minutes for cache data
- **Automated Recovery**: Circuit breaker automatic recovery
- **Manual Recovery**: Documented procedures for cache and database restoration

### **Security Architecture**

#### **API Security**

- **Authentication**: API key management for external access
- **Rate Limiting**: Per-IP and per-API-key rate limiting
- **Input Validation**: Strict validation of all HTTP requests
- **HTTPS Only**: All communications encrypted with TLS 1.3

#### **Infrastructure Security**

- **Network Isolation**: Segmented networks with firewall rules
- **Access Control**: VPN-only administrative access
- **Monitoring**: Security event monitoring and alerting
- **Updates**: Automated security updates for all components
