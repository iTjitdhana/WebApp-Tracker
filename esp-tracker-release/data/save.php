<?php
require_once __DIR__ . '/../config_logsDB.php';
date_default_timezone_set("Asia/Bangkok");

// รับค่าจาก POST
$job_number = $_POST['job_number'] ?? null;
$number = $_POST['number'] ?? null;
$timestamp = $_POST['timestamp'] ?? null;
$status = $_POST['status'] ?? null;

if (!$job_number || !$number || !$timestamp || !$status) {
  http_response_code(400);
  echo "ข้อมูลไม่ครบ";
  exit;
}

try {
  $stmt = $logsDB->prepare("INSERT INTO logs (job_number, number, timestamp, status) VALUES (:job_number, :number, :timestamp, :status)");
  $stmt->execute([
    ":job_number" => $job_number,
    ":number" => $number,
    ":timestamp" => $timestamp,
    ":status" => $status
  ]);
  echo "success";
} catch (PDOException $e) {
  http_response_code(500);
  echo "error: " . $e->getMessage();
}
