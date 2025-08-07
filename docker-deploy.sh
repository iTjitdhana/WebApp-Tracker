#!/bin/bash

# Production Tracker - Docker Deployment Script
# สำหรับ deploy บนเครื่องที่มี Docker อยู่แล้ว

set -e

echo "🏭 Production Tracker - Docker Deployment"
echo "========================================="

# ตรวจสอบว่ามี Docker อยู่หรือไม่
if ! command -v docker &> /dev/null; then
    echo "❌ Docker ไม่พบในระบบ กรุณาติดตั้ง Docker ก่อน"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose ไม่พบในระบบ กรุณาติดตั้ง Docker Compose ก่อน"
    exit 1
fi

# ตรวจสอบว่ามีไฟล์ .env หรือไม่
if [ ! -f ".env" ]; then
    echo "⚠️  ไม่พบไฟล์ .env กำลังสร้างจาก env.example"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ สร้างไฟล์ .env แล้ว กรุณาแก้ไขค่า database ให้ถูกต้อง"
        echo "📝 แก้ไขไฟล์ .env แล้วรัน script นี้อีกครั้ง"
        exit 1
    else
        echo "❌ ไม่พบไฟล์ env.example"
        exit 1
    fi
fi

echo "📦 กำลัง build Docker image..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🚀 กำลัง start services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ รอ services เริ่มทำงาน..."
sleep 10

echo "📊 ตรวจสอบสถานะ services..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment สำเร็จ!"
echo ""
echo "🌐 เข้าใช้งานได้ที่:"
echo "   - Dashboard: http://localhost:${PORT:-3000}"
echo "   - Logs: http://localhost:${PORT:-3000}/logs"
echo "   - Workplans: http://localhost:${PORT:-3000}/workplans"
echo ""
echo "📋 คำสั่งที่มีประโยชน์:"
echo "   - ดู logs: docker-compose -f docker-compose.prod.yml logs -f tracker"
echo "   - หยุดการทำงาน: docker-compose -f docker-compose.prod.yml down"
echo "   - restart: docker-compose -f docker-compose.prod.yml restart tracker"
echo ""