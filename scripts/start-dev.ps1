$projectRoot = Split-Path -Parent $PSScriptRoot

$backend = Start-Process -FilePath "node" `
  -ArgumentList "backend/server.js" `
  -WorkingDirectory $projectRoot `
  -PassThru

try {
  Set-Location $projectRoot
  Write-Host "Backend starting on http://localhost:5000"
  Write-Host "Frontend starting on http://localhost:4200"

  npm.cmd run start:frontend
}
finally {
  if ($backend -and -not $backend.HasExited) {
    Stop-Process -Id $backend.Id -Force
  }
}
