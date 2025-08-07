<?php
header('Content-Type: application/json');
date_default_timezone_set('Asia/Bangkok');

// เพิ่ม error reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
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

  // 2. id ที่มีในแผน
  $planIds = array_column($plans, 'id');
  if (empty($planIds)) {
    echo json_encode([]);
    exit;
  }
  $placeholders = implode(',', array_fill(0, count($planIds), '?'));

  // 3. ดึง log ที่เกี่ยวข้อง (แก้ไข SQL ให้ไม่ใช้คอลัมน์ number)
  $logStmt = $logsDB->prepare("
    SELECT work_plan_id, process_number, status, timestamp
    FROM logs
    WHERE DATE(timestamp) = ?
      AND work_plan_id IN ($placeholders)
    ORDER BY work_plan_id, process_number ASC, timestamp ASC
  ");
  $logStmt->execute(array_merge([$today], $planIds));
  $logs = $logStmt->fetchAll(PDO::FETCH_ASSOC);

  // map log ตามแผน
  $logMap = [];
  foreach ($logs as $log) {
    $wpid = $log['work_plan_id'];
    $pn = $log['process_number'];
    if (!isset($logMap[$wpid])) $logMap[$wpid] = [];
    if (!isset($logMap[$wpid][$pn])) $logMap[$wpid][$pn] = [];
    $logMap[$wpid][$pn][] = $log;
  }

  // 4. ดึงชื่อ job จาก process_steps
  $stepStmt = $formDB->query("SELECT * FROM process_steps");
  $steps = $stepStmt->fetchAll(PDO::FETCH_ASSOC);
  $stepMap = [];
  $maxProcessMap = [];
  foreach ($steps as $s) {
    $stepMap[$s['job_code']] = $s['job_name'];
    // หา process_number ที่มากที่สุดของแต่ละ job_code
    if (!isset($maxProcessMap[$s['job_code']]) || $s['process_number'] > $maxProcessMap[$s['job_code']]) {
      $maxProcessMap[$s['job_code']] = $s['process_number'];
    }
  }

  // 5. เตรียม output
  $output = [];
  $index = 1;
  foreach ($plans as $plan) {
    $planId = $plan['id'];
    $jobCode = $plan['job_code'] ?? '';

    $startPlan = $plan['start_time'] ?? null;
    $endPlan = $plan['end_time'] ?? null;

    $targetDuration = ($startPlan && $endPlan)
      ? intval(round((strtotime($endPlan) - strtotime($startPlan)) / 60))
      : null;

    // หหา process_number ที่มากที่สุดของงานนี้
    $maxProcess = $maxProcessMap[$jobCode] ?? null;
    $logsOfPlan = $logMap[$planId] ?? [];

    // หาเวลาเริ่มจริง (startTime) จาก log แรกสุดที่ status = 'start'
    $firstStartTime = null;
    foreach ($logsOfPlan as $processLogs) {
      foreach ($processLogs as $log) {
        if (strtolower($log['status']) === 'start') {
          $firstStartTime = $log['timestamp'];
          break 2;
        }
      }
    }

    // เวลาผลิต: รวมเวลาของแต่ละ process (start ถึง stop) แบบ robust และแสดง H:i
    $totalUsedSeconds = 0;
    foreach ($logsOfPlan as $processLogs) {
      $procStart = null;
      foreach ($processLogs as $log) {
        if (strtolower($log['status']) === 'start') {
          $procStart = strtotime($log['timestamp']);
        }
        if (strtolower($log['status']) === 'stop' && $procStart) {
          $procEnd = strtotime($log['timestamp']);
          $diff = $procEnd - $procStart;
          if ($diff > 0 && $diff < 86400) { // ไม่ติดลบและไม่เกิน 24 ชม.
            $totalUsedSeconds += $diff;
          }
          $procStart = null;
        }
      }
      // ถ้ามี start ค้างไว้แต่ไม่มี stop
      if ($procStart) {
        $diff = time() - $procStart;
        if ($diff > 0 && $diff < 86400) {
          $totalUsedSeconds += $diff;
        }
      }
    }
    $actualDuration = $totalUsedSeconds > 0
      ? sprintf('%02d:%02d', floor($totalUsedSeconds/3600), ($totalUsedSeconds/60)%60)
      : '–';

    // ถ้ามี field cancelled/cancel_flag ใน work_plans ให้ใช้ ถ้าไม่มีให้ default = 0
    $isCancelled = isset($plan['cancelled']) ? $plan['cancelled'] : (isset($plan['cancel_flag']) ? $plan['cancel_flag'] : 0);

    // ตรวจสอบสถานะงานตาม logic ใหม่
    $isAnyProcessStarted = false;
    $isAllProcessStartedAndStopped = true;
    if ($maxProcess) {
      for ($pn = 1; $pn <= $maxProcess; $pn++) {
        $hasStart = false;
        $hasStop = false;
        if (isset($logsOfPlan[$pn])) {
          foreach ($logsOfPlan[$pn] as $log) {
            if (strtolower($log['status']) === 'start') $hasStart = true;
            if (strtolower($log['status']) === 'stop') $hasStop = true;
          }
        }
        if ($hasStart) $isAnyProcessStarted = true;
        if (!($hasStart && $hasStop)) $isAllProcessStartedAndStopped = false;
      }
    }

    $status = 'pending';
    if ($isCancelled) {
      $status = 'cancelled';
    } elseif ($maxProcess && $isAllProcessStartedAndStopped) {
      $status = 'completed';
    } elseif ($isAnyProcessStarted) {
      $status = 'in-progress';
    }

    // ดึงชื่อผู้ปฏิบัติงาน (worker) จาก work_plan_operators + users
    $opStmt = $planDB->prepare("SELECT u.name FROM work_plan_operators wpo JOIN users u ON wpo.id_code = u.id_code WHERE wpo.work_plan_id = ?");
    $opStmt->execute([$planId]);
    $operators = $opStmt->fetchAll(PDO::FETCH_COLUMN);
    $worker = count($operators) > 0 ? implode(", ", $operators) : '–';

    $output[] = [
      'id' => $index++,
      'jobName' => $stepMap[$jobCode] ?? ($plan['job_name'] ?? '–'),
      'worker' => $worker,
      'timeRange' => ($startPlan && $endPlan)
        ? date('H:i', strtotime($startPlan)) . '-' . date('H:i', strtotime($endPlan))
        : '–',
      'startTime' => $firstStartTime ? date('H:i', strtotime($firstStartTime)) : '–',
      'targetDuration' => $targetDuration ? gmdate("G:i", $targetDuration * 60) : '–',
      'actualDuration' => $actualDuration,
      'status' => $status
    ];
  }

  echo json_encode($output);

} catch (Exception $e) {
  // ส่ง error กลับไป
  http_response_code(500);
  // log error ลงไฟล์ debug.log
  file_put_contents(__DIR__.'/../logs/debug.log', date('c')."\n".print_r($e, true)."\n", FILE_APPEND);
  echo json_encode([
    'error' => true,
    'message' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine()
  ]);
} 