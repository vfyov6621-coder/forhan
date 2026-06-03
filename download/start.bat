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
echo  [✓] Node.js:
node -v

echo.
echo  ─────────────────────────────────────────────────
echo  [1/5] Installing dependencies...
echo  ─────────────────────────────────────────────────
call npm install
if %errorlevel% neq 0 (
    echo  [!] Failed to install dependencies!
    echo  [!] Try: npm install --force
    pause
    exit /b 1
)
echo  [✓] Dependencies installed

echo.
echo  ─────────────────────────────────────────────────
echo  [2/5] Creating database folder...
echo  ─────────────────────────────────────────────────
if not exist "db" mkdir db
echo  [✓] Folder db/ ready

echo.
echo  ─────────────────────────────────────────────────
echo  [3/5] Setting up .env...
echo  ─────────────────────────────────────────────────
if not exist ".env" (
    > .env echo DATABASE_URL=file:./db/custom.db
    >> .env echo SESSION_SECRET=forhan_super_secret_key_change_in_prod_32ch
    echo  [✓] Created .env
) else (
    echo  [✓] .env already exists
)

echo.
echo  ─────────────────────────────────────────────────
echo  [4/5] Creating database...
echo  ─────────────────────────────────────────────────
call npx prisma db push --accept-data-loss --skip-generate
if %errorlevel% neq 0 (
    echo  [!] Database creation failed!
    echo  [!] Try manually: npx prisma db push
    echo  [!] Make sure .env has: DATABASE_URL=file:./db/custom.db
    pause
    exit /b 1
)
echo  [✓] Database created

call npx prisma generate
if %errorlevel% neq 0 (
    echo  [!] Prisma generate failed!
    pause
    exit /b 1
)
echo  [✓] Prisma client ready

echo.
echo  ─────────────────────────────────────────────────
echo  [5/5] Starting Forhan server...
echo  ─────────────────────────────────────────────────
echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   http://localhost:3000                       ║
echo  ║   Press Ctrl+C to stop                       ║
echo  ╚══════════════════════════════════════════════╝
echo.

call npx next dev -p 3000
pause
