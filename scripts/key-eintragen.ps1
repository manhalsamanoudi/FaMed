# Traegt den Gemini-API-Key aus der Zwischenablage in .env.local ein.
# Benutzung: In Google AI Studio den Key kopieren, dann Key-eintragen.cmd doppelklicken.
# Der Key wird vorher bei Google geprueft. Er wird nirgends angezeigt.
$ErrorActionPreference = 'Stop'

function Finish([int]$code) {
    Write-Host ''
    Read-Host 'Enter druecken zum Schliessen' | Out-Null
    exit $code
}

function Show-CopyHelp {
    Write-Host ''
    Write-Host 'So kopierst du den richtigen Key:'
    Write-Host '  1. In Google AI Studio (Seite "API-Schluessel") auf den blauen Key-Namen klicken (z. B. "...mFMQ").'
    Write-Host '  2. Im Fenster, das sich oeffnet, auf "Schluessel kopieren" / "Copy key" klicken.'
    Write-Host '  3. Danach diese Datei erneut doppelklicken.'
}

$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) '.env.local'

$key = Get-Clipboard -Raw
if ($null -eq $key) { $key = '' }
$key = $key.Trim().Trim('"').Trim("'").Trim()

if ($key.Length -lt 20 -or $key.Length -gt 200 -or $key -match '\s') {
    Write-Host 'In der Zwischenablage ist kein Key.' -ForegroundColor Red
    Show-CopyHelp
    Finish 1
}

Write-Host 'Pruefe den Key bei Google ...'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$checked = $false
try {
    Invoke-RestMethod -Uri 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=1' `
        -Headers @{ 'x-goog-api-key' = $key } -TimeoutSec 20 | Out-Null
    $checked = $true
} catch {
    $status = $null
    if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
    if ($status -in 400, 401, 403) {
        Write-Host 'Google lehnt diesen Wert ab: Das ist kein gueltiger Gemini-API-Key.' -ForegroundColor Red
        Write-Host 'Es wurde nichts gespeichert.'
        Show-CopyHelp
        Finish 1
    }
    Write-Host 'Pruefung bei Google nicht moeglich (keine Internetverbindung?). Key wird trotzdem eingetragen.' -ForegroundColor Yellow
}

$lines = @()
if (Test-Path $envFile) { $lines = @(Get-Content $envFile -Encoding UTF8) }

$found = $false
$lines = @($lines | ForEach-Object {
    if ($_ -match '^GEMINI_API_KEY=') { $found = $true; "GEMINI_API_KEY=$key" } else { $_ }
})
if (-not $found) { $lines += "GEMINI_API_KEY=$key" }

# UTF-8 ohne BOM, damit Next.js die Datei sauber liest
[System.IO.File]::WriteAllLines($envFile, [string[]]$lines, (New-Object System.Text.UTF8Encoding($false)))

$tail = $key.Substring($key.Length - 4)
if ($checked) {
    Write-Host "Fertig! Key (endet auf ...$tail) ist gueltig und wurde in .env.local eingetragen." -ForegroundColor Green
} else {
    Write-Host "Key (endet auf ...$tail) wurde in .env.local eingetragen, aber nicht geprueft." -ForegroundColor Yellow
}
Finish 0
