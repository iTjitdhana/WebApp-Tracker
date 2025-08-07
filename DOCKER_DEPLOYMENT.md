# 🐳 Docker Deployment Guide

คู่มือการ deploy Production Tracker ด้วย Docker บนเครื่องใหม่

## 🎯 Quick Start (สำหรับคนรีบ)

### บน Linux/macOS:
```bash
git clone https://github.com/YOUR_USERNAME/tracker.git
cd tracker
chmod +x docker-deploy.sh
./docker-deploy.sh
```

### บน Windows:
```batch
git clone https://github.com/YOUR_USERNAME/tracker.git
cd tracker
docker-deploy.bat
```

## 📋 Prerequisites (สิ่งที่ต้องมี)

### ✅ ต้องติดตั้งก่อน:
- **Git** - สำหรับ clone repository
- **Docker** - สำหรับรัน application
- **Docker Compose** - สำหรับจัดการ services

### 🔧 การติดตั้ง Docker:

#### Windows:
1. ดาวน์โหลด [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. ติดตั้งและเปิด Docker Desktop
3. รอให้ Docker เริ่มทำงาน (จะมี icon สีเขียวใน system tray)

#### macOS:
```bash
# ใช้ Homebrew
brew install --cask docker

# หรือดาวน์โหลดจาก website
# https://www.docker.com/products/docker-desktop/
```

#### Linux (Ubuntu/Debian):
```bash
# ติดตั้ง Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# เพิ่ม user ใน docker group
sudo usermod -aG docker $USER

# ติดตั้ง Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# logout และ login ใหม่
```

## 🚀 Step-by-Step Deployment

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/tracker.git
cd tracker
```

### Step 2: Configure Database
```bash
# สร้างไฟล์ .env จาก template
cp env.example .env

# แก้ไขไฟล์ .env
nano .env  # หรือใช้ text editor อื่น
```

ไฟล์ `.env` ตัวอย่าง:
```env
# Database Configuration
DB_HOST=192.168.1.100    # IP ของ database server
DB_USER=your_username    # username สำหรับ database
DB_PASSWORD=your_password # password สำหรับ database
DB_NAME=esp_tracker      # ชื่อ database

# Application Configuration
PORT=3000                # port ที่ต้องการใช้
NODE_ENV=production
TZ=Asia/Bangkok
```

### Step 3: Deploy Application

#### แบบใช้ Script (แนะนำ):
```bash
# Linux/macOS
chmod +x docker-deploy.sh
./docker-deploy.sh

# Windows
docker-deploy.bat
```

#### แบบ Manual:
```bash
# Build และ run
docker-compose -f docker-compose.prod.yml up --build -d

# ตรวจสอบสถานะ
docker-compose -f docker-compose.prod.yml ps

# ดู logs
docker-compose -f docker-compose.prod.yml logs -f tracker
```

### Step 4: Verify Deployment
1. เปิดเว็บไซต์ที่ `http://localhost:3000`
2. ตรวจสอบว่า Dashboard แสดงผลถูกต้อง
3. ลองเข้าหน้า Logs และ Workplans

## 🔧 Configuration Options

### 🌐 Port Configuration
แก้ไข port ใน `.env`:
```env
PORT=8080  # เปลี่ยนเป็น port ที่ต้องการ
```

### 🗄️ Database Configuration
แก้ไข database settings ใน `.env`:
```env
DB_HOST=your-db-server.com
DB_USER=your-username
DB_PASSWORD=your-secure-password
DB_NAME=your-database-name
```

### 🌍 Timezone Configuration
```env
TZ=Asia/Bangkok  # หรือ timezone อื่นที่ต้องการ
```

## 📋 Useful Commands

### 🐳 Docker Management
```bash
# ดูสถานะ services
docker-compose -f docker-compose.prod.yml ps

# ดู logs แบบ real-time
docker-compose -f docker-compose.prod.yml logs -f tracker

# Restart service
docker-compose -f docker-compose.prod.yml restart tracker

# หยุดการทำงาน
docker-compose -f docker-compose.prod.yml down

# หยุดและลบ volumes
docker-compose -f docker-compose.prod.yml down -v
```

### 🔄 Update Application
```bash
# Pull code ใหม่
git pull origin main

# Rebuild และ restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up --build -d
```

### 🧹 Cleanup
```bash
# ลบ unused images
docker image prune -a

# ลบ unused containers
docker container prune

# ลบ unused volumes
docker volume prune

# ลบทุกอย่างที่ไม่ใช้
docker system prune -a
```

## 🔍 Troubleshooting

### ❌ ปัญหาที่พบบ่อย:

#### 1. Port already in use
```bash
# หา process ที่ใช้ port
sudo lsof -i :3000  # Linux/macOS
netstat -ano | findstr :3000  # Windows

# เปลี่ยน port ใน .env
PORT=3001
```

#### 2. Database connection failed
- ตรวจสอบ IP, username, password ใน `.env`
- ตรวจสอบว่า database server เปิดอยู่
- ตรวจสอบ firewall ไม่บล็อก port 3306

#### 3. Docker build failed
```bash
# ลบ cache และ build ใหม่
docker-compose -f docker-compose.prod.yml build --no-cache

# ตรวจสอบ disk space
docker system df

# ลบ unused images
docker image prune -a
```

#### 4. Container won't start
```bash
# ดู logs เพื่อหาสาเหตุ
docker-compose -f docker-compose.prod.yml logs tracker

# ตรวจสอบ configuration
cat .env
```

### 🆘 Emergency Commands
```bash
# หยุดทุก container
docker stop $(docker ps -aq)

# ลบทุก container
docker rm $(docker ps -aq)

# ลบทุก image
docker rmi $(docker images -q)

# Reset Docker (ระวัง: จะลบทุกอย่าง)
docker system prune -a --volumes
```

## 🌐 Access URLs

หลังจาก deploy สำเร็จ สามารถเข้าใช้งานได้ที่:

- **Dashboard:** `http://localhost:3000`
- **Logs Management:** `http://localhost:3000/logs`
- **Workplans Management:** `http://localhost:3000/workplans`

> หมายเหตุ: ถ้าเปลี่ยน port ใน `.env` ให้เปลี่ยน URL ตามนั้น

## 🔐 Security Considerations

### 🛡️ Production Recommendations:
1. **เปลี่ยน default passwords** ทั้งหมด
2. **ใช้ HTTPS** สำหรับ production
3. **ตั้ง firewall** ให้เหมาะสม
4. **ใช้ reverse proxy** เช่น Nginx
5. **Backup database** เป็นประจำ

### 🔒 Environment Security:
```env
# ใช้ strong password
DB_PASSWORD=VerySecurePassword123!@#

# ใช้ non-default port
PORT=8080

# ใช้ specific database user (ไม่ใช่ root)
DB_USER=tracker_user
```

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ logs: `docker-compose -f docker-compose.prod.yml logs tracker`
2. ตรวจสอบ configuration ใน `.env`
3. ดู troubleshooting section ข้างต้น
4. สร้าง issue ใน GitHub repository

---

**Happy Deploying! 🚀**