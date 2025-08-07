<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

$date = $_GET['date'] ?? date('Y-m-d');

try {
    $stmt = $planDB->prepare("SELECT id, job_code, job_name, production_date, start_time, end_time FROM work_plans WHERE production_date = :date ORDER BY id ASC");
    $stmt->execute([':date' => $date]);
    $workplans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // เพิ่ม job_number (ลำดับงานในวันนั้น)
    foreach ($workplans as $i => &$wp) {
        $wp['job_number'] = $i + 1;
    }
    echo json_encode(['status' => 'success', 'data' => $workplans]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 