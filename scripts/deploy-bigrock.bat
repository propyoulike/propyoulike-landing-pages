@echo off
setlocal ENABLEEXTENSIONS

echo.
echo ============================================
echo 🚀 Deploying PropyouLike to BigRock
echo ============================================
echo.

set "LOCAL_DIST=C:\Github_Repos\landing pages\propyoulike-pages\dist"
set "WINSCP=C:\Program Files (x86)\WinSCP\winscp.com"
set "SESSION=PropyouLike-BigRock"
set "LOG=deploy.log"

REM ---- Guards ----
if not exist "%LOCAL_DIST%" (
  echo ❌ ERROR: dist folder not found
  exit /b 1
)

if not exist "%WINSCP%" (
  echo ❌ ERROR: WinSCP not found
  exit /b 1
)

REM ---- Deploy ----
"%WINSCP%" ^
  /log="%LOG%" ^
  /command ^
    "open %SESSION%" ^
    "option batch abort" ^
    "option confirm off" ^
    "lcd ""%LOCAL_DIST%""" ^
    "cd /" ^
    "put *" ^
    "exit"

if errorlevel 1 (
  echo ❌ DEPLOY FAILED — check %LOG%
  exit /b 1
)

echo.
echo ✅ DEPLOY SUCCESSFUL
echo 📦 Source: %LOCAL_DIST%
echo 🌍 Target: /
echo 📄 Log: %LOG%
echo.
