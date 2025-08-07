<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
require_once __DIR__ . '/../includes/config_form_process.php';

header('Content-Type: application/json');

// ✅ DEBUG: Log date/job_number ที่รับเข้ามา
$date = $_GET['date'] ?? '';
$jobNumber = $_GET['job_number'] ?? '';
file_put_contents(__DIR__ . "/log.txt", "GET: date=$date, job_number=$jobNumber\n", FILE_APPEND);

// ❌ ถ้าไม่ได้ส่งค่ามา
if (!$date || !$jobNumber) {
    echo json_encode(["error" => "ข้อมูลไม่ครบ"]);
    exit;
}

// ✅ ตรวจสอบว่าในวันที่นี้มี job_number นี้จริงไหม
$stmt = $planDB->prepare("
    SELECT wp.job_code, ps.job_name
    FROM work_plans wp
    LEFT JOIN process_steps ps ON wp.job_code = ps.job_code
    WHERE wp.production_date = :date AND wp.job_number = :job_number
    LIMIT 1
");
$stmt->execute([
    ':date' => $date,
    ':job_number' => $jobNumber
]);

$info = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$info || !$info['job_code']) {
    echo json_encode(["error" => "ไม่พบงานที่เลือก", "debug_date" => $date, "debug_job_number" => $jobNumber]);
    exit;
}

$jobCode = $info['job_code'];
$jobName = $info['job_name'] ?? '';

// ✅ ดึงขั้นตอนการผลิตจาก process_steps ตาม job_code
$stmt2 = $formDB->prepare("
    SELECT process_number, process_description 
    FROM process_steps 
    WHERE job_code = :job_code 
    ORDER BY process_number ASC
");
$stmt2->execute([':job_code' => $jobCode]);
$steps = $stmt2->fetchAll(PDO::FETCH_ASSOC);

// ✅ ส่งข้อมูลกลับ
echo json_encode([
    "job_code" => $jobCode,
    "job_name" => $jobName,
    "steps" => $steps,
    "debug_date" => $date,
    "debug_job_number" => $jobNumber
], JSON_UNESCAPED_UNICODE);
