# 🐳 Docker Deployment Guide (with Git)

## Prerequisites
- Docker และ Docker Compose ติดตั้งบน server แล้ว
- Git ติดตั้งบน server แล้ว
- Database MySQL/MariaDB ทำงานที่ `192.168.0.93`
- Git repository สร้างแล้ว (GitHub/GitLab)

## 📋 ขั้นตอนการ Deploy ครั้งแรก

### 1. Clone Repository บน Server
```bash
# Clone repository ไปยัง server
git clone https://github.com/iTjitdhana/tracker.git C:\tracker

# เข้าไปในโฟลเดอร์
cd C:\tracker
```

### 2. รันคำสั่ง Deploy
**สำหรับ Windows:**
```bash
deploy.bat
```

**สำหรับ Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔄 ขั้นตอนการ Update

### เมื่อมีการแก้ไขโค้ด:
1. **บนเครื่อง Development:**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. **บน Server:**
   ```bash
   # เข้าไปในโฟลเดอร์
   cd C:\tracker
   
   # รันคำสั่ง update
   update.bat
   ```

**หรือใช้คำสั่ง Git โดยตรง:**
```bash
# Pull latest changes
git pull origin main

# Rebuild และ restart
docker-compose down
docker-compose up -d --build
```

## 🔧 คำสั่งที่มีประโยชน์

### ดูสถานะ Containers
```bash
docker-compose ps
```

### ดู Logs
```bash
# ดู logs ทั้งหมด
docker-compose logs

# ดู logs แบบ real-time
docker-compose logs -f tracker

# ดู logs ของ service เฉพาะ
docker-compose logs tracker
```

### Git Commands
```bash
# ดูสถานะ Git
git status

# ดู commit history
git log --oneline

# ดู branch
git branch
```

### Stop/Start Services
```bash
# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart services
docker-compose restart
```

## 🌐 การเข้าถึง
- **Dashboard:** http://localhost:3000
- **Logs Page:** http://localhost:3000/logs  
- **Workplans Page:** http://localhost:3000/workplans

## 🔍 Troubleshooting

### ถ้า Container ไม่ Start
```bash
# ดู logs เพื่อหาสาเหตุ
docker-compose logs tracker
```

### ถ้า Git Pull Error
```bash
# ดู Git status
git status

# ถ้ามี conflicts
git stash
git pull origin main
git stash pop
```

### ถ้า Database Connection Error
ตรวจสอบ:
- Database server ทำงานอยู่ที่ `192.168.0.93`
- Username/password ถูกต้อง
- Database `esp_tracker` มีอยู่

### ถ้าต้องการเข้าไปใน Container
```bash
docker-compose exec tracker sh
```

## 📝 Environment Variables
สามารถแก้ไขได้ใน `docker-compose.yml`:
- `DB_HOST`: Database server IP
- `DB_USER`: Database username  
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## 🚀 Workflow แนะนำ

### Development Workflow:
1. แก้ไขโค้ดบนเครื่อง local
2. ทดสอบด้วย `npm run dev`
3. Commit และ push ไปยัง Git
4. รัน `update.bat` บน server

### Production Workflow:
1. Server จะ auto-restart เมื่อ reboot
2. ใช้ `update.bat` เพื่อ update โปรแกรม
3. Monitor logs ด้วย `docker-compose logs -f tracker` 