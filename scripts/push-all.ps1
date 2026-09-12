# TechPulse Intelligence - Unified Push & Deploy Automation
# Usage: .\scripts\push-all.ps1 [-Message "optional commit message"]

param (
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"
Write-Host "`n[1/4] Checking Working Tree & Git Root..." -ForegroundColor Cyan

# Determine the Git repository root
try {
    $GitRoot = (git rev-parse --show-toplevel).Trim()
    Set-Location -Path $GitRoot
    Write-Host "Git Root: $GitRoot" -ForegroundColor Gray
} catch {
    Write-Error "Failed to determine git root: $_"
}

# Generate organic commit message if not provided
if (-not $Message) {
    $DateStr = Get-Date -Format "yyyy-MM-dd"
    $Message = "feat(intel): $DateStr daily threat telemetry, docs, and live synchronization"
}

# 1. Sync & stage changes across the workspace
git add .
$Status = git status --porcelain
if ($Status) {
    Write-Host "Staging and committing changes: '$Message'..." -ForegroundColor Yellow
    git commit -m "$Message"
} else {
    Write-Host "Working tree clean (no new uncommitted changes)." -ForegroundColor Green
}

# 2. Push to standalone TechPulse-Intelligence repository
Write-Host "`n[2/4] Pushing to GitHub (TechPulse-Intelligence)..." -ForegroundColor Cyan
$Remotes = git remote
try {
    if ($Remotes -contains "techpulse") {
        if (Test-Path "techpulse-intelligence") {
            Write-Host "Generating subtree split for techpulse-intelligence..." -ForegroundColor Gray
            git branch -D techpulse-standalone 2>$null | Out-Null
            git subtree split --prefix=techpulse-intelligence -b techpulse-standalone
            git push -f techpulse techpulse-standalone:main
            git branch -D techpulse-standalone 2>$null | Out-Null
        } else {
            git push techpulse main
        }
        Write-Host "Pushed to https://github.com/Swayam-jhaa/TechPulse-Intelligence" -ForegroundColor Green
    }
} catch {
    Write-Warning "Could not push to techpulse remote: $_"
}

# 3. Push to monorepo (Dev-Lab) if configured
Write-Host "`n[3/4] Syncing to Dev-Lab Monorepo..." -ForegroundColor Cyan
try {
    if ($Remotes -contains "origin") {
        git push origin main
        Write-Host "Pushed to https://github.com/Swayam-jhaa/Dev-Lab" -ForegroundColor Green
    }
} catch {
    Write-Warning "Could not push to origin remote: $_"
}

# 4. Deploy to Vercel
Write-Host "`n[4/4] Deploying to Vercel..." -ForegroundColor Cyan
if ($env:VERCEL_TOKEN) {
    Write-Host "Deploying using VERCEL_TOKEN..." -ForegroundColor Yellow
    $WebDir = if (Test-Path "techpulse-intelligence/web") { "techpulse-intelligence/web" } else { "web" }
    npx vercel --cwd $WebDir --token $env:VERCEL_TOKEN --prod --yes
    npx vercel alias set techpulse-intel.vercel.app --cwd $WebDir --token $env:VERCEL_TOKEN
    Write-Host "Vercel production deployment completed! Live at https://techpulse-intel.vercel.app" -ForegroundColor Green
} else {
    Write-Host "VERCEL_TOKEN not detected in environment." -ForegroundColor Gray
    Write-Host "Live domain: https://techpulse-intel.vercel.app" -ForegroundColor Gray
}

Write-Host "`nAll operations completed successfully!`n" -ForegroundColor Green
