<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';

$date = $_GET['date'] ?? '';

if (!$date) {
    echo json_encode([]);
    exit;
}

try {
    // แปลงรูปแบบวันที่ให้เป็น yyyy-mm-dd (รองรับทั้ง dd/mm/yyyy และ yyyy-mm-dd)
    if (strpos($date, '/') !== false) {
        $parts = explode('/', $date);
        if (count($parts) === 3) {
            // dd/mm/yyyy → yyyy-mm-dd
            $date = "{$parts[2]}-{$parts[1]}-{$parts[0]}";
        }
    }

    // ตรวจสอบว่ารูปแบบยังไม่ถูกต้อง
    $date = date('Y-m-d', strtotime($date));

    // ดึงข้อมูลแผนจากตาราง work_plans
    $stmt = $planDB->prepare("SELECT * FROM work_plans WHERE production_date = :production_date ORDER BY job_number ASC");
    $stmt->execute([':production_date' => $date]);
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($plans as &$plan) {
        // ดึง operator ที่เกี่ยวข้อง
        $opStmt = $planDB->prepare("SELECT id_code FROM work_plan_operators WHERE work_plan_id = :id");
        $opStmt->execute([':id' => $plan['id']]);
        $operators = $opStmt->fetchAll(PDO::FETCH_COLUMN);

        // ใส่ operator ให้ครบ 4 ตำแหน่ง
        while (count($operators) < 4) {
            $operators[] = '';
        }

        $plan['operators'] = $operators;
    }

    echo json_encode($plans);
} catch (Exception $e) {
    echo json_encode([]);
}
