@echo off
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   ABA PAYWAY SERVER - QUICK START                 ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Please configure your .env file before starting the server.
    echo Copy .env.example to .env and fill in your values.
    echo.
    echo Run: copy .env.example .env
    echo Then edit .env with your configuration.
    echo.
    pause
    exit /b 1
)

echo [OK] .env file found
echo.

REM Generate hashes if not configured
findstr /C:"HASH_1=REPLACE_WITH_GENERATED_HASH" .env >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Hashes not yet generated. Generating now...
    echo.
    node generate-hashes.js
    echo.
    echo [ACTION REQUIRED] Please copy the generated hashes to .env file
    echo Then run this script again.
    echo.
    pause
    exit /b 0
)

echo [OK] Hashes configured
echo.

echo Starting ABA PayWay Payment Server...
echo.
echo ═══════════════════════════════════════════════════
echo.
call npm start

pause
