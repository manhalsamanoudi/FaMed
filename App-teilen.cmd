@echo off
rem Startet die App (Produktionsversion) und einen Cloudflare-Tunnel.
rem Der oeffentliche Link (https://....trycloudflare.com) erscheint unten im Kasten.
rem Fenster offen lassen, solange andere die App nutzen. Schliessen = Link aus.
cd /d "%~dp0"
echo Baue die App ... (dauert ca. 30 Sekunden)
call npm run build >nul 2>&1
if errorlevel 1 (
  echo Build fehlgeschlagen. Bitte "npm run build" im Projektordner ausfuehren und Fehler pruefen.
  pause
  exit /b 1
)
start "DentSim Server (offen lassen)" /min cmd /c "npm run start -- -p 3001"
timeout /t 5 /nobreak >nul
echo.
echo Starte Tunnel ... Der Link steht gleich im Kasten (https://....trycloudflare.com)
echo Zugangscode: siehe ACCESS_CODE in .env.local
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --no-autoupdate --url http://localhost:3001
