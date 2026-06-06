$Host.UI.RawUI.WindowTitle = "AI Summarizer Server (24/7 Run)"
while ($true) {
    Write-Host "[$(Get-Date)] Starting server (serving frontend on port 5000)..." -ForegroundColor Green
    & ".\env\Scripts\python.exe" "backend/App.py"
    Write-Host "[$(Get-Date)] Server stopped or crashed. Restarting in 5 seconds..." -ForegroundColor Red
    Start-Sleep -Seconds 5
}
