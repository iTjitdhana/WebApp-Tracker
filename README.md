# 🏭 Production Tracker Dashboard

ระบบติดตามการผลิตแบบ Real-time สำหรับโรงงานอุตสาหกรรม

## 🌟 Features

### 📊 Dashboard
- แสดงสถานะการผลิตแบบ Real-time
- จำนวนงานที่กำลังดำเนินการ
- สถิติการผลิตรายวัน
- การแจ้งเตือนเมื่อมีปัญหา

### 📝 Logs Management
- ดูประวัติการทำงานทั้งหมด
- แก้ไขข้อมูล Logs ได้
- กรองข้อมูลตามวันที่
- เรียงลำดับตาม Job Name และ Process Number

### 📋 Workplans Management
- จัดการแผนงานการผลิต
- กำหนดผู้ปฏิบัติงาน (สูงสุด 4 คน)
- ตั้งเวลาเริ่มต้นและสิ้นสุด
- ดูประวัติแผนงาน

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** MySQL/MariaDB
- **Deployment:** Docker, Docker Compose
- **Version Control:** Git

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (สำหรับ Development)
- Docker และ Docker Compose
- MySQL/MariaDB Database

### 🐳 Docker Deployment (แนะนำ)

#### วิธีที่ 1: ใช้ Docker Compose (ง่ายที่สุด)
```bash
# Clone repository
git clone https://github.com/iTjitdhana/tracker.git

# เข้าไปในโฟลเดอร์
cd tracker

# Build และรันด้วย Docker Compose
docker-compose up -d

# ตรวจสอบสถานะ
docker-compose ps

# ดู logs
docker-compose logs -f tracker
```

#### วิธีที่ 2: ใช้ Script (Windows)
```bash
# Clone บน server
git clone https://github.com/iTjitdhana/tracker.git C:\tracker

# เข้าไปในโฟลเดอร์
cd C:\tracker

# Deploy ด้วย script
deploy.bat
```

#### วิธีที่ 3: ใช้ Docker Commands แบบ Manual
```bash
# Build Docker image
docker build -f Dockerfile.simple -t tracker .

# รัน container
docker run -d \
  --name tracker \
  -p 3000:3000 \
  -e DB_HOST=192.168.0.93 \
  -e DB_USER=it.jitdhana \
  -e DB_PASSWORD=iT12345$ \
  -e DB_NAME=esp_tracker \
  tracker
```

### 💻 Development Mode
```bash
# Clone repository
git clone https://github.com/iTjitdhana/tracker.git

# เข้าไปในโฟลเดอร์
cd tracker

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

## 📁 Project Structure

```
tracker/
├── pages/                 # Next.js pages
│   ├── index.tsx         # Dashboard
│   ├── logs.tsx          # Logs page
│   ├── workplans.tsx     # Workplans page
│   └── api/              # API endpoints
├── components/           # React components
├── public/              # Static files
├── styles/              # CSS files
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose
├── deploy.bat           # Windows deployment script
├── update.bat           # Windows update script
└── README.md           # This file
```

## 🌐 Access URLs

### 🐳 Docker Deployment
- **Dashboard:** http://localhost:3000
- **Logs:** http://localhost:3000/logs
- **Workplans:** http://localhost:3000/workplans

### 💻 Development Mode
- **Dashboard:** http://localhost:3001
- **Logs:** http://localhost:3001/logs
- **Workplans:** http://localhost:3001/workplans

> **หมายเหตุ:** Development mode ใช้ port 3001 เพื่อไม่ให้ชนกับ Docker deployment

## 🔧 Configuration

### 🐳 Docker Configuration

#### Database Configuration
แก้ไขใน `docker-compose.yml`:
```yaml
environment:
  - DB_HOST=192.168.0.93
  - DB_USER=it.jitdhana
  - DB_PASSWORD=iT12345$
  - DB_NAME=esp_tracker
```

#### Port Configuration
แก้ไขใน `docker-compose.yml`:
```yaml
ports:
  - "3000:3000"  # เปลี่ยน 3000 เป็น port ที่ต้องการ
