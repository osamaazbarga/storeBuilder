@echo off
echo ========================================
echo   Starting Angular Frontend
echo   With Custom Domains Support
echo ========================================
echo.

cd /d "C:\Users\Osama Azbarga\Documents\projects\projectEcommere\Ecommere\SuperEcommere"

echo Starting ng serve...
ng serve --host 0.0.0.0 --port 4200 --disable-host-check

pause
