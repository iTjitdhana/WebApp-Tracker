<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../includes/config_workplanDB.php';

$date = $_GET['date'] ?? null;
if (!$date) {
    echo json_encode(['status' => 'error', 'message' => 'Missing date']);
    exit;
}

try {
    // ดึงแผนงานทั้งหมดในวันนั้น
    $stmt = $planDB->prepare("SELECT wp.id, wp.production_date, wp.job_code, wp.job_name as wp_job_name, wp.start_time, wp.end_time
        FROM work_plans wp
        WHERE wp.production_date = :date
        ORDER BY wp.id ASC");
    $stmt->execute([':date' => $date]);
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // เตรียมดึง job_name จาก process_steps
    $jobCodeToName = [];
    $jobCodes = array_unique(array_column($plans, 'job_code'));
    if (count($jobCodes) > 0) {
        $in = str_repeat('?,', count($jobCodes)-1) . '?';
        $psStmt = $planDB->prepare("SELECT DISTINCT job_code, job_name FROM process_steps WHERE job_code IN ($in)");
        $psStmt->execute($jobCodes);
        foreach ($psStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $jobCodeToName[$row['job_code']] = $row['job_name'];
        }
    }

    // ดึง operators ของแต่ละแผน
    foreach ($plans as &$plan) {
        $opStmt = $planDB->prepare("SELECT u.id, u.name FROM work_plan_operators wpo JOIN users u ON wpo.user_id = u.id WHERE wpo.work_plan_id = ?");
        $opStmt->execute([$plan['id']]);
        $plan['operators'] = $opStmt->fetchAll(PDO::FETCH_ASSOC);
        // job_name: ถ้าเป็นงานปกติใช้จาก process_steps, ถ้าไม่เจอใช้ wp_job_name
        $plan['job_name'] = $jobCodeToName[$plan['job_code']] ?? $plan['wp_job_name'];
        unset($plan['wp_job_name']);
    }

    echo json_encode(['status' => 'success', 'data' => $plans]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
