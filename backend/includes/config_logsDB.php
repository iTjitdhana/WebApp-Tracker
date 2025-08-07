<?php
// ✅ ตั้งค่าการเชื่อมต่อฐานข้อมูล logs
define('LOGS_DB_HOST', 'localhost');
define('LOGS_DB_NAME', 'esp_tracker'); // ✅ เปลี่ยนจาก 'logs' เป็น 'esp_tracker'
define('LOGS_DB_USER', 'root');
define('LOGS_DB_PASS', ''); // ใส่รหัสผ่านหากมี


try {
    $logsDB = new PDO("mysql:host=localhost;dbname=esp_tracker;charset=utf8", "root", "");
    $logsDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("เชื่อมต่อฐานข้อมูลไม่ได้: " . $e->getMessage());
}
