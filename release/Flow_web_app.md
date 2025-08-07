# แผนก Production / ระบบ Process Tracker app

## โครงสร้างโปรเจกต์ 

- `index.html` — เป็นหน้า Hub รวม app ของเเต่ล่ะแผนกของบริษัท โดยตอนนี้จะมี Production เเละในนี้มี ระบบ Process Traker app
- `dashboard.html` — หน้า Dashboard แสดงสถานะงานผลิต
- `Form Process.html` — หน้าเพิ่ม/แก้ไขขั้นตอนการผลิต (Form Process)
- `tracker.html` — หน้าจับเวลาการผลิต (Production Timer)
- `workplan.html` — หน้าแผนงานผลิต (Workplan)

## Database
-- 1. ตารางสินค้าและขั้นตอนการผลิต (Master)
CREATE TABLE IF NOT EXISTS process_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_code VARCHAR(50) NOT NULL,
    job_name VARCHAR(255) NOT NULL,
    date_recorded DATE,
    worker_count INT,
    process_number INT,
    process_description VARCHAR(255)
);

-- 2. ตารางผู้ปฏิบัติงาน
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- 3. ตารางแผนงานการผลิต (แต่ละงานในแต่ละวัน)
CREATE TABLE IF NOT EXISTS work_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    production_date DATE NOT NULL,
    job_code VARCHAR(50) NOT NULL,
    job_name VARCHAR(255), -- สำหรับงานใหม่/ชั่วคราว
    start_time TIME,
    end_time TIME
);

-- 4. ตารางผู้ปฏิบัติงานในแต่ละแผนงาน
CREATE TABLE IF NOT EXISTS work_plan_operators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_plan_id INT NOT NULL,
    user_id INT,
    id_code VARCHAR(50), -- สำหรับกรณี user_id ยังไม่มี
    FOREIGN KEY (work_plan_id) REFERENCES work_plans(id) ON DELETE CASCADE
);

-- 5. ตาราง log การจับเวลา
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_plan_id INT,
    process_number INT,
    status ENUM('start','stop') NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (work_plan_id) REFERENCES work_plans(id) ON DELETE CASCADE
);

## Flow การทำงาน

หน้า `Form Process.html` — หน้าเพิ่ม/แก้ไขขั้นตอนการผลิต (Form Process)
ผู้ใช้ RD
การทำงาน: เป็นหน้า form ที่เอาไว้ให้ทีม RD สามารถใส่ข้อมูลตามนี้ รหัสสินค้า, ชื่อสินค้า, เลขลำดับขั้นตอนการผลติ, ขั้นตอนการผลิต สามารถใส่ได้ละเอียด
เเละยังสามารถเรียกดูจาก database เพื่อเอาไว้ตรวจเช็ค เเก้ไข อัพเดท เเละสามารถกำหนดให้ผู้ปฎิบัตรงานเห็นได้ว่า Process 1 2 3 ทำอะไร คือ Process ที่ RD ใส่ใน database อาจจะมีเยอะมากเป็น 10 Process

หน้า `workplan.html` — หน้าแผนงานผลิต (Workplan)
ผู้ใช้ เจ้าหน้าที่วางแผนผลิต, หัวหน้าฝ่ายผลิต
การทำงาน: ผู้ใช้จะเข้ามาเพื่อวางแผนการผลิตในเเต่ล่ะวัน โดยข้อมูลที่ใส่จะมี ชื่องาน, ผู้ปฏิบัติงาน 1, ผู้ปฏิบัติงาน 2, ผู้ปฏิบัติงาน 3, ผู้ปฏิบัติงาน 4, เวลาเริ่มต้น, เวลาสิ้นสุด, เครื่องที่ใช้ Tracker, ห้องที่ผลิต
โดยหน้านี้ต้องสามารถปริ้นงานจากหน้า Webได้ ออกมาเป็นเอกสารที่เอาไว้ให้คนหน้างานดู

หน้า `tracker.html` — หน้าจับเวลาการผลิต (Production Timer)
ผู้ใช้ ผู้ปฏิบัติงาน
การทำงาน: ผู้ใช้จะใช้หน้านี้ในการกดจับเวลา โดยสิ่งที่ต้องเเสดงบนจอคือ ชื่องานที่ผลิต รายการขั้นตอนการผลิต (ตามที่ RD กำหนด) 
โดยตอนเริ่มงานผู้ใช้ จะกดเลือกงานก่อนว่า วันนี้ได้รับมอบหมายงานที่เท่าไร (ดูจากหน้า workplan) จากนั้น ชื่อเเละวิธีการผลิต จะเเสดง เมื่อเริ่มจะ กดเริ่มงาน มีเวลาเเสดงว่ากดตอนกี่โมงตามเวลาใรประเทศไทย เเละมีนาฬิกาจับเวลาเริ่มจับเพื่อจับเวลาในขั้นตอนนั้นใช้เวลาเท่าไรจนกดหยุดในขั้นตอนนั้น เมื่อทำทุก Process เสร็จ จะเเสดงสรุปเวลาที่ใช้ในการผลิต

หน้า `dashboard.html` — หน้า Dashboard แสดงสถานะงานผลิต
ผู้ใช้ ผู้บริการ, เจ้าหน้าที่วางแผนผลิต, หัวหน้าฝ่ายผลิต
การทำงาน เป็นหน้าจอหลักในการดูการทำงานของผู้ปฏิบัติงาน ว่าใครทำอะไร เริ่มกี่โมง เวลาตามเเผน เวลาที่ใช้ สถานะการผลิต 
