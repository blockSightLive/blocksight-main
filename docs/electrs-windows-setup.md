# Electrs Windows Setup Guide

## Purpose
This guide documents the complete setup process for running electrs on Windows, connecting to Bitcoin Core running in a VirtualBox VM, with blockchain data stored on an external drive.

## Overview
We configured electrs to run natively on Windows, connecting to Bitcoin Core running in a VirtualBox Ubuntu LTS VM via network. The electrs database is stored on the external drive (B:\) alongside Bitcoin Core data, providing fast access to both services.

## Prerequisites
- Windows 10/11 with stable power settings
- External drive (B:\) with sufficient space for electrs database
- Bitcoin Core running in VirtualBox VM (see `bitcoin-core-virtualbox-setup.md`)
- VM IP address accessible from Windows host
- Rust toolchain installed on Windows

## Step 1: Windows Environment Setup

### Install Rust Toolchain
```powershell
# Install Rust via rustup
winget install Rustlang.Rust.MSVC
# Or download from https://rustup.rs/

# Restart PowerShell after installation
# Verify installation
rustc --version
cargo --version
```

### Install Build Dependencies
```powershell
# Install Visual Studio Build Tools (if not already installed)
winget install Microsoft.VisualStudio.2022.BuildTools

# Install additional tools
winget install Microsoft.CMake
winget install Git.Git
```

## Step 2: Clone and Build Electrs

### Clone Repository
```powershell
# Navigate to user directory
cd C:\Users\PC

# Clone electrs repository
git clone https://github.com/romanz/electrs.git
cd electrs

# Verify the clone
ls
```

### Build Electrs
```powershell
# Build in release mode (optimized)
cargo build --locked --release

# Verify build output
ls target\release\electrs.exe
```

## Step 3: Configuration Setup

### Create Configuration Directory
```powershell
# Create config directory in user folder
mkdir C:\Users\PC\.electrs
cd C:\Users\PC\.electrs
```

### Create config.toml
```powershell
# Create configuration file
notepad config.toml
```

### Configuration Content
```toml
# Network configuration
network = "bitcoin"

# Database configuration
db_dir = "B:\\bitcoin-data\\electrs-db"

# Bitcoin Core connection
daemon_rpc_addr = "192.168.1.67:8332"
daemon_p2p_addr = "192.168.1.67:8333"
daemon_auth = "B:\\bitcoin-data\\.cookie"

# Electrum RPC server
electrum_rpc_addr = "0.0.0.0:50001"

# Monitoring and metrics
monitoring_addr = "127.0.0.1:4224"

# Performance settings
db_parallelism = 3
wait_duration = "10s"
jsonrpc_timeout = "15s"
index_batch_size = 10

# Indexing behavior
reindex_last_blocks = 0
auto_reindex = true
ignore_mempool = false
sync_once = false

# Server configuration
server_banner = "Welcome to electrs 0.10.10 (Electrum Rust Server)!"

# Signet magic bytes
signet_magic = "f9beb4d9"
```

### Important Configuration Notes
- **VM IP Address**: Replace `192.168.1.67` with your actual VM IP address
- **Cookie File**: Points to the `.cookie` file in your Bitcoin Core data directory
- **Database Path**: Creates database in `B:\bitcoin-data\electrs-db\bitcoin`
- **Network Access**: `0.0.0.0:50001` allows external connections to Electrum RPC

## Step 4: Database Directory Setup

### Create Database Directory
```powershell
# Create electrs database directory on external drive
mkdir "B:\bitcoin-data\electrs-db"
mkdir "B:\bitcoin-data\electrs-db\bitcoin"

# Verify directory creation
ls "B:\bitcoin-data\electrs-db"
```

### Verify Bitcoin Core Cookie
```powershell
# Check if .cookie file exists and is accessible
ls "B:\bitcoin-data\.cookie"

# Verify file permissions (should be readable)
Get-Acl "B:\bitcoin-data\.cookie"
```

## Step 5: Starting Electrs

### Basic Startup Command
```powershell
# Navigate to electrs directory
cd C:\Users\PC\electrs

# Start electrs with configuration
.\target\release\electrs.exe --conf C:\Users\PC\.electrs\config.toml
```

### Alternative Startup Methods

#### Method 1: Direct Path
```powershell
# Start from any location using full paths
C:\Users\PC\electrs\target\release\electrs.exe --conf C:\Users\PC\.electrs\config.toml
```

#### Method 2: Create Batch File
```powershell
# Create startup script
@"
@echo off
cd /d C:\Users\PC\electrs
.\target\release\electrs.exe --conf C:\Users\PC\.electrs\config.toml
pause
"@ | Out-File -FilePath "C:\Users\PC\start-electrs.bat" -Encoding ASCII

# Run the batch file
.\start-electrs.bat
```

