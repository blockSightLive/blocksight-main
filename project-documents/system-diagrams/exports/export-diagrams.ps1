# BlockSight Diagram Exporter (PNG/SVG)
# Description: Scans Markdown files for Mermaid code blocks and exports each block to PNG and SVG via mermaid-cli (mmdc).
# Parameters:
#   -InputDir: Directory (relative to this script) to scan for .md files. Default: ".." (the system-diagrams folder)
#   -OutDir:   Output directory (relative to this script). Default: "." (the exports folder)
#   -Theme:    Mermaid CLI theme: default | dark | forest | neutral. Default: "default"
# Prerequisite:
#   npm install -D @mermaid-js/mermaid-cli
# Usage:
#   pwsh project-documents/system-diagrams/exports/export-diagrams.ps1

param(
  [string]$InputDir = "..",
  [string]$OutDir = ".",
  [string]$Theme = "default"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Resolve paths relative to this script location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ResolvedInput = Resolve-Path (Join-Path $ScriptDir $InputDir)
$ResolvedOut = Join-Path $ScriptDir $OutDir

# Ensure output directory exists
New-Item -ItemType Directory -Force -Path $ResolvedOut | Out-Null

# Normalize output to absolute path if possible
try { $ResolvedOut = (Resolve-Path $ResolvedOut).Path } catch { }

Write-Host "Scanning for diagrams in: $ResolvedInput"
Write-Host "Export destination: $ResolvedOut"

# Find Mermaid code blocks in markdown files and export each block
# This extracts each mermaid block to a temp .mmd and renders PNG/SVG.

$mdFiles = Get-ChildItem -Path $ResolvedInput -Filter "*.md" -Recurse | Where-Object { $_.FullName -notmatch "exports" }

# Try local mmdc first (node_modules), else fall back to global
# From this script path: project-documents/system-diagrams/exports
# node_modules is expected at repo root → ../../../node_modules/.bin/mmdc.cmd (Windows)
$mmdcLocal = Join-Path $ScriptDir "../../../node_modules/.bin/mmdc.cmd"
if (-Not (Test-Path $mmdcLocal)) { $mmdcLocal = "mmdc" }

# Validate mermaid-cli availability if global is required
if ($mmdcLocal -eq "mmdc") {
  try {
    $null = Get-Command mmdc -ErrorAction Stop
  } catch {
    Write-Error "Could not find 'mmdc'. Install locally with: npm install -D @mermaid-js/mermaid-cli"
    throw
  }
}

$counter = 0
foreach ($file in $mdFiles) {
  $content = Get-Content $file.FullName -Raw
  # Use single quotes to avoid PowerShell treating backticks as escapes
  $pattern = '```mermaid([\s\S]*?)```'
  $mermaidMatches = [regex]::Matches($content, $pattern)
  if ($mermaidMatches.Count -eq 0) { continue }

  $i = 0
  foreach ($m in $mermaidMatches) {
    $i++
    $counter++
    $mermaid = $m.Groups[1].Value.Trim()
    $baseName = [IO.Path]::GetFileNameWithoutExtension($file.Name)
    $outBase = Join-Path $ResolvedOut ("{0}-{1}" -f $baseName, $i)

    $tmpMmd = [IO.Path]::GetTempFileName().Replace('.tmp','.mmd')
    Set-Content -Path $tmpMmd -Value $mermaid -Encoding UTF8

    # PNG
    $pngOut = "$outBase.png"
    & $mmdcLocal -i $tmpMmd -o $pngOut -t $Theme | Out-Null

    # SVG
    $svgOut = "$outBase.svg"
    & $mmdcLocal -i $tmpMmd -o $svgOut -t $Theme | Out-Null

    Remove-Item $tmpMmd -Force
  }
}

Write-Host "Exported $counter diagram(s) to $ResolvedOut"
