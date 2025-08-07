<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

$job_code = $_GET['job_code'] ?? '';
if (!$job_code) {
    echo json_encode(['status' => 'error', 'message' => 'Missing job_code']);
    exit;
}

try {
    // ดึงข้อมูลสินค้าและขั้นตอนการผลิต
    $stmt = $planDB->prepare("SELECT * FROM process_steps WHERE job_code = ? ORDER BY process_number ASC");
    $stmt->execute([$job_code]);
    $steps = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($steps) > 0) {
        // มีข้อมูลอยู่แล้ว
        $firstStep = $steps[0];
        echo json_encode([
            'status' => 'found',
            'data' => $steps,
            'job_name' => $firstStep['job_name'],
            'worker_count' => $firstStep['worker_count']
        ]);
    } else {
        // ไม่มีข้อมูล
        echo json_encode([
            'status' => 'not_found',
            'message' => 'ไม่พบข้อมูลสำหรับรหัสสินค้านี้'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} 