<?php
// ✅ ตั้งค่าการเชื่อมต่อฐานข้อมูล process_steps ด้วย PDO
define('FORM_DB_HOST', 'localhost');
define('FORM_DB_NAME', 'esp_tracker');
define('FORM_DB_USER', 'root');
define('FORM_DB_PASS', ''); // ถ้ามีรหัสผ่านให้ใส่ตรงนี้

try {
    $formDB = new PDO(
        'mysql:host=' . FORM_DB_HOST . ';dbname=' . FORM_DB_NAME . ';charset=utf8mb4',
        FORM_DB_USER,
        FORM_DB_PASS
    );
    $formDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ ไม่สามารถเชื่อมต่อฐานข้อมูล process_steps ได้: " . $e->getMessage());
}
