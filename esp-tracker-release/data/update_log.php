<?php
require_once __DIR__ . '/../config_logsDB.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? null;

  if (isset($_POST['delete']) && $id) {
    // ลบข้อมูล
    $stmt = $logsDB->prepare("DELETE FROM logs WHERE id = :id");
    $stmt->execute([':id' => $id]);
    echo "deleted";
    exit;
  }

  $job_number = $_POST['job_number'] ?? null;
  $number = $_POST['number'] ?? null;
  $timestamp = $_POST['timestamp'] ?? null;

  if (!$id || !$job_number || !$number || !$timestamp) {
    http_response_code(400);
    echo "ข้อมูลไม่ครบ";
    exit;
  }

  try {
    $stmt = $logsDB->prepare("UPDATE logs SET job_number = :job_number, number = :number, timestamp = :timestamp WHERE id = :id");
    $stmt->execute([
      ':id' => $id,
      ':job_number' => $job_number,
      ':number' => $number,
      ':timestamp' => $timestamp
    ]);
    echo "updated";
  } catch (PDOException $e) {
    http_response_code(500);
    echo "error: " . $e->getMessage();
  }
}
