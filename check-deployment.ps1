Write-Host "🔍 MediScan AI - Pre-Deployment Check" -ForegroundColor Cyan
Write-Host ""

# Check sizes
$projectSize = (Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$dataSize = (Get-ChildItem "data" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$datasetSize = (Get-ChildItem "new\dataset" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$modelFile = Get-ChildItem "new\models\chest_disease_efficientnetv2.h5" -ErrorAction SilentlyContinue

Write-Host "📊 PROJECT SIZE ANALYSIS:" -ForegroundColor Yellow
Write-Host "  Total project: $([math]::Round($projectSize/1GB,2)) GB"
Write-Host "  Training data (data/): $([math]::Round($dataSize/1GB,2)) GB - ❌ NOT DEPLOYED"
Write-Host "  Training data (new/dataset/): $([math]::Round($datasetSize/1GB,2)) GB - ❌ NOT DEPLOYED"
if ($modelFile) {
    Write-Host "  Production model: $([math]::Round($modelFile.Length/1MB,2)) MB - ✅ WILL DEPLOY"
}
Write-Host ""

# Calculate deployment size
$deploySize = $projectSize - $dataSize - $datasetSize
Write-Host "🚀 DEPLOYMENT SIZE (after cleanup): $([math]::Round($deploySize/1MB,2)) MB" -ForegroundColor Green
Write-Host ""

# Check critical files
Write-Host "📋 CRITICAL FILES CHECK:" -ForegroundColor Yellow
$checks = @(
    @{File="requirements.txt"; Required=$true},
    @{File="Procfile"; Required=$true},
    @{File=".gitignore"; Required=$true},
    @{File="frontend\package.json"; Required=$true},
    @{File="new\api_server.py"; Required=$true},
    @{File="new\models\chest_disease_efficientnetv2.h5"; Required=$true}
)

$allGood = $true
foreach ($check in $checks) {
    if (Test-Path $check.File) {
        Write-Host "  ✅ $($check.File)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($check.File) - MISSING!" -ForegroundColor Red
        $allGood = $false
    }
}
Write-Host ""

# Check .env
if (Test-Path ".env") {
    Write-Host "ENVIRONMENT VARIABLES:" -ForegroundColor Yellow
    Get-Content ".env" | Select-String "SUPABASE_URL|SUPABASE_KEY|GEMINI_API_KEY" | ForEach-Object {
        $line = $_ -replace '=.*', '=***'
        Write-Host "  $line" -ForegroundColor Green
    }
} else {
    Write-Host "  .env file not found (will use Render env vars)" -ForegroundColor Yellow
}
Write-Host ""

# Recommendations
Write-Host "DEPLOYMENT RECOMMENDATIONS:" -ForegroundColor Cyan
if ($deploySize -lt 200MB) {
    Write-Host "  Size is perfect for Render free tier!" -ForegroundColor Green
} else {
    Write-Host "  Size > 200MB - consider model hosting" -ForegroundColor Yellow
}

if ($modelFile.Length -lt 100MB) {
    Write-Host "  Model can be committed to Git (< 100MB)" -ForegroundColor Green
} else {
    Write-Host "  Upload model to Hugging Face first" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Read DEPLOY_NOW.md for full guide"
Write-Host "  2. Ensure Git is initialized: git init"
Write-Host "  3. Build frontend: cd frontend; npm run build"
Write-Host "  4. Push to GitHub"
Write-Host "  5. Deploy backend on Render.com"
Write-Host "  6. Deploy frontend on Vercel.com"
Write-Host ""

if ($allGood) {
    Write-Host "ALL CHECKS PASSED - Ready to deploy!" -ForegroundColor Green
} else {
    Write-Host "SOME CHECKS FAILED - Fix issues above" -ForegroundColor Red
}
Write-Host ""
