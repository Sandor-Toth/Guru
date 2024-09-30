@echo off
cd /d %~dp0
start "" /B python -m http.server 8000
timeout /t 2 /nobreak >nul
start "" http://localhost:8000/index.html
echo Webszerver fut a 8000-es porton. A böngészőnek automatikusan meg kellett nyitnia az index.html oldalt.
echo A szerver leállításához nyomj CTRL+C, majd válaszolj 'Y'-nal a kérdésre.
echo.
echo Szerver naplója:
python -m http.server 8000