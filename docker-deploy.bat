@echo off
REM Production Tracker - Docker Deployment Script for Windows
REM สำหรับ deploy บนเครื่องที่มี Docker อยู่แล้ว

echo 🏭 Production Tracker - Docker Deployment
echo =========================================

REM ตรวจสอบว่ามี Docker อยู่หรือไม่
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker ไม่พบในระบบ กรุณาติดตั้ง Docker Desktop ก่อน
    pause
    exit /b 1
)

REM ตรวจสอบว่ามี Docker Compose อยู่หรือไม่
docker-compose --version >nul 2>&1
if errorlevel 1 (
    docker compose version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker Compose ไม่พบในระบบ กรุณาติดตั้ง Docker Compose ก่อน
        pause
        exit /b 1
    )
)

REM ตรวจสอบว่ามีไฟล์ .env หรือไม่
if not exist ".env" (
    echo ⚠️  ไม่พบไฟล์ .env กำลังสร้างจาก env.example
    if exist "env.example" (
        copy env.example .env >nul
        echo ✅ สร้างไฟล์ .env แล้ว กรุณาแก้ไขค่า database ให้ถูกต้อง
        echo 📝 แก้ไขไฟล์ .env แล้วรัน script นี้อีกครั้ง
        pause
        exit /b 1
    ) else (
        echo ❌ ไม่พบไฟล์ env.example
        pause
        exit /b 1
    )
)

echo 📦 กำลัง build Docker image...
docker-compose -f docker-compose.prod.yml build --no-cache

echo 🚀 กำลัง start services...
docker-compose -f docker-compose.prod.yml up -d

echo ⏳ รอ services เริ่มทำงาน...
timeout /t 10 /nobreak >nul

echo 📊 ตรวจสอบสถานะ services...
docker-compose -f docker-compose.prod.yml ps

echo.
echo ✅ Deployment สำเร็จ!
echo.
echo 🌐 เข้าใช้งานได้ที่:
echo    - Dashboard: http://localhost:3000
echo    - Logs: http://localhost:3000/logs
echo    - Workplans: http://localhost:3000/workplans
echo.
echo 📋 คำสั่งที่มีประโยชน์:
echo    - ดู logs: docker-compose -f docker-compose.prod.yml logs -f tracker
echo    - หยุดการทำงาน: docker-compose -f docker-compose.prod.yml down
echo    - restart: docker-compose -f docker-compose.prod.yml restart tracker
echo.

pause