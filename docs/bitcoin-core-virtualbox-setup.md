# Bitcoin Core VirtualBox Setup Guide

## Purpose
This guide documents the complete setup process for running Bitcoin Core inside a VirtualBox VM with shared folder access to an external drive for blockchain data storage.

## Overview
We configured Bitcoin Core to run in a Linux VM (Ubuntu LTS) with blockchain data stored on an external Windows drive (B:\) via VirtualBox shared folders. This approach keeps the VM lean while providing fast access to large blockchain data.

## Prerequisites
- VirtualBox 6.1+ installed on Windows host
- Linux VM (Ubuntu LTS recommended for stability)
- External drive with sufficient space (1TB+ recommended)
- Windows host with stable power settings

## Step 1: VirtualBox Shared Folder Configuration

### Create Shared Folder
1. In VirtualBox Manager, select your VM
2. Go to Settings → Shared Folders
3. Add new shared folder:
   - Folder Path: `B:\bitcoin-data`
   - Folder Name: `bitcoin-data`
   - Auto-mount: ✅ Enabled
   - Mount Point: `/media/sf_bitcoin-data`
   - Access: Full Access

### Mount Point Details
- **Host Path**: `B:\bitcoin-data`
- **VM Mount Point**: `/media/sf_bitcoin-data`
- **Type**: `vboxsf` (VirtualBox Shared Folder)

## Step 2: VM User Configuration

### Create Bitcoin User
```bash
# Create user with specific UID/GID for consistency
sudo useradd -m -u 1002 -g 1002 -s /bin/bash blocksight
sudo usermod -a -G sudo,users,developers blocksight
```

### Add to vboxsf Group
```bash
# Add user to VirtualBox shared folder group
sudo usermod -a -G vboxsf blocksight

# Verify group membership
groups blocksight
# Should show: blocksight sudo users vboxsf developers
```

### Verify Permissions
```bash
# Check shared folder access
ls -la /media/sf_bitcoin-data/

# If permission denied, fix ownership
sudo chown -R blocksight:blocksight /media/sf_bitcoin-data/
sudo chmod -R 755 /media/sf_bitcoin-data/
```

## Step 3: Bitcoin Core Build Configuration

### Install Dependencies
```bash
# Update package list
sudo apt update

# Install build dependencies
sudo apt install -y build-essential libtool autotools-dev automake pkg-config bsdmainutils python3
sudo apt install -y libevent-dev libboost-dev libsqlite3-dev libminiupnpc-dev
sudo apt install -y libzmq3-dev libqt5gui5 libqt5core5a libqt5dbus5 qttools5-dev qttools5-dev-tools
sudo apt install -y cmake git
```

### Clone and Build Bitcoin Core
```bash
# Clone main branch (note: this is a test version)
git clone https://github.com/bitcoin/bitcoin.git
cd bitcoin

# Build with specific configuration
cmake -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DENABLE_WALLET=OFF \
  -DENABLE_GUI=OFF \
  -DENABLE_ZMQ=ON \
  -DENABLE_IPC=ON \
  -DENABLE_RPC=ON

# Compile (adjust -j flag based on VM cores)
make -C build -j$(nproc)
```

### Install Binaries
```bash
# Make binaries available system-wide
sudo ln -sf /home/blocksight/bitcoin/build/bin/bitcoind /usr/local/bin/
sudo ln -sf /home/blocksight/bitcoin/build/bin/bitcoin-cli /usr/local/bin/

# Verify installation
which bitcoind
which bitcoin-cli
```

## Step 4: Configuration and Symlink Setup

### Create Bitcoin Configuration
```bash
# Create config directory in shared folder
mkdir -p /media/sf_bitcoin-data

# Create bitcoin.conf
cat > /media/sf_bitcoin-data/bitcoin.conf << 'EOF'
# Network configuration
networkactive=1
listen=1
bind=0.0.0.0
rpcbind=0.0.0.0
rpcallowip=0.0.0.0/0

# RPC configuration
server=1
rpcuser=your_rpc_user
rpcpassword=your_secure_password
rpcport=8332

# Data directory (shared folder)
datadir=/media/sf_bitcoin-data

# Performance settings
dbcache=450
maxorphantx=10
maxmempool=50
mempoolexpiry=72

# ZMQ notifications
zmqpubrawblock=tcp://0.0.0.0:28332
zmqpubrawtx=tcp://0.0.0.0:28333

# Logging
debug=rpc
debug=net
debug=tor
debug=mempool
debug=http
debug=bench
debug=zmq
debug=db
debug=qt
debug=selectcoins
debug=coindb
debug=reindex
debug=validation
debug=estimatefee
debug=addrman
debug=selectcoins
debug=reindex
debug=validation
debug=estimatefee
debug=addrman
debug=selectcoins
debug=reindex
debug=validation
debug=estimatefee
debug=addrman
EOF
```

