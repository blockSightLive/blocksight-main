# Electrs on WSL2 (Kali) – Stability & Resumability Runbook [HISTORICAL]

This runbook makes electrs indexing stable on WSL2 while keeping Bitcoin Core data on your existing Windows B: drive. It avoids repartitioning and uses an ext4 loopback volume for electrs’ RocksDB, which is more reliable than NTFS under heavy I/O.

Last updated: 2025-08-14

> **Note**: This document describes the previous WSL2/Kali setup. The current production setup uses **VirtualBox Ubuntu LTS VM** with shared folder access to external drive. See `docs/install-notes.md` for current configuration.

## Symptoms we’re fixing
- WSL distro exits/crashes during heavy electrs indexing
- electrs seemingly restarts from block 1 after unclean exits

## Why this happens
- NTFS over drvfs (`/mnt/b`) is slower and more failure‑prone for heavy random I/O
- Unclean termination prevents consistent RocksDB checkpoints, so electrs may reindex
- Windows power/USB settings can suspend external drives when the PC idles

## High‑level solution
1) Keep Bitcoin Core data on B: as-is
2) Move only electrs DB to a fast ext4 filesystem (loopback volume inside the VM) — or place it directly on the WSL2 distro’s native ext4 (e.g., `/home/<user>/electrs-db`) which also works well
3) Run electrs with controlled time‑boxed sessions that end with a clean SIGINT
4) Harden Windows power settings and raise file descriptor limits

---

## A) One-time preparation

1) Stop services cleanly (inside Kali)
```bash
# Stop electrs (Ctrl+C if running), then stop Core
bitcoin-cli stop || true
```

2) Create an ext4 loopback volume for electrs DB
```bash
# Create a sparse 200GB file (adjust size to your needs)
dd if=/dev/zero of=~/electrs.ext4 bs=1M count=0 seek=200000
mkfs.ext4 -F ~/electrs.ext4

sudo mkdir -p /mnt/electrsdb
sudo mount -o loop ~/electrs.ext4 /mnt/electrsdb
sudo chown -R $USER:$USER /mnt/electrsdb
```

Alternative (no loopback): use native ext4 under your home
```bash
mkdir -p ~/electrs-db
# Use this as the base directory (db_dir) in config.toml; electrs will append the
# network name (e.g., "bitcoin") automatically
```

3) Copy existing electrs DB from B: to ext4 (if any)
```bash
# Copy preserving attributes; adjust source if your path differs
rsync -a --info=progress2 /mnt/b/electrs-data/bitcoin/ /mnt/electrsdb/bitcoin/
```

4) Update your electrs `config.toml`
```toml
# Keep your existing cookie_file pointing to Core on B:
cookie_file = "/mnt/b/bitcoin-data/.cookie"

# Point DB to ext4 (inside Kali). IMPORTANT: db_dir is the BASE directory.
# Electrs will create/use a network subfolder under it (e.g., "bitcoin").
# EITHER loopback mount base dir
# db_dir = "/mnt/electrsdb"
# OR native ext4 under home (confirmed working fix)
# db_dir = "/home/<user>/electrs-db"

# Stability-first throttling during initial sync
db_parallelism = 1
ignore_mempool = true
jsonrpc_timeout = "60s"
reindex_last_blocks = 1000
index_batch_size = 500
```

5) Make the mount persistent (optional but recommended)
```bash
echo "/home/$USER/electrs.ext4 /mnt/electrsdb ext4 loop,defaults,discard 0 0" | sudo tee -a /etc/fstab
sudo umount /mnt/electrsdb
sudo mount -a
```

6) Windows power & USB stability
- Power plan: High performance
- Disable sleep/hibernate while plugged in
- Set “Turn off hard disk after” to Never
- Disable “USB selective suspend”
- In Device Manager → USB Root Hub(s) → Power Management → uncheck “Allow the computer to turn off…”
- Add antivirus exclusion for your electrs DB path (`/mnt/electrsdb/bitcoin`)

---

## B) Running electrs safely

There are two ways to run electrs with clean periodic exits. The loop is preferred.

1) One-shot (runs ~25 minutes, exits cleanly)
```bash
ulimit -n 8192 && \
nice -n 10 ionice -c2 -n7 \
timeout --signal=INT 1500 ./target/release/electrs --conf config.toml
```

