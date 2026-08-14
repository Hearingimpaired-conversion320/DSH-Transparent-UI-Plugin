# Aqua installer (Windows) - no npm, no build, no account.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File install.ps1 <git-url-or-local-path>
#
# It does three things:
#   1. clone the repo (or use a local path)
#   2. create a junction in the profile's node_modules
#   3. register ui-aqua in cordis.patch.yml (idempotent - safe to re-run)
#
# Reload the Web UI afterwards. DSH home defaults to %USERPROFILE%\.dsh,
# override with -DshHome.

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Source,          # git URL or local repo path

    [string]$DshHome = $env:DSH_HOME,
    [string]$Profile = 'web'
)

$ErrorActionPreference = 'Stop'

if (-not $DshHome) { $DshHome = Join-Path $env:USERPROFILE '.dsh' }
if (-not (Test-Path $DshHome)) { throw "DSH home not found: $DshHome (override with -DshHome)" }

$plugin      = '@deepseek-ai/dsh-client-ui-aqua'
$nodeModules = Join-Path $DshHome 'profiles\node_modules'
$linkPath    = Join-Path $nodeModules $plugin
$patchFile   = Join-Path $DshHome "profiles\$Profile\cordis.patch.yml"

# ---------- 1. source ----------
Write-Host '[1/3] Getting plugin source...' -ForegroundColor Cyan
if ($Source -match '^(https?://|git@|ssh://|github:)') {
    $cloneDir = Join-Path $env:TEMP $plugin
    if (Test-Path $cloneDir) { Remove-Item $cloneDir -Recurse -Force }
    git clone $Source $cloneDir | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "git clone failed: $Source" }
    $src = $cloneDir
} else {
    $src = (Resolve-Path $Source).Path
}
if (-not (Test-Path (Join-Path $src 'lib\client.js'))) {
    throw "lib\client.js not found - the repo must include the pre-built bundle. dir: $src"
}

# ---------- 2. junction ----------
Write-Host "[2/3] Linking -> $linkPath" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $nodeModules | Out-Null
if (Test-Path $linkPath) { Remove-Item $linkPath -Force -Recurse -ErrorAction SilentlyContinue }
New-Item -ItemType Junction -Path $linkPath -Target $src | Out-Null
if (-not (Test-Path $linkPath)) { throw 'junction creation failed' }

# ---------- 3. register ----------
Write-Host "[3/3] Registering in $patchFile" -ForegroundColor Cyan
$entryText = @'
- insert:
    - id: ui-aqua
      name: '@deepseek-ai/dsh-client-ui-aqua'
'@
if (-not (Test-Path $patchFile)) {
    Set-Content -Path $patchFile -Value ($entryText + "`n") -Encoding UTF8
} else {
    $content = Get-Content $patchFile -Raw
    # Match the real list entry only, not the "duplicate loader entry id: ui-aqua" comment.
    if ($content -match '(?m)^\s*-\s+id:\s*ui-aqua\s*$') {
        Write-Host '  already registered, skip.' -ForegroundColor DarkGray
    } else {
        $base = ($content -replace '(?s)\[\s*\]\s*$', '').TrimEnd()
        if ($base -eq '') { $new = $entryText + "`n" } else { $new = $base + "`n`n" + $entryText + "`n" }
        Set-Content -Path $patchFile -Value $new -Encoding UTF8
    }
}

Write-Host ''
Write-Host 'Done. Reload the Web UI (Aqua is on by default; Settings -> Plugins -> Aqua to toggle).' -ForegroundColor Green