```

#### Environment Variables
สร้างไฟล์ `.env` (ถ้าต้องการ):
```env
DB_HOST=192.168.0.93
DB_USER=it.jitdhana
DB_PASSWORD=iT12345$
DB_NAME=esp_tracker
NODE_ENV=production
```

### 💻 Development Configuration
แก้ไขใน `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001"  // ใช้ port 3001
  }
}
```

## 📋 Database Schema

### Tables
- `logs` - ข้อมูล Logs การทำงาน
- `work_plans` - แผนงานการผลิต
- `work_plan_operators` - ผู้ปฏิบัติงานในแผนงาน

## 🔄 Update Process

### 🐳 Docker Update Workflow

#### วิธีที่ 1: ใช้ Script (แนะนำ)
```bash
# บน server
cd C:\tracker
update.bat
```

#### วิธีที่ 2: ใช้ Docker Commands
```bash
# Pull code ใหม่
git pull origin main

# Build และ restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# ตรวจสอบสถานะ
docker-compose ps
docker-compose logs -f tracker
```

### 💻 Development Workflow
1. แก้ไขโค้ดบนเครื่อง local
2. ทดสอบด้วย `npm run dev`
3. Commit และ push ไปยัง Git
4. รัน `update.bat` บน server

### 🚀 Production Workflow
1. Server จะ auto-restart เมื่อ reboot
2. ใช้ `update.bat` เพื่อ update โปรแกรม
3. Monitor logs ด้วย `docker-compose logs -f tracker`
4. ตรวจสอบ application ที่ http://localhost:3000

## 🛠️ Useful Commands

### 🐳 Docker Commands

#### การจัดการ Container
```bash
# ดูสถานะ containers
docker-compose ps

# ดู logs แบบ real-time
docker-compose logs -f tracker

# ดู logs แบบครั้งเดียว
docker-compose logs tracker

# Restart service
docker-compose restart tracker

# หยุดการทำงาน
docker-compose down

# หยุดและลบ volumes
docker-compose down -v
```

#### การ Build และ Deploy
```bash
# Build image ใหม่
docker-compose build --no-cache

# Build และรันทันที
docker-compose up --build -d

# รันแบบ foreground (ดู logs)
docker-compose up

# เข้าไปใน container
docker-compose exec tracker sh
```

#### การจัดการ Images
```bash
# ดู images ทั้งหมด
docker images

# ลบ image ที่ไม่ใช้
docker image prune

# ลบ image เฉพาะ
docker rmi tracker-tracker
```

### Git Commands
```bash
# ดูสถานะ Git
git status

# ดู commit history
git log --oneline

# Update บน server
git pull origin main
```

## 🔍 Troubleshooting

### 🐳 Docker Issues

#### ถ้า Container ไม่ Start
```bash
# ดู logs เพื่อหาสาเหตุ
docker-compose logs tracker

# ตรวจสอบ port ที่ใช้
netstat -an | findstr :3000

# ลบ container และรันใหม่
docker-compose down
docker-compose up -d
```

#### ถ้า Build Failed
```bash
# ลบ cache และ build ใหม่
docker-compose build --no-cache

# ตรวจสอบ disk space
docker system df

# ลบ unused images
docker image prune -a
```

#### ถ้า Port ถูกใช้งาน
```bash
# เปลี่ยน port ใน docker-compose.yml
ports:
  - "3001:3000"  # เปลี่ยนจาก 3000 เป็น 3001
```

### 🗄️ Database Issues

#### ถ้า Database Connection Error
ตรวจสอบ:
- Database server ทำงานอยู่
- IP, Username, Password ถูกต้อง
- Database มีอยู่
- Firewall ไม่บล็อก port 3306

```bash
# ทดสอบการเชื่อมต่อ database
docker-compose exec tracker sh
# ใน container: mysql -h 192.168.0.93 -u it.jitdhana -p
```

### 🔄 Git Issues

#### ถ้า Git Pull Error
```bash
# ดู Git status
git status

# ถ้ามี conflicts
git stash
git pull origin main
git stash pop

# ถ้าต้องการ reset
git reset --hard HEAD
git pull origin main
```

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ:
- สร้าง Issue บน GitHub
- ติดต่อทีมพัฒนา

## 📄 License

This project is licensed under the MIT License.

---

**Developed with ❤️ for Production Management** 