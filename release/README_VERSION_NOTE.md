# ESP Tracker Web (Versioncontour)

## โครงสร้างโปรเจกต์ (หลังจัดระเบียบ)

- `dashboard.html` — หน้า Dashboard แสดงสถานะงานผลิต
- `index.html` — หน้าเพิ่ม/แก้ไขขั้นตอนการผลิต (Form Process)
- `indextracker.html` — หน้าจับเวลาการผลิต (Production Timer)
- `workplan.html` — หน้าแผนงานผลิต (Workplan)
- `backend/` — โค้ด PHP ฝั่ง server, API, logic, ฐานข้อมูล
    - `backend/data/` — PHP API สำหรับดึง/บันทึกข้อมูล, log, ฯลฯ
    - `backend/includes/` — config ฐานข้อมูล, helper
- `frontend/` — ไฟล์ static สำหรับ UI (CSS, JS, HTML เสริม)
    - `frontend/assets/` — CSS, รูปภาพ, static files
    - `frontend/indexdemo.html`, `frontend/logs.html` ฯลฯ — หน้าเสริม/ทดสอบ
- `release/` — สำหรับเก็บไฟล์ zip ที่จะ deploy
- `database/` — ไฟล์ schema ฐานข้อมูล (database_schema.sql)
- `archive/` — เก็บไฟล์เก่า, note, log, ฯลฯ

## หลักการทำงาน

- ผู้ใช้เข้าผ่านหน้า dashboard, index, indextracker, workplan (อยู่ root)
- ฝั่ง client (HTML/JS) จะ fetch/submit ข้อมูลไปยัง API ใน `backend/data/`
- PHP ใน backend จะเชื่อมต่อฐานข้อมูล MySQL ตาม config ใน `backend/includes/`
- CSS/JS สำหรับ UI อยู่ใน `frontend/assets/`
- สามารถ deploy ได้โดย zip เฉพาะไฟล์หลัก + backend + frontend แล้วนำไปวางบน server ที่รองรับ PHP/MySQL

## หมายเหตุ
- ไม่ควร deploy โฟลเดอร์ archive/ หรือไฟล์ที่ไม่ใช้จริง
- สามารถ restore หรือปรับแต่งโครงสร้างได้ตามต้องการ
- เวอร์ชันนี้เป็น Versioncontour (จัดระเบียบใหม่, path ใหม่, พร้อม deploy) 