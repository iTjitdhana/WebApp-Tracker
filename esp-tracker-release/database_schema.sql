-- ฐานข้อมูลสำหรับระบบจับเวลาการผลิต (Food Production Timer)
-- สร้างโดย AI ตามคำขอผู้ใช้

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

-- หมายเหตุ: 
-- - ตาราง process_steps ใช้เป็น master สำหรับสินค้าและขั้นตอน
-- - ตาราง users เก็บข้อมูลผู้ปฏิบัติงาน
-- - ตาราง work_plans เก็บแผนงานแต่ละวัน
-- - ตาราง work_plan_operators เก็บผู้ปฏิบัติงานในแต่ละแผนงาน
-- - ตาราง logs เก็บประวัติการจับเวลาแต่ละ process 