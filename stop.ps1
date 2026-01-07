# Stop MediScan AI - Backend and Frontend

Write-Host "Stopping MediScan AI..." -ForegroundColor Red
Write-Host ""

# Stop Backend (all Python processes)
Write-Host "Stopping Backend Server..." -ForegroundColor Yellow
$backendProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($backendProcesses) {
    $backendProcesses | Stop-Process -Force
    Write-Host "Backend stopped ($($backendProcesses.Count) process(es))" -ForegroundColor Green
} else {
    Write-Host "Backend was not running" -ForegroundColor Gray
}

# Stop Frontend (all Node processes)
Write-Host "Stopping Frontend Server..." -ForegroundColor Yellow
$frontendProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($frontendProcesses) {
    $frontendProcesses | Stop-Process -Force
    Write-Host "Frontend stopped ($($frontendProcesses.Count) process(es))" -ForegroundColor Green
} else {
    Write-Host "Frontend was not running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "All servers stopped!" -ForegroundColor Green
Write-Host ""
