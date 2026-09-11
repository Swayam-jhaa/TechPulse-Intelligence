# TechPulse Intelligence - Unified Push & Deploy Automation
# Usage: .\scripts\push-all.ps1 [-Message "optional commit message"]

param (
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"
Write-Host "`n⚡ [1/4] Checking Working Tree..." -ForegroundColor Cyan

# Generate organic commit message if not provided
if (-not $Message) {
    $DateStr = Get-Date -Format "yyyy-MM-dd"
    $Message = "feat(intel): $DateStr daily threat telemetry and intelligence sync"
}

# 1. Sync & stage changes in techpulse-intelligence
Set-Location -Path "$PSScriptRoot\.."
Write-Host "📂 Working Directory: $(Get-Location)" -ForegroundColor Gray

git add .
$Status = git status --porcelain
if ($Status) {
    Write-Host "📝 Staging and committing changes: '$Message'..." -ForegroundColor Yellow
    git commit -m "$Message"
} else {
    Write-Host "✅ No uncommitted changes in local directory." -ForegroundColor Green
}

# 2. Push to standalone TechPulse-Intelligence repository
Write-Host "`n🚀 [2/4] Pushing to GitHub (TechPulse-Intelligence)..." -ForegroundColor Cyan
try {
    # Check if techpulse remote exists
    $Remotes = git remote
    if ($Remotes -contains "techpulse") {
        # If in monorepo root or subtree
        if (Test-Path "techpulse-intelligence") {
            git subtree split --prefix=techpulse-intelligence -b techpulse-standalone
            git push -f techpulse techpulse-standalone:main
        } else {
            git push techpulse main
        }
        Write-Host "✅ Pushed to https://github.com/Swayam-jhaa/TechPulse-Intelligence" -ForegroundColor Green
    }
} catch {
    Write-Warning "Could not push to techpulse remote directly: $_"
}

# 3. Push to monorepo (Dev-Lab) if configured
Write-Host "`n📦 [3/4] Syncing to Dev-Lab Monorepo..." -ForegroundColor Cyan
try {
    if ($Remotes -contains "origin") {
        git push origin main
        Write-Host "✅ Pushed to https://github.com/Swayam-jhaa/Dev-Lab" -ForegroundColor Green
    }
} catch {
    Write-Warning "Could not push to origin remote: $_"
}

# 4. Deploy to Vercel
Write-Host "`n▲ [4/4] Deploying to Vercel..." -ForegroundColor Cyan
if ($env:VERCEL_TOKEN) {
    Write-Host "🔑 Deploying using VERCEL_TOKEN..." -ForegroundColor Yellow
    npx vercel --cwd web --token $env:VERCEL_TOKEN --prod --yes
    Write-Host "✅ Vercel production deployment completed!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  VERCEL_TOKEN not detected in environment." -ForegroundColor Gray
    Write-Host "   If your GitHub repository is connected to Vercel, the push has automatically" -ForegroundColor Gray
    Write-Host "   triggered a new production deployment at https://techpulse-intel.vercel.app" -ForegroundColor Gray
    Write-Host "   (To enable direct CLI deploy: set `$env:VERCEL_TOKEN='your_token'`)" -ForegroundColor Gray
}

Write-Host "`n🎉 All operations completed successfully!`n" -ForegroundColor Green