#### Method 3: PowerShell Script
```powershell
# Create PowerShell startup script
@"
Set-Location "C:\Users\PC\electrs"
& ".\target\release\electrs.exe" --conf "C:\Users\PC\.electrs\config.toml"
"@ | Out-File -FilePath "C:\Users\PC\start-electrs.ps1" -Encoding UTF8

# Run the PowerShell script
.\start-electrs.ps1
```

## Step 6: Verification and Monitoring

### Check Service Status
```powershell
# Verify electrs is running
Get-Process electrs -ErrorAction SilentlyContinue

# Check listening ports
netstat -an | findstr "50001"
netstat -an | findstr "4224"
```

### Monitor Logs
The startup output shows:
- Database loading progress
- Chain synchronization status
- Network connectivity
- Service endpoints

### Access Metrics
```powershell
# Access Prometheus metrics (if needed)
Invoke-WebRequest -Uri "http://127.0.0.1:4224/metrics"
```

## Step 7: Troubleshooting Common Issues

### Connection Issues
```powershell
# Test VM connectivity
Test-NetConnection -ComputerName "192.168.1.67" -Port 8332

# Check firewall rules
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*electrs*"}
```

### Permission Issues
```powershell
# Check file permissions
Get-Acl "B:\bitcoin-data\.cookie"
Get-Acl "B:\bitcoin-data\electrs-db"

# Fix permissions if needed
icacls "B:\bitcoin-data\.cookie" /grant "Users:(R)"
icacls "B:\bitcoin-data\electrs-db" /grant "Users:(F)"
```

### Database Issues
```powershell
# Check database directory
ls "B:\bitcoin-data\electrs-db\bitcoin"

# Verify disk space
Get-WmiObject -Class Win32_LogicalDisk | Where-Object {$_.DeviceID -eq "B:"} | Select-Object Size,FreeSpace
```

## Step 8: Windows Host Optimization

### Power Settings
- Set Power Plan to "High Performance"
- Disable "USB selective suspend"
- Disable hard disk sleep
- Prevent external drive power management

### Antivirus Exclusions
- Add `B:\bitcoin-data\electrs-db` to antivirus exclusions
- Exclude electrs.exe from real-time scanning
- Add Windows Defender exclusions if needed

### Firewall Configuration
```powershell
# Allow electrs through Windows Firewall
New-NetFirewallRule -DisplayName "Electrs 50001" -Direction Inbound -Protocol TCP -LocalPort 50001 -Action Allow

# Allow monitoring port
New-NetFirewallRule -DisplayName "Electrs 4224" -Direction Inbound -Protocol TCP -LocalPort 4224 -Action Allow
```

## Important Notes

### Version Information
- **Current**: electrs 0.10.10
- **Build**: x86_64 Windows native
- **Database**: RocksDB with automatic compaction

### Performance Characteristics
- **Initial Indexing**: Processes all blocks from genesis
- **Compaction**: Automatically compacts database after indexing
- **Memory Usage**: Varies based on `db_parallelism` setting
- **Disk I/O**: Heavy during initial sync, moderate during operation

### Network Configuration
- **Electrum RPC**: TCP 50001 (accessible from external)
- **Monitoring**: TCP 4224 (localhost only)
- **Bitcoin Core**: TCP 8332 (VM IP)

## Verification Commands

```powershell
# Check electrs process
Get-Process electrs

# Verify network connectivity
Test-NetConnection -ComputerName "192.168.1.67" -Port 8332

# Check database directory
ls "B:\bitcoin-data\electrs-db\bitcoin"

# Monitor startup logs
.\target\release\electrs.exe --conf C:\Users\PC\.electrs\config.toml
```

## Next Steps

After successful setup:
1. Wait for initial blockchain indexing to complete
2. Monitor database compaction progress
3. Test Electrum client connections
4. Set up backend API integration
5. Implement monitoring and alerting

## Troubleshooting Checklist

- [ ] Rust toolchain installed and working
- [ ] electrs built successfully
- [ ] Configuration file created and valid
- [ ] Database directory accessible
- [ ] Bitcoin Core cookie file readable
- [ ] VM IP address correct and accessible
- [ ] Firewall rules configured
- [ ] electrs starting without errors
- [ ] Database indexing progressing
- [ ] External connections working

## Startup Command Summary

**Primary Command:**
```powershell
cd C:\Users\PC\electrs
.\target\release\electrs.exe --conf C:\Users\PC\.electrs\config.toml
```

**Alternative (from any location):**
```powershell
C:\Users\PC\electrs\target\release\electrs.exe --conf C:\Users\PC\.electrs\config.toml
```

This guide captures our complete electrs setup experience on Windows and should help recreate the environment or troubleshoot issues in the future.
