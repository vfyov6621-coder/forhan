@echo off
chcp 65001 >nul 2>&1
title Forhan — Social Network
color 0A

:: ─── Always run from the script's own directory ───
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║          FORHAN — Social Network             ║
echo  ║              Local Server Setup               ║
echo  ╚══════════════════════════════════════════════╝
echo  [i] Working directory: %cd%
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
echo  [√] Node.js:
node -v

echo.
echo  ─────────────────────────────────────────────────
echo  [1/7] Installing dependencies...
echo  ─────────────────────────────────────────────────
call npm install
if %errorlevel% neq 0 (
    echo  [!] Failed to install dependencies!
    echo  [!] Try: npm install --force
    pause
    exit /b 1
)
echo  [√] Dependencies installed

echo.
echo  ─────────────────────────────────────────────────
echo  [2/7] Creating database folder...
echo  ─────────────────────────────────────────────────
if not exist "db" mkdir db
echo  [√] Folder db/ ready

echo.
echo  ─────────────────────────────────────────────────
echo  [3/7] Setting up .env...
echo  ─────────────────────────────────────────────────
if not exist ".env" (
    echo DATABASE_URL=file:./db/custom.db> .env
    echo SESSION_SECRET=forhan_super_secret_key_change_in_prod_32ch>> .env
    echo  [√] Created .env
) else (
    echo  [√] .env already exists
)

echo.
echo  ─────────────────────────────────────────────────
echo  [4/7] Fixing .env conflicts...
echo  ─────────────────────────────────────────────────
set PARENT_ENV_MOVED=0
if exist "..\.env" (
    echo  [i] Found .env in parent folder — temporarily hiding it
    ren "..\.env" ".env.forhan_bak"
    set PARENT_ENV_MOVED=1
) else (
    echo  [√] No .env conflicts
)

echo.
echo  ─────────────────────────────────────────────────
echo  [5/7] Creating database...
echo  ─────────────────────────────────────────────────

:: Delete old database if exists (clean schema push)
if exist "db\custom.db" del "db\custom.db"
if exist "db\custom.db-journal" del "db\custom.db-journal"

call npx prisma db push --accept-data-loss --skip-generate
if %errorlevel% neq 0 (
    echo  [!] Database creation failed!
    echo  [!] Try manually: npx prisma db push
    echo  [!] Make sure .env has: DATABASE_URL=file:./db/custom.db
    pause
    exit /b 1
)
echo  [√] Database created

call npx prisma generate
if %errorlevel% neq 0 (
    echo  [!] Prisma generate failed!
    pause
    exit /b 1
)
echo  [√] Prisma client ready

:: ─── Restore parent .env ───
if %PARENT_ENV_MOVED% equ 1 (
    ren "..\.env.forhan_bak" ".env"
    echo  [√] Restored parent .env
)

echo.
echo  ─────────────────────────────────────────────────
echo  [6/7] Setting up admin account...
echo  ─────────────────────────────────────────────────
echo  [i] To create admin account, after server starts:
echo      Go to http://localhost:3000 and register an account.
echo      Then run this command in another terminal:
echo      curl -X POST http://localhost:3000/api/admin/seed ^
echo        -H "Content-Type: application/json" ^
echo        -d "{\"username\":\"YOUR_USERNAME\",\"password\":\"YOUR_PASSWORD\"}"
echo  [√] See instructions above
echo.

echo  ─────────────────────────────────────────────────
echo  [7/7] Starting Forhan server...
echo  ─────────────────────────────────────────────────
echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   http://localhost:3000                       ║
echo  ║   Press Ctrl+C to stop                       ║
echo  ╚══════════════════════════════════════════════╝
echo.

call npx next dev -p 3000
pause