2) Continuous loop (auto restarts after each clean exit)
```bash
while true; do
  ulimit -n 8192
  nice -n 10 ionice -c2 -n7 timeout --signal=INT 1500 \
    ./target/release/electrs --conf config.toml
  sleep 30
done
```
- Start/Stop: Press Ctrl+C once to terminate the loop; it will finish the current electrs run or stop between restarts.
- Optional: run inside tmux so it continues if your terminal closes:
  - `tmux new -s electrs`
  - run the loop (or the foreground command below) and optionally capture logs
  - detach: Ctrl+B then D; reattach later with `tmux attach -t electrs`

Recommended foreground command with logs (no timeout, in tmux once DB is on ext4)
```bash
ulimit -n 16384
RUST_LOG=info nice -n 10 ionice -c2 -n7 \
  ./target/release/electrs --conf config.toml 2>&1 | tee -a ~/electrs.log
```

3) Start Bitcoin Core first, then electrs
```bash
# Start Core normally (your usual method)
# When Core RPC is ready, start electrs using 1) or 2)
```

When you reach near tip and the VM is stable, you can remove the loop (use the one‑shot without timeout) and set `ignore_mempool = false`.

---

## C) Verifying resumability
- On startup, electrs should log your ext4 DB path and not fall back to `/mnt/b/...`
- db_dir is the base. The effective db_path will be `<db_dir>/<network>` (e.g., `/mnt/electrsdb/bitcoin`).
- If it still starts from `[1..2000]` after you moved to ext4, it’s likely performing a controlled reindex due to an earlier inconsistent state. Subsequent clean exits should resume.
- If it repeatedly reindexes from 1:
  - Confirm `db_dir` points to the base dir (e.g., `/mnt/electrsdb`), and `db_path` resolves to `/mnt/electrsdb/bitcoin`
  - Ensure the ext4 volume is mounted (check `mount | grep electrsdb`)
  - Inspect logs for corruption messages

---

### Fixing an accidental nested path: `/mnt/electrsdb/bitcoin/bitcoin`

If your logs show `db_path: "/mnt/electrsdb/bitcoin/bitcoin"`, it means `db_dir` was set to `/mnt/electrsdb/bitcoin` (already including the network), and electrs appended another `bitcoin` subfolder. To fix without reindexing:

```bash
# 1) Stop electrs (Ctrl+C in tmux) and ensure it is not running
pgrep electrs && kill -INT $(pgrep electrs) || true
sleep 5; pgrep electrs && kill -9 $(pgrep electrs) || true

# 2) Move the inner folder up one level
mv /mnt/electrsdb/bitcoin/bitcoin /mnt/electrsdb/bitcoin.tmp
rm -rf /mnt/electrsdb/bitcoin
mv /mnt/electrsdb/bitcoin.tmp /mnt/electrsdb/bitcoin

# 3) Edit config.toml to set the base directory only
# db_dir = "/mnt/electrsdb"

# 4) Start electrs again (prefer tmux)
```

Reference: electrs treats `db_dir` as a base directory and appends the network subfolder. See electrs usage documentation.

## D) Optional advanced: physical ext4 via `wsl --mount`
Only if you have an unused partition you can format as ext4. This avoids loopback but requires disk changes.

1) Identify disks (PowerShell, Admin)
```powershell
wsl --list --disks
```
2) Mount an ext4 partition (example):
```powershell
wsl --mount <DiskPath> --partition <Index> --type ext4
```
3) Inside Kali, the mount appears under `/mnt/wsl/PHYSICALDRIVE…/…`. Point `db_dir` there.

Prefer the loopback approach unless you are comfortable partitioning.

---

## E) Diagnostics if crashes persist
```bash
dmesg -T | tail -n 200 | grep -i -E 'oom|killed|out of memory'
grep -i electrs /var/log/syslog 2>/dev/null | tail -n 200
ulimit -n
df -h
mount | grep -E 'electrsdb|wsl'
vmstat 1
sudo iotop -oPa
```

If you still see instability, share the above outputs and the first 100 lines of electrs logs after startup.


---

## F) Known issue and fix: RocksDB corruption during compaction

If electrs panics with an error like:

```
DB::put failed: Error { message: "Corruption: Compaction sees out-of-order keys." }
```

