# 🌍 BlockSight.live Environment Setup Guide

**Document Type:** Environment Configuration Guide  
**Version:** 1.0.0  
**Created:** 2025-08-30  
**Status:** Active Development  
**Last Modified:** 2025-08-30

---

## 🎯 **PURPOSE**

This guide provides comprehensive instructions for setting up the BlockSight.live development and production environments, including all required environment variables, Docker configuration, and service connection details.

---

## 🚀 **QUICK START**

### **Prerequisites**
- **Node.js**: 18+ (LTS recommended)
- **Docker**: 20.10+ with Docker Compose
- **Git**: Latest version
- **Windows**: WSL2 recommended for Linux compatibility

### **One-Command Setup**
```bash
# Clone and setup
git clone <repository-url>
cd blocksight-main
docker-compose -f docker-compose.dev.yml up -d
```

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Backend Environment Variables**

#### **Core Configuration**
```bash
# Server Configuration
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

#### **Electrum Configuration**
```bash
# Electrum Server Connection
ELECTRUM_ENABLED=true
ELECTRUM_HOST=host.docker.internal
ELECTRUM_PORT=50001
ELECTRUM_TLS=false
ELECTRUM_TIMEOUT=30000
ELECTRUM_RETRY_ATTEMPTS=3
```

#### **Bitcoin Core Configuration**
```bash
# Bitcoin Core RPC Connection
CORE_RPC_URL=http://192.168.1.67:8332
CORE_RPC_USERNAME=rpcuser
CORE_RPC_PASSWORD=rpcpassword
CORE_RPC_TIMEOUT=30000
CORE_RPC_RETRY_ATTEMPTS=3
```

#### **Cache Configuration**
```bash
# Redis Configuration
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache TTL Settings
CACHE_TTL_L1=2        # Redis L1: 2 seconds
CACHE_TTL_L2=30       # Memory-mapped L2: 30 seconds
CACHE_TTL_L3=300      # HTTP L3: 5 minutes
```

#### **Database Configuration**
```bash
# PostgreSQL Configuration
POSTGRES_URL=postgresql://postgres:password@postgres:5432/blocksight
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=blocksight
```

### **Frontend Environment Variables**

#### **Development Configuration**
```bash
# Development Server
VITE_DEV_SERVER_PORT=3000
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_METRICS=true
VITE_ENABLE_ANALYTICS=false
```

#### **Production Configuration**
```bash
# Production API
VITE_API_BASE_URL=https://api.blocksight.live
VITE_WS_URL=wss://api.blocksight.live

# Performance
VITE_ENABLE_DEBUG=false
VITE_ENABLE_METRICS=true
VITE_ENABLE_ANALYTICS=true
```

---

## 🐳 **DOCKER CONFIGURATION**

### **Development Environment**

#### **docker-compose.dev.yml**
```yaml
version: '3.8'

services:
  # Backend Service
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - PORT=8000
      - CORS_ORIGIN=http://localhost:3000
      - ELECTRUM_HOST=host.docker.internal
      - ELECTRUM_PORT=50001
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./backend:/app/backend
      - /app/backend/node_modules
    depends_on:
      - redis
      - postgres

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=blocksight
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  redis_data:
  postgres_data:
```

#### **Production Environment**

#### **docker-compose.stack.yml**
```yaml
version: '3.8'

services:
  # Backend Service
  backend:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - PORT=8000
      - CORS_ORIGIN=https://blocksight.live
      - ELECTRUM_HOST=electrs
      - ELECTRUM_PORT=50001
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - postgres
      - electrs

  # Redis Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=blocksight
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Electrum Server
  electrs:
    build:
      context: ./electrs
      dockerfile: Dockerfile
    volumes:
      - electrs_data:/data
      - bitcoin_data:/bitcoin
    environment:
      - ELECTRS_NETWORK=bitcoin
      - ELECTRS_DB_DIR=/data
      - ELECTRS_DAEMON_RPC_ADDR=bitcoin-core:8332
      - ELECTRS_DAEMON_P2P_ADDR=bitcoin-core:8333

volumes:
  redis_data:
  postgres_data:
  electrs_data:
  bitcoin_data:
