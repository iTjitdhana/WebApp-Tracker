<?php
header('Content-Type: application/json');
date_default_timezone_set('Asia/Bangkok');

require_once __DIR__ . '/../includes/config_logsDB.php';
require_once __DIR__ . '/../includes/config_workplanDB.php';
require_once __DIR__ . '/../includes/config_form_process.php';

$today = date('Y-m-d');

// 1. ดึงแผนงานของวันนี้
$planStmt = $planDB->prepare("SELECT * FROM work_plans WHERE production_date = ?");
$planStmt->execute([$today]);
$plans = $planStmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($plans)) {
  echo json_encode([]);
  exit;
}

// 2. job_code ที่มีในแผน
$jobCodes = array_column($plans, 'job_code');
$placeholders = implode(',', array_fill(0, count($jobCodes), '?'));

// 3. ดึง log ที่เกี่ยวข้อง (แบบไม่สน case: START/Stop)
$logStmt = $logsDB->prepare("
  SELECT job_number,
         MIN(CASE WHEN LOWER(status) = 'start' THEN timestamp END) AS start_time,
         MAX(CASE WHEN LOWER(status) = 'stop' THEN timestamp END) AS stop_time,
         MAX(timestamp) AS last_log_time,
         MAX(status) AS last_status,
         MAX(number) AS last_worker
  FROM logs
  WHERE DATE(timestamp) = ?
    AND job_number IN ($placeholders)
  GROUP BY job_number
");
$logStmt->execute(array_merge([$today], $jobCodes));
$logs = $logStmt->fetchAll(PDO::FETCH_ASSOC);

$logMap = [];
foreach ($logs as $log) {
  $logMap[$log['job_number']] = $log;
}

// 4. ดึงชื่อ job จาก process_steps
$stepStmt = $formDB->query("SELECT * FROM process_steps");
$steps = $stepStmt->fetchAll(PDO::FETCH_ASSOC);
$stepMap = [];
foreach ($steps as $s) {
  $stepMap[$s['job_code']] = $s['job_name'];
}

// 5. เรียงตาม job_code
usort($plans, fn($a, $b) => $a['job_code'] <=> $b['job_code']);

// 6. เตรียม output
$output = [];
$index = 1;

foreach ($plans as $plan) {
  $jobNumber = $plan['job_number']; // << ใช้ job_number
  $jobCode = $plan['job_code'];

  $startPlan = $plan['start_time'] ?? null;
  $endPlan = $plan['end_time'] ?? null;

  $targetDuration = ($startPlan && $endPlan)
    ? round((strtotime($endPlan) - strtotime($startPlan)) / 60)
    : null;

  $log = $logMap[$jobNumber] ?? null; // << ใช้ job_number ตรงกัน

  $actualStart = $log && $log['start_time'] ? strtotime($log['start_time']) : null;
  $actualEnd = $log && $log['stop_time'] ? strtotime($log['stop_time']) : null;
  $actualDuration = ($actualStart && $actualEnd)
    ? round(($actualEnd - $actualStart) / 60)
    : null;

  $status = 'pending';
  if ($actualStart && $actualEnd) {
    $status = 'completed';
  } elseif ($actualStart && !$actualEnd) {
    $status = 'in-progress';
  }

  $output[] = [
    'id' => $index++,
    'jobName' => $stepMap[$jobCode] ?? '–',
    'worker' => $log['last_worker'] ?? '–',
    'timeRange' => ($startPlan && $endPlan)
      ? date('H:i', strtotime($startPlan)) . '-' . date('H:i', strtotime($endPlan))
      : '–',
    'startTime' => $actualStart ? date('H:i', $actualStart) : '–',
    'targetDuration' => $targetDuration ? gmdate("G:i", $targetDuration * 60) : '–',
    'actualDuration' => $actualDuration ? gmdate("G:i", $actualDuration * 60) : '–',
    'status' => $status
  ];
}


echo json_encode($output);