This usually means the RocksDB index copied from NTFS (or interrupted previously) is inconsistent. The simplest, safest remedy is to rebuild the index fully on ext4.

Steps (inside Kali):

```bash
# 1) Stop electrs (Ctrl+C in tmux). If needed, kill it:
pgrep -alf electrs && kill -INT $(pgrep electrs) || true
sleep 5
pgrep electrs && kill -9 $(pgrep electrs) || true

# 2) Backup the corrupted DB and start fresh on ext4
mv /home/$USER/electrs-db/bitcoin /home/$USER/electrs-db/bitcoin.bad.$(date +%s) || true
mkdir -p /home/$USER/electrs-db/bitcoin

# 3) Ensure config.toml points to the ext4 path
# db_dir = "/home/<user>/electrs-db/bitcoin"

# 4) Start electrs in tmux with gentle settings
tmux new -s electrs -d \
  "ulimit -n 16384; RUST_LOG=info nice -n 10 ionice -c2 -n7 \
   ./target/release/electrs --conf config.toml 2>&1 | tee -a ~/electrs.log"

# 5) Monitor compaction/indexing progress
watch -n 60 "curl -s http://127.0.0.1:4224/metrics | egrep 'pending-compaction-bytes|num-running-compactions|live-sst-files-size'"
```

Recommended config for rebuild on modest hardware:

```toml
db_parallelism = 2
ignore_mempool = true
reindex_last_blocks = 100
index_batch_size = 250
jsonrpc_timeout = "60s"
```

Notes:
- Rebuilding on ext4 avoids NTFS/DrvFs stalls. Expect CPU ~40–60% and DB size to grow then stabilize as compaction completes.
- Once stable and caught up to tip, you can remove the tmux loop/timeout and, if desired, enable mempool (`ignore_mempool = false`).

---

## G) What worked in practice (confirmed)

- Moving the electrs DB from the Windows-mounted B: drive (NTFS via `/mnt/b`) to the WSL2 distro’s native ext4 under the home directory (e.g., `/home/<user>/electrs-db/bitcoin`).
- Running electrs inside `tmux` and capturing logs with `tee`.
- After the move, compaction proceeded; if the DB was copied from NTFS and later panicked with "Compaction sees out-of-order keys", a clean rebuild on ext4 fixed it.

Bitcoin Core’s data can remain on B: (NTFS). Only the electrs RocksDB index must be on ext4 for stability and performance under heavy I/O on WSL2.

---

## H) Migrate Bitcoin Core datadir from NTFS (drvfs) to ext4 (two safe methods)

Why: Keeping Core on NTFS is convenient, but drvfs can introduce latency and stalls under heavy load. Moving Core’s datadir to ext4 inside WSL2 improves stability and I/O. This section shows two approaches and exact commands.

Pre-checks (inside Kali)
```bash
df -h
lsblk -f
uname -a
```

Decide target location:
- Either expand the distro’s main ext4 disk and store data under `/home/<user>/bitcoin-data`
- Or create/mount a dedicated ext4 volume at `/mnt/bitcoindata`

Important
- Stop Core and ensure clean shutdown before copying.
- Copy with rsync; Bitcoin Core will verify on startup. A clean copy does not corrupt data.
- Update `bitcoin.conf` (`datadir=`) and electrs `cookie_file` accordingly.

### Method 1: Expand WSL2 ext4.vhdx (beyond 1 TB) and use home directory

This grows the distro’s main virtual disk. It supports multi‑TB sizes as long as your Windows filesystem has space.

1) Stop WSL
```powershell
# Windows PowerShell (Admin)
wsl --shutdown
```

2) Expand the virtual disk (ext4.vhdx)
```powershell
# Find the file (example path; adjust for your distro name)
# Microsoft Store distros typically live here:
# C:\Users\<You>\AppData\Local\Packages\KaliLinux.54290C8133FEE_\LocalState\ext4.vhdx

# Expand to ~2 TB (value is in MB)
diskpart
select vdisk file="C:\\Users\\<You>\\AppData\\Local\\Packages\\<YourDistro>\\LocalState\\ext4.vhdx"
expand vdisk maximum=2048000
exit
```

3) Grow the filesystem (inside Kali)
```bash
# Start Kali again, then:
sudo resize2fs /
df -h | grep -E "\s/$"  # root filesystem now larger
```