```

### **Dockerfile Configuration**

#### **Multi-Stage Dockerfile**
```dockerfile
# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
```

---

## 🔌 **SERVICE CONNECTION DETAILS**

### **Electrum Server Connection**

#### **Local Development**
- **Host**: `host.docker.internal` (Docker Desktop)
- **Port**: `50001`
- **Protocol**: TCP (non-TLS)
- **Connection Pool**: 5-10 connections
- **Timeout**: 30 seconds
- **Retry Logic**: 3 attempts with exponential backoff

#### **Production**
- **Host**: `electrs` (Docker service)
- **Port**: `50001`
- **Protocol**: TCP (non-TLS)
- **Load Balancing**: Round-robin across multiple instances
- **Health Checks**: Every 30 seconds

### **Bitcoin Core RPC Connection**

#### **Development Environment**
- **Host**: `192.168.1.67` (VirtualBox VM)
- **Port**: `8332`
- **Protocol**: HTTP
- **Authentication**: Basic auth with username/password
- **Timeout**: 30 seconds
- **Circuit Breaker**: 5 failures triggers fallback

#### **Production Environment**
- **Host**: `bitcoin-core` (Docker service)
- **Port**: `8332`
- **Protocol**: HTTP
- **Authentication**: Cookie-based authentication
- **Load Balancing**: Active/standby configuration

### **Database Connections**

#### **Redis Cache**
- **Host**: `redis` (Docker service)
- **Port**: `6379`
- **Protocol**: Redis
- **Authentication**: None (development), Password (production)
- **Connection Pool**: 10-20 connections
- **Health Checks**: Every 10 seconds

#### **PostgreSQL**
- **Host**: `postgres` (Docker service)
- **Port**: `5432`
- **Protocol**: PostgreSQL
- **Authentication**: Username/password
- **Connection Pool**: 5-15 connections
- **Health Checks**: Every 30 seconds

---

## 🚨 **TROUBLESHOOTING**

### **Common Connection Issues**

#### **Electrum Connection Failed**
```bash
# Check if electrs is running
docker ps | grep electrs

# Check electrs logs
docker logs electrs

# Test connection manually
telnet host.docker.internal 50001
```

#### **Bitcoin Core RPC Failed**
```bash
# Check VM status
ping 192.168.1.67

# Test RPC connection
curl -u rpcuser:rpcpassword \
  -d '{"jsonrpc":"1.0","method":"getblockcount","params":[],"id":1}' \
  http://192.168.1.67:8332
```

#### **Redis Connection Failed**
```bash
# Check Redis container
docker ps | grep redis

# Test Redis connection
docker exec -it redis redis-cli ping

# Check Redis logs
docker logs redis
```

#### **PostgreSQL Connection Failed**
```bash
# Check PostgreSQL container
docker ps | grep postgres

# Test database connection
docker exec -it postgres psql -U postgres -d blocksight

# Check PostgreSQL logs
docker logs postgres
```

### **Environment Variable Issues**

#### **Missing Variables**
```bash
# Check environment file
cat .env

# Verify required variables
npm run validate-env

# Set missing variables
export MISSING_VAR=value
```

#### **Incorrect Values**
```bash
# Validate environment configuration
npm run check-config

# Test connections
npm run test-connections

# Debug configuration
npm run debug-config
```

---

## 🔒 **SECURITY CONSIDERATIONS**

### **Development Environment**
- **No sensitive data** in environment files
- **Local-only access** for development services
- **Default passwords** for local development
- **No external exposure** of development services

### **Production Environment**
- **Environment variables** stored securely (AWS Secrets Manager, etc.)
- **Strong passwords** for all services
- **Network isolation** with private subnets
- **SSL/TLS encryption** for all external connections
- **Access control** with proper authentication and authorization

### **Secrets Management**
```bash
# Never commit secrets to version control
echo ".env" >> .gitignore
echo "*.env" >> .gitignore

# Use environment-specific files
.env.development
.env.production
.env.local
```

---

## 📊 **MONITORING & HEALTH CHECKS**

### **Health Check Endpoints**
```bash
# Overall system health
GET /api/v1/network/health

# Individual service health
GET /api/v1/electrum/health
GET /api/v1/core/height

# Database health
GET /health/db
GET /health/redis
```

### **Monitoring Metrics**
- **Connection status** for all services
- **Response times** for external calls
- **Error rates** and failure patterns
- **Resource usage** (CPU, memory, disk)
- **Network latency** between services

---

## 📚 **RELATED DOCUMENTATION**

### **Configuration Files**
- **[Vite Configuration](frontend/README.md#development-server-configuration)** - Frontend proxy setup
- **[Docker Configuration](infrastructure/docker.md)** - Container orchestration
- **[API Configuration](API-ENDPOINTS.md)** - API endpoint configuration

### **System Architecture**
- **[Model Specification](../project-documents/00-model-spec.md)** - System overview
- **[Technical Implementation](../project-documents/02-technical-implementation.md)** - Technical details
- **[System Diagrams](../project-documents/system-diagrams/)** - Visual architecture

---

**Maintainer:** Development Team  
**Last Review:** 2025-08-30  
**Next Review:** 2025-08-31
