<?php
// ✅ ตั้งค่าการเชื่อมต่อฐานข้อมูลในที่เดียว
define('DB_HOST', '192.168.0.93');
define('DB_NAME', 'esp_tracker');
define('DB_USER', 'it.jitdhana');
define('DB_PASS', 'iT12345$'); // ใส่รหัสผ่าน MySQL ตรงนี้ถ้ามี

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8',
        DB_USER,
        DB_PASS
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
?>
