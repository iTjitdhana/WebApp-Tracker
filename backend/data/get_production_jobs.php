<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

$date = $_GET['date'] ?? date('Y-m-d');

try {
    $stmt = $planDB->prepare("SELECT id, job_code, job_name, production_date, start_time, end_time FROM work_plans WHERE production_date = :date ORDER BY id ASC");
    $stmt->execute([':date' => $date]);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (empty($jobs)) {
        echo json_encode(['status' => 'success', 'data' => []]);
        exit;
    }
    $jobCodeToName = [];
    $jobCodes = array_filter(array_unique(array_column($jobs, 'job_code')));
    if (count($jobCodes) > 0) {
        $in = implode(',', array_fill(0, count($jobCodes), '?'));
        $psStmt = $planDB->prepare("SELECT DISTINCT job_code, job_name FROM process_steps WHERE job_code IN ($in)");
        $psStmt->execute(array_values($jobCodes));
        foreach ($psStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $jobCodeToName[$row['job_code']] = $row['job_name'];
        }
    }
    foreach ($jobs as $i => &$job) {
        $job['job_number'] = $i + 1;
        if (isset($jobCodeToName[$job['job_code']])) {
            $job['job_name'] = $jobCodeToName[$job['job_code']];
        }
    }
    echo json_encode(['status' => 'success', 'data' => $jobs]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 