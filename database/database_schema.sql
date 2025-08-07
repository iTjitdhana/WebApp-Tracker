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

CREATE TABLE IF NOT EXISTS finished_flags (
    work_plan_id INT PRIMARY KEY,
    is_finished TINYINT(1) NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (work_plan_id) REFERENCES work_plans(id) ON DELETE CASCADE
);

-- หมายเหตุ: 
-- - ตาราง process_steps ใช้เป็น master สำหรับสินค้าและขั้นตอน
-- - ตาราง users เก็บข้อมูลผู้ปฏิบัติงาน
-- - ตาราง work_plans เก็บแผนงานแต่ละวัน
-- - ตาราง work_plan_operators เก็บผู้ปฏิบัติงานในแต่ละแผนงาน
-- - ตาราง logs เก็บประวัติการจับเวลาแต่ละ process

-- ========================================
-- ตัวอย่างการ INSERT ข้อมูล
-- ========================================

-- 1. เพิ่มผู้ปฏิบัติงานในตาราง users
INSERT INTO users (id_code, name) VALUES 
('EMP001', 'โอเล่'),
('EMP002', 'จรัญ'),
('EMP003', 'เอ'),
('EMP004', 'สาม'),
('EMP005', 'อาร์ม'),
('EMP006', 'พี่ตุ่น'),
('EMP007', 'แมน'),
('EMP008', 'ป้าน้อย'),
('EMP009', 'พี่ภา');

-- 2. เพิ่มแผนงานในตาราง work_plans (ตัวอย่างวันที่ 3/07/2025)
INSERT INTO work_plans (production_date, job_code, job_name, start_time, end_time) VALUES
('2025-07-03', '304011R', 'ปลากระพง 640 - 700 กรัม (ตัว) (Repack)', '14:00:00', '14:15:00'),
('2025-07-03', '305025R', 'ปลาหมึกกล้วยไข่ (Repack)', '14:15:00', '14:30:00'),
('2025-07-03', 'temp-001', 'เนื้อปลากระพงขาวแล่ติดหนัง 300-500g/ชิ้น (Repack)', '14:30:00', '14:45:00'),
('2025-07-03', '235032', 'อกไก่หมัก', '09:00:00', '11:00:00'),
('2025-07-03', '235265', 'พริกแกงส้ม สูตร 2', '09:00:00', '14:00:00'),
('2025-07-03', '235052', 'แป้งไก่มะนาว', '14:00:00', '16:00:00'),
('2025-07-03', '119111', 'Ankimo Pate 250g/pc', '09:00:00', '16:00:00'),
('2025-07-03', '235191R', 'ซอสหมี่กะเฉด (Repack)', '09:00:00', '09:30:00'),
('2025-07-03', 'temp-002', 'ผัก', '11:00:00', '16:00:00'),
('2025-07-03', '235013', 'น้ำจิ้มเมี่ยงคำ', '09:00:00', '12:30:00'),
('2025-07-03', '305024R', 'ปลาหมึกแดดเดียว (Repack)', '13:30:00', '15:00:00'),
('2025-07-03', '235070', 'แป้งทอดมันข้าวโพด', '13:30:00', '15:00:00');

-- 3. เพิ่มผู้ปฏิบัติงานในแต่ละแผนงาน (work_plan_operators)
-- หมายเหตุ: ต้องรัน INSERT work_plans ก่อน เพื่อให้ได้ work_plan_id ที่ถูกต้อง
INSERT INTO work_plan_operators (work_plan_id, id_code) VALUES
(21, 'EMP001'),  -- 304011R - โอเล่
(22, 'EMP001'),  -- 305025R - โอเล่
(23, 'EMP001'),  -- temp-001 - โอเล่
(24, 'EMP003'),  -- 235032 - เอ
(24, 'EMP004'),  -- 235032 - สาม
(25, 'EMP005'),  -- 235265 - อาร์ม
(26, 'EMP005'),  -- 235052 - อาร์ม
(27, 'EMP006'),  -- 119111 - พี่ตุ่น
(27, 'EMP007'),  -- 119111 - แมน
(28, 'EMP008'),  -- 235191R - ป้าน้อย
(29, 'EMP008'),  -- temp-002 - ป้าน้อย
(29, 'EMP003'),  -- temp-002 - เอ
(29, 'EMP004'),  -- temp-002 - สาม
(30, 'EMP002'),  -- 235013 - จรัญ
(31, 'EMP002'),  -- 305024R - จรัญ
(32, 'EMP009');  -- 235070 - พี่ภา

-- ========================================
-- คำสั่งตรวจสอบข้อมูล
-- ========================================

-- ตรวจสอบผู้ปฏิบัติงาน
SELECT * FROM users ORDER BY id_code;

-- ตรวจสอบแผนงาน
SELECT * FROM work_plans WHERE production_date = '2025-07-03' ORDER BY id;

-- ตรวจสอบผู้ปฏิบัติงานในแต่ละแผนงาน
SELECT 
    wp.id,
    wp.job_code,
    wp.job_name,
    GROUP_CONCAT(u.name SEPARATOR ', ') as operators
FROM work_plans wp
LEFT JOIN work_plan_operators wpo ON wp.id = wpo.work_plan_id
LEFT JOIN users u ON wpo.id_code = u.id_code
WHERE wp.production_date = '2025-07-03'
GROUP BY wp.id
ORDER BY wp.id; 