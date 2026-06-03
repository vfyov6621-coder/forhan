@echo off
chcp 65001 >nul 2>&1
title Forhan — Social Network
color 0A

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║          FORHAN — Social Network             ║
echo  ║              Local Server Setup               ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ─── Check Node.js ───
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js not found!
    echo  [!] Download: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo  [✓] Node.js found:
node -v

:: ─── Check npm/bun ───
where bun >nul 2>&1
if %errorlevel% equ  0 (
    echo  [✓] Bun found:
    bun -v
    set PM=bun
) else (
    echo  [i] Bun not found, using npm
    where npm >nul 2>&1
    if %errorlevel% neq 0 (
        echo  [!] npm also not found!
        pause
        exit /b 1
    )
    echo  [✓] npm found:
    npm -v
    set PM=npm
)

echo.
echo  ─────────────────────────────────────────────────
echo  [1/4] Installing dependencies...
echo  ─────────────────────────────────────────────────
if %PM%==bun (
    bun install
) else (
    npm install
)
if %errorlevel% neq 0 (
    echo  [!] Failed to install dependencies!
    pause
    exit /b 1
)
echo  [✓] Dependencies installed

echo.
echo  ─────────────────────────────────────────────────
echo  [2/4] Checking database...
echo  ─────────────────────────────────────────────────
if not exist "db" mkdir db

:: Create .env if not exists
if not exist ".env" (
    echo DATABASE_URL=file:./db/custom.db> .env
    echo SESSION_SECRET=forhan_super_secret_key_change_in_prod_32ch>> .env
    echo  [✓] Created .env
)

if not exist "db\custom.db" (
    echo  [i] Creating database...
    npx prisma db push --skip-generate
    echo  [✓] Database created
) else (
    echo  [✓] Database exists
)

echo.
echo  ─────────────────────────────────────────────────
echo  [3/4] Generating Prisma client...
echo  ─────────────────────────────────────────────────
npx prisma generate
echo  [✓] Prisma client ready

echo.
echo  ─────────────────────────────────────────────────
echo  [4/4] Starting Forhan server...
echo  ─────────────────────────────────────────────────
echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   Server: http://localhost:3000              ║
echo  ║   Press Ctrl+C to stop                       ║
echo  ╚══════════════════════════════════════════════╝
echo.

npx next dev -p 3000