4) Prepare target dir and copy data
```bash
mkdir -p /home/$USER/bitcoin-data

# Stop services cleanly
bitcoin-cli stop || true

# Copy 885GB safely with progress; path on NTFS may differ
rsync -a --info=progress2 /mnt/b/bitcoin-data/ /home/$USER/bitcoin-data/

# Optional: quick validation (sizes)
du -sh /mnt/b/bitcoin-data /home/$USER/bitcoin-data
```

5) Switch configs
```bash
# Update bitcoin.conf (usually under /home/$USER/.bitcoin/bitcoin.conf)
# Add or change:
# datadir=/home/<user>/bitcoin-data

# Update electrs config.toml
# cookie_file = "/home/<user>/bitcoin-data/.cookie"

# Start Core and confirm it reads the new datadir
bitcoind -daemon
bitcoin-cli getblockchaininfo | jq '.chain,.blocks'
```

6) Clean up (optional)
```bash
# After a day of stable operation, you may archive or delete the old NTFS copy
# rm -rf /mnt/b/bitcoin-data  # Only when you are 100% confident
```

Pros: Single filesystem to manage; simplest run‑time pathing. Cons: Grows the main WSL image file.

### Method 2: Dedicated ext4 volume for Core (loopback VHD file)

This isolates Core’s data onto its own ext4 volume that you can size independently (e.g., 1.5–2 TB).

1) Create, format, and mount a large ext4 VHD file
```bash
# Create a sparse 2 TB file (adjust size). Ensure the host NTFS drive has space.
dd if=/dev/zero of=/home/$USER/bitcoindata.ext4 bs=1M count=0 seek=2000000
mkfs.ext4 -F -E lazy_itable_init=1,lazy_journal_init=1 /home/$USER/bitcoindata.ext4

sudo mkdir -p /mnt/bitcoindata
sudo mount -o loop,noatime,discard /home/$USER/bitcoindata.ext4 /mnt/bitcoindata
sudo chown -R $USER:$USER /mnt/bitcoindata
```

2) Persist the mount
```bash
echo "/home/$USER/bitcoindata.ext4 /mnt/bitcoindata ext4 loop,noatime,discard,defaults 0 0" | sudo tee -a /etc/fstab
sudo umount /mnt/bitcoindata && sudo mount -a
```

3) Copy the existing datadir
```bash
bitcoin-cli stop || true
rsync -a --info=progress2 /mnt/b/bitcoin-data/ /mnt/bitcoindata/
du -sh /mnt/b/bitcoin-data /mnt/bitcoindata
```

4) Point configs to the new path and start
```bash
# bitcoin.conf
# datadir=/mnt/bitcoindata

# electrs config.toml
# cookie_file = "/mnt/bitcoindata/.cookie"

bitcoind -daemon
bitcoin-cli -rpcwait getblockchaininfo | jq '.blocks'
```

Pros: Clean separation; easy to resize by creating a new file and rsyncing later. Cons: Another mount to manage.

### Method 3 (advanced): Physical ext4 via `wsl --mount`

If you have a spare disk/partition you can format as ext4, you can attach it directly to WSL without loopback.

```powershell
wsl --shutdown
wsl --list --disks
wsl --mount <DiskPath> --partition <Index> --type ext4
```

Inside Kali, the disk appears under `/mnt/wsl/PHYSICALDRIVE…/…`. Mount it to `/mnt/bitcoindata` and proceed with rsync and configuration as above. This offers near‑native performance but requires dedicated hardware.

### Safety, validation, rollback

- Bitcoin Core verifies data on startup; a clean rsync copy is safe. If anything is inconsistent, Core will reindex as needed.
- Validate sizes and spot‑check files if desired:
```bash
du -sh <src> <dst>
find <dst> -type f | wc -l
```
- Rollback: You can point `datadir` back to the old NTFS path instantly; no data is destroyed by these steps.

### FAQ

- Can I exceed 1 TB? Yes. Both the WSL ext4.vhdx and loopback files can be expanded to multi‑TB. Ensure the Windows host volume has free space.
- Will copying 885GB cause issues? No, rsync is designed for this. Keep the source idle (stop Core) during the copy. Core revalidates on startup.
- Do I need to re‑download the chain? No. A correct copy preserves the data. Only if corruption is detected would Core reindex blocks (still from local disk).


