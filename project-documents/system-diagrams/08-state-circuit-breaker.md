# BlockSight.live - State Diagram: Circuit Breaker

/**
 * @fileoverview State diagram showing the circuit breaker pattern implementation in BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows the circuit breaker state machine for handling failures and recovery
 * in BlockSight.live, including automatic failover and health monitoring. It reflects our
 * current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding circuit breaker failure handling and recovery
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS-specific circuit breakers when implemented
 * - Update with new failure scenarios as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows failure recovery patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This State Diagram shows the circuit breaker pattern implementation in BlockSight.live for handling failures and recovery, including automatic failover and health monitoring. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Circuit Breaker State Machine ✅ **IMPLEMENTED**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CIRCUIT BREAKER STATES                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │     CLOSED      │    │     OPEN        │    │     HALF-OPEN                │ │
│  │                 │    │                 │    │                              │ │
│  │                 │    │                 │    │                              │ │
│  │ • Normal        │    │ • Failures      │    │ • Testing                    │ │
│  │   Operation     │    │   Detected      │    │   Recovery                   │ │
│  │ • Requests      │    │ • Circuit       │    │ • Limited                    │ │
│  │   Processed     │    │   Open          │    │   Requests                   │ │
│  │ • Success       │    │ • Fast Fail     │    │ • Health                     │ │
│  │   Monitoring    │    │   Responses     │    │   Probing                    │ │
│  │ • Error         │    │ • Timeout       │    │ • Gradual                    │ │
│  │   Counting      │    │   Protection    │    │   Restoration                │ │
│  │ • Threshold     │    │ • Alerting      │    │ • Circuit                    │ │
│  │   Tracking      │    │   Active        │    │   Reopening                  │ │
│  │ • Health        │    │ • Recovery      │    │ • Failure                    │ │
│  │   Checks        │    │   Timer         │    │   Monitoring                 │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              STATE TRANSITIONS                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Error         │    │   Timeout       │    │   Success              │  │ │
│  │  │   Threshold     │    │   Expired       │    │   Threshold            │  │ │
│  │  │   Exceeded      │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Failure       │    │ • Recovery      │    │ • Circuit              │  │ │
│  │  │   Count > Limit │    │   Timer         │    │   Closed               │  │ │
│  │  │ • Circuit       │    │   Completed     │    │ • Normal               │  │ │
│  │  │   Opens         │    │ • Circuit       │    │   Operation            │  │ │
│  │  │ • Fast Fail     │    │   Half-Open     │    │ • Full                 │  │ │
│  │  │   Mode          │    │ • Limited       │    │   Recovery             │  │ │
│  │  │ • Alerting      │    │   Testing       │    │ • Health               │  │ │
│  │  │   Activated     │    │ • Health        │    │   Monitoring           │  │ │
│  │  │ • Recovery      │    │   Probing       │    │ • Error                │  │ │
│  │  │   Timer         │    │ • Gradual       │    │   Reset                │  │ │
│  │  │   Started       │    │   Restoration   │    │ • Success              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FAILURE SCENARIOS                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Network       │    │   Service       │    │   Performance          │  │ │
│  │  │   Failures      │    │   Failures      │    │   Degradation          │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Connection    │    │ • electrs       │    │ • High Latency         │  │ │
│  │  │   Timeouts      │    │   Unavailable   │    │ • Slow Response        │  │ │
│  │  │ • DNS           │    │ • Bitcoin Core  │    │ • Resource             │  │ │
│  │  │   Resolution    │    │   RPC Errors    │    │   Exhaustion           │  │ │
│  │  │ • Network       │    │ • Adapter       │    │ • Memory               │  │ │
│  │  │   Partitioning  │    │   Crashes       │    │   Pressure             │  │ │
│  │  │ • Firewall      │    │ • Database      │    │ • CPU                  │  │ │
│  │  │   Blocking      │    │   Connection    │    │   Overload             │  │ │
│  │  │ • Load          │    │   Failures      │    │ • Cache                │  │ │
│  │  │   Balancer      │    │ • Cache         │    │   Misses               │  │ │
│  │  │   Issues        │    │   Corruption    │    │ • Queue                │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## State Descriptions

### 1. CLOSED State ✅ **IMPLEMENTED**
- **Normal Operation**: System processes requests normally
- **Success Monitoring**: Tracks successful operations and error rates
- **Threshold Tracking**: Monitors failure count against configured limits
- **Health Checks**: Continuous health monitoring and performance tracking
- **Error Counting**: Incremental error tracking with automatic reset on success

### 2. OPEN State ✅ **IMPLEMENTED**
- **Failure Detected**: Circuit breaker opens when error threshold exceeded
- **Fast Fail Responses**: Immediate failure responses without backend calls
- **Timeout Protection**: Prevents cascading failures and resource exhaustion
- **Alerting Active**: Notifications and metrics for failure conditions
- **Recovery Timer**: Automatic timer for circuit breaker recovery attempts

### 3. HALF-OPEN State ✅ **IMPLEMENTED**
- **Recovery Testing**: Limited request processing to test system health
- **Health Probing**: Gradual restoration with health monitoring
- **Limited Throughput**: Controlled request volume during recovery
- **Failure Monitoring**: Continuous monitoring for failure recurrence
- **Circuit Reopening**: Automatic transition back to CLOSED on success

## State Transitions

### CLOSED → OPEN ✅ **IMPLEMENTED**
- **Trigger**: Error threshold exceeded (configurable failure count)
- **Action**: Circuit breaker opens, fast fail mode activated
- **Result**: Immediate failure responses, backend protection
- **Monitoring**: Alerting activated, recovery timer started

### OPEN → HALF-OPEN ✅ **IMPLEMENTED**
- **Trigger**: Recovery timeout completed (configurable duration)
- **Action**: Circuit breaker transitions to half-open state
- **Result**: Limited request processing for health testing
- **Monitoring**: Health probing with controlled throughput

### HALF-OPEN → CLOSED ✅ **IMPLEMENTED**
- **Trigger**: Success threshold reached (configurable success count)
- **Action**: Circuit breaker closes, normal operation resumes
- **Result**: Full request processing restored
- **Monitoring**: Normal health monitoring resumed

### HALF-OPEN → OPEN ✅ **IMPLEMENTED**
- **Trigger**: Failure detected during recovery testing
- **Action**: Circuit breaker reopens, fast fail mode reactivated
- **Result**: Recovery attempt failed, extended timeout
- **Monitoring**: Extended recovery timer with failure logging

## Failure Scenarios

### Network Failures ✅ **IMPLEMENTED**
- **Connection Timeouts**: TCP connection failures and timeouts
- **DNS Resolution**: Domain name resolution failures
- **Network Partitioning**: Network connectivity issues
- **Firewall Blocking**: Security policy blocking connections
- **Load Balancer Issues**: Load balancer failures and misconfigurations

### Service Failures ✅ **IMPLEMENTED**
- **electrs Unavailable**: Electrum server service failures
- **Bitcoin Core RPC Errors**: Core RPC service failures
- **Adapter Crashes**: Backend adapter service crashes
- **Database Connection Failures**: Database connectivity issues
- **Cache Corruption**: Cache data corruption and failures

### Performance Degradation ✅ **IMPLEMENTED**
- **High Latency**: Response time degradation
- **Slow Response**: Service performance degradation
- **Resource Exhaustion**: Memory and CPU pressure
- **Cache Misses**: Cache performance degradation
- **Queue Backlog**: Request queue buildup

## Implementation Features

### Configuration ✅ **IMPLEMENTED**
- **Error Thresholds**: Configurable failure count limits
- **Timeout Values**: Configurable recovery timeouts
- **Success Thresholds**: Configurable success count for recovery
- **Monitoring Intervals**: Configurable health check frequencies

### Monitoring ✅ **IMPLEMENTED**
- **Metrics Collection**: Prometheus metrics for circuit breaker states
- **Alerting**: Automated alerts for failure conditions
- **Logging**: Comprehensive logging of state transitions
- **Health Checks**: Continuous health monitoring and reporting

### Recovery Strategies ✅ **IMPLEMENTED**
- **Automatic Recovery**: Self-healing with configurable timeouts
- **Gradual Restoration**: Controlled throughput during recovery
- **Health Probing**: Continuous health monitoring during recovery
- **Failure Prevention**: Automatic circuit reopening on success

## Current Implementation Status

### ✅ **COMPLETED FEATURES**
- **State Machine**: Complete circuit breaker state machine implementation
- **Failure Detection**: Comprehensive failure scenario handling
- **Recovery Logic**: Automatic recovery with health monitoring
- **Monitoring**: Prometheus metrics and alerting integration
- **Configuration**: Configurable thresholds and timeouts

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Integration**: Circuit breakers for 3D visualization components
- **Enhanced Monitoring**: Additional failure scenarios and recovery strategies
- **Advanced Alerting**: Intelligent alerting with failure pattern recognition
- **Performance Optimization**: Circuit breaker performance tuning and optimization

