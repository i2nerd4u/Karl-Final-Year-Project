@echo off
echo Starting Chrome with CORS disabled for testing...
echo This is for development purposes only!
echo.
echo Make sure to close all Chrome instances first.
echo Press any key to continue or Ctrl+C to cancel.
pause

REM Kill existing Chrome processes
taskkill /f /im chrome.exe 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Chrome with CORS disabled
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\temp\chrome-cors-disabled" --disable-web-security --disable-features=VizDisplayCompositor --allow-running-insecure-content --disable-site-isolation-trials

echo Chrome started with CORS disabled.
echo Navigate to your local development server.
echo.
echo WARNING: Only use this for development testing!
echo Do not browse other websites with this Chrome instance.
pause