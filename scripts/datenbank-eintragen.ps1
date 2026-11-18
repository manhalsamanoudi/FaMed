# Traegt die Neon-Datenbankadresse aus der Zwischenablage in .env.local ein.
# Benutzung: In Neon die Verbindungsadresse kopieren, dann Datenbank-eintragen.cmd doppelklicken.
# Die Adresse enthaelt ein Passwort und wird nirgends angezeigt.
$ErrorActionPreference = 'Stop'

function Finish([int]$code) {
    Write-Host ''
    Read-Host 'Enter druecken zum Schliessen' | Out-Null
    exit $code
}

$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root '.env.local'

$clip = Get-Clipboard -Raw
if ($null -eq $clip) { $clip = '' }
# Neon kopiert manchmal ein Snippet wie: psql 'postgresql://...' oder DATABASE_URL=...
$m = [regex]::Match($clip, "postgres(ql)?://[^\s'""]+")
if (-not $m.Success) {
    Write-Host 'In der Zwischenablage ist keine Datenbank-Adresse (postgresql://...).' -ForegroundColor Red
    Write-Host 'In Neon auf "Connect" klicken und die Adresse mit dem Kopier-Symbol kopieren.'
    Finish 1
}
$url = $m.Value

Write-Host 'Pruefe die Verbindung zur Datenbank ...'
$env:DATABASE_URL = $url
Push-Location $root
& node scripts/db-check.mjs
$ok = ($LASTEXITCODE -eq 0)
Pop-Location
if (-not $ok) {
    Write-Host 'Es wurde nichts gespeichert.' -ForegroundColor Red
    Finish 1
}

$lines = @()
if (Test-Path $envFile) { $lines = @(Get-Content $envFile -Encoding UTF8) }
$found = $false
$lines = @($lines | ForEach-Object {
    if ($_ -match '^DATABASE_URL=') { $found = $true; "DATABASE_URL=$url" } else { $_ }
})
if (-not $found) {
    $lines += ''
    $lines += '# Neon-Datenbank (Zugangscodes)'
    $lines += "DATABASE_URL=$url"
}
[System.IO.File]::WriteAllLines($envFile, [string[]]$lines, (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Fertig! Datenbank-Adresse ist gueltig und wurde in .env.local eingetragen.' -ForegroundColor Green
Finish 0
