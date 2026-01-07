# Start MediScan AI - Backend and Frontend

Write-Host "Starting MediScan AI..." -ForegroundColor Green
Write-Host ""

# First, stop any existing servers to prevent conflicts
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
$pythonProcs = Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*MediScan*" -or $true }
if ($pythonProcs) {
    $pythonProcs | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  Stopped $($pythonProcs.Count) Python process(es)" -ForegroundColor Gray
}

# Also kill any process on port 5000
$portCheck = netstat -ano | Select-String ":5000 " | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -Unique
foreach ($pid in $portCheck) {
    if ($pid -and $pid -ne "0") {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  Killed process on port 5000 (PID: $pid)" -ForegroundColor Gray
    }
}

Start-Sleep -Seconds 1

# Start Backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .venv\Scripts\Activate.ps1; python new/api_server.py"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
