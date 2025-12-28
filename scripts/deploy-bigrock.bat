@echo off
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

REM ============================================================
REM PropyouLike – BigRock Deployment Script
REM ============================================================
REM
REM PURPOSE
REM ------------------------------------------------------------
REM - Deploy ONLY static build output (dist/)
REM - Sync local dist → BigRock hosting root
REM - Remove remote files that no longer exist locally
REM
REM HARD RULES (LOCKED)
REM ------------------------------------------------------------
REM 1. dist/ is the SINGLE source of truth for deployment
REM 2. NO source files, scripts, or configs are uploaded
REM 3. Remote deletion is intentional and controlled
REM 4. This script must FAIL FAST on misconfiguration
REM
REM ============================================================

echo.
echo 🚀 Deploying PropyouLike to BigRock...
echo.

REM ------------------------------------------------------------
REM CONFIGURATION (ABSOLUTE PATHS ONLY)
REM ------------------------------------------------------------

set "LOCAL_DIST=C:\Github_Repos\landing pages\propyoulike-pages\dist"
set "WINSCP_PATH=C:\Program Files (x86)\WinSCP\winscp.com"
set "SESSION_NAME=PropyouLike-BigRock"
set "LOG_FILE=deploy.log"

REM ------------------------------------------------------------
REM SAFETY CHECKS (FAIL FAST)
REM ------------------------------------------------------------

if not exist "%LOCAL_DIST%" (
  echo ❌ ERROR: dist folder not found:
  echo    %LOCAL_DIST%
  exit /b 1
)

if not exist "%WINSCP_PATH%" (
  echo ❌ ERROR: WinSCP not found at:
  echo    %WINSCP_PATH%
  exit /b 1
)

REM ------------------------------------------------------------
REM DEPLOYMENT
REM ------------------------------------------------------------

"%WINSCP_PATH%" ^
  /log="%LOG_FILE%" ^
  /command ^
    "open %SESSION_NAME%" ^
    "option batch abort" ^
    "option confirm off" ^
    "synchronize local -delete ""%LOCAL_DIST%"" /" ^
    "exit"

REM ------------------------------------------------------------
REM RESULT
REM ------------------------------------------------------------

if errorlevel 1 (
  echo.
  echo ❌ Deployment FAILED
  echo 👉 Check %LOG_FILE% for details
  exit /b 1
)

echo.
echo ✅ Deployment completed successfully
echo 📦 Source: %LOCAL_DIST%
echo 🌍 Target: BigRock hosting root
echo 📄 Log: %LOG_FILE%
echo.

endlocal