### Create Symlink for Default Bitcoin Directory
```bash
# Remove default .bitcoin directory if it exists
rm -rf /home/blocksight/.bitcoin

# Create symlink to shared folder
ln -s /media/sf_bitcoin-data /home/blocksight/.bitcoin

# Verify symlink
ls -la /home/blocksight/.bitcoin
readlink -f /home/blocksight/.bitcoin
```

## Step 5: VM Network Configuration

### Get VM IP Address
```bash
# Get VM IP address
ip addr show | grep "inet " | grep -v 127.0.0.1

# Or use hostname
hostname -I
```

### Update bitcoin.conf with VM IP
```bash
# Edit bitcoin.conf to include VM IP
# Add these lines to your bitcoin.conf:
# bind=<VM_IP>
# rpcbind=<VM_IP>
# externalip=<VM_IP>
```

## Step 6: Starting Bitcoin Core

### First Run
```bash
# Start Bitcoin Core daemon
bitcoind -daemon

# Check status
bitcoin-cli getblockchaininfo

# Check if daemon is running
ps aux | grep bitcoind
```

### Monitor Logs
```bash
# Monitor debug log in real-time
tail -f /media/sf_bitcoin-data/debug.log

# Or monitor from symlinked location
tail -f /home/blocksight/.bitcoin/debug.log
```

## Step 7: Troubleshooting Common Issues

### Permission Issues
```bash
# If you get permission denied errors:
sudo chown -R blocksight:vboxsf /media/sf_bitcoin-data/
sudo chmod -R 775 /media/sf_bitcoin-data/

# Verify vboxsf group membership
groups blocksight
```

### Shared Folder Not Mounted
```bash
# Check mount status
mount | grep sf_bitcoin-data

# If not mounted, restart VM or check VirtualBox settings
```

### Build Issues
```bash
# If build fails, try with fewer cores
make -C build -j2

# Clean build directory if needed
rm -rf build
cmake -B build [options]
```

## Step 8: Windows Host Configuration

### Power Settings
- Set Power Plan to "High Performance"
- Disable "USB selective suspend"
- Disable hard disk sleep
- Prevent external drive power management

### Antivirus Exclusions
- Add `B:\bitcoin-data` to antivirus exclusions
- Exclude VirtualBox processes if needed

## Important Notes

### Version Considerations
- **Current**: Using main branch (test version)
- **Production**: Consider switching to v28.0+ branch for stability
- **Command to switch**: `git checkout v28.0` before building

### Performance Optimizations
- Keep VM memory allocation stable (8GB+ recommended)
- Use SSD for external drive when possible
- Monitor disk I/O during initial sync

### Security Considerations
- Change default RPC credentials
- Restrict RPC access to trusted IPs in production
- Use firewall rules to limit external access

## Verification Commands

```bash
# Check Bitcoin Core status
bitcoin-cli getblockchaininfo

# Verify shared folder access
ls -la /media/sf_bitcoin-data/

# Check symlink integrity
readlink -f /home/blocksight/.bitcoin

# Monitor blockchain sync progress
bitcoin-cli getblockchaininfo | jq '.blocks,.headers'

# Check log file access
tail -f /media/sf_bitcoin-data/debug.log
```

## Next Steps

After successful setup:
1. Wait for initial blockchain sync
2. Configure electrs for Electrum protocol support
3. Set up backend API to connect to Bitcoin Core
4. Implement monitoring and alerting

## Troubleshooting Checklist

- [ ] Shared folder mounted correctly
- [ ] User in vboxsf group
- [ ] Proper file permissions
- [ ] Symlink working correctly
- [ ] VM IP configured in bitcoin.conf
- [ ] Bitcoin Core daemon starting
- [ ] Log files accessible
- [ ] RPC responding

This guide captures our complete setup experience and should help recreate the environment or troubleshoot issues in the future.
