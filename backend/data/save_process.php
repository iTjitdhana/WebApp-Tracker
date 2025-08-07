<?php
require_once __DIR__ . '/../includes/config_form_process.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $job_code = $_POST['job_code'] ?? '';
  $job_name = $_POST['job_name'] ?? '';
  $worker_count = isset($_POST['worker_count']) && $_POST['worker_count'] !== ''
    ? intval($_POST['worker_count']) : 0;

  $steps = $_POST['steps'] ?? [];
  $date_recorded = date('Y-m-d');
  $overwrite = $_POST['overwrite'] ?? 'no';

  // ตรวจสอบข้อมูลเบื้องต้น
  if (!$job_code || !$job_name || count($steps) === 0) {
    echo json_encode([
      'status' => 'error',
      'message' => 'กรุณากรอกข้อมูลให้ครบถ้วน'
    ]);
    exit;
  }

  try {
    // เช็กว่ามีรหัสงานนี้อยู่แล้วหรือยัง
    $check = $formDB->prepare("SELECT id FROM process_steps WHERE job_code = ? LIMIT 1");
    $check->execute([$job_code]);
    $exists = $check->rowCount() > 0;

    // ถ้ายังไม่ได้อนุญาตให้ overwrite ให้ไปหน้ายืนยัน
    if ($exists && $overwrite !== 'yes') {
      session_start();
      $_SESSION['form_data'] = $_POST;
      echo json_encode([
        'status' => 'confirm_overwrite',
        'redirect' => 'confirm_overwrite.php?job_code=' . urlencode($job_code)
      ]);
      exit;
    }

    // เริ่ม transaction
    $formDB->beginTransaction();

    // ลบข้อมูลเก่าทั้งหมดก่อน insert ใหม่
    $delete = $formDB->prepare("DELETE FROM process_steps WHERE job_code = ?");
    $delete->execute([$job_code]);

    // เตรียม statement สำหรับ insert
    $stmt = $formDB->prepare("INSERT INTO process_steps (job_code, job_name, date_recorded, worker_count, process_number, process_description) VALUES (?, ?, ?, ?, ?, ?)");

    $step_number = 1;
    $inserted_count = 0;
    
    foreach ($steps as $step_description) {
      $step_description = trim($step_description);
      if ($step_description === '') continue;

      $stmt->execute([$job_code, $job_name, $date_recorded, $worker_count, $step_number, $step_description]);
      $inserted_count++;
      $step_number++;
    }

    // commit transaction
    $formDB->commit();

    echo json_encode([
      'status' => 'success',
      'message' => "บันทึกข้อมูลสำเร็จ! เพิ่ม {$inserted_count} ขั้นตอน",
      'redirect' => '../index.html'
    ]);

  } catch (Exception $e) {
    // rollback ถ้าเกิดข้อผิดพลาด
    if ($formDB->inTransaction()) {
      $formDB->rollBack();
    }
    
    echo json_encode([
      'status' => 'error',
      'message' => 'เกิดข้อผิดพลาดในการบันทึก: ' . $e->getMessage()
    ]);
  }
} else {
  echo json_encode([
    'status' => 'error',
    'message' => 'ไม่อนุญาตให้เข้าถึงโดยตรง'
  ]);
}
