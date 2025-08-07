<?php
// ✅ ตั้งค่าการเชื่อมต่อฐานข้อมูล work_plans
define('PLAN_DB_HOST', 'localhost');
define('PLAN_DB_NAME', 'esp_tracker');
define('PLAN_DB_USER', 'root');
define('PLAN_DB_PASS', ''); // 🔒 หากมีรหัสผ่านใส่ไว้ตรงนี้

try {
    $planDB = new PDO(
        'mysql:host=' . PLAN_DB_HOST . ';dbname=' . PLAN_DB_NAME . ';charset=utf8mb4',
        PLAN_DB_USER,
        PLAN_DB_PASS
    );
    $planDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ ไม่สามารถเชื่อมต่อฐานข้อมูล work_plans ได้: " . $e->getMessage());
}
?>
