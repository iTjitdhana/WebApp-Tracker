@echo off
echo Starting production server...
echo Checking available ports...

REM Check if port 3000 is in use
netstat -ano | findstr :3000 > nul
if errorlevel 1 (
    echo Port 3000 is available
    set PORT=3000
) else (
    echo Port 3000 is in use, trying port 3001...
    netstat -ano | findstr :3001 > nul
    if errorlevel 1 (
        echo Port 3001 is available
        set PORT=3001
    ) else (
        echo Port 3001 is in use, trying port 3002...
        set PORT=3002
    )
)

echo Starting server on port %PORT%...
set PORT=%PORT%
npm start

pause 