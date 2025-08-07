# 🚀 Quick Docker Setup - Production Tracker

คู่มือเร่งด่วนสำหรับ deploy บนเครื่องใหม่ที่มี Docker อยู่แล้ว

## ⚡ 1-Minute Setup

### Linux/macOS:
```bash
git clone https://github.com/iTjitdhana/WebApp-Tracker.git tracker
cd tracker
cp env.example .env
# แก้ไข .env ให้ตรงกับ database ของคุณ
nano .env
chmod +x docker-deploy.sh
./docker-deploy.sh
```

### Windows:
```batch
git clone https://github.com/iTjitdhana/WebApp-Tracker.git tracker
cd tracker
copy env.example .env
REM แก้ไข .env ให้ตรงกับ database ของคุณ
notepad .env
docker-deploy.bat
```

## 🔧 Environment Configuration

แก้ไขไฟล์ `.env`:
```env
DB_HOST=192.168.1.100     # IP ของ database server
DB_USER=your_username     # Database username
DB_PASSWORD=your_password # Database password  
DB_NAME=esp_tracker       # Database name
PORT=3000                 # Web port (optional)
```

## 🌐 Access Application

หลังจาก deploy สำเร็จ:
- **Dashboard:** http://localhost:3000
- **Logs:** http://localhost:3000/logs  
- **Workplans:** http://localhost:3000/workplans

## 🛠️ Quick Commands

```bash
# ดู logs
docker-compose -f docker-compose.prod.yml logs -f tracker

# Restart
docker-compose -f docker-compose.prod.yml restart tracker

# Stop
docker-compose -f docker-compose.prod.yml down

# Update code
git pull origin main
docker-compose -f docker-compose.prod.yml up --build -d
```

## ❓ Need Help?

ดูคู่มือเต็ม: [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

---
**Ready to Production! 🏭**
