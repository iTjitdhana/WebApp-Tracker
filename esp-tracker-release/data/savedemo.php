<?php
require_once __DIR__ . '/../includes/config_logsDB.php';

header('Content-Type: application/json');

// รับค่า JSON
$input = json_decode(file_get_contents("php://input"), true);

$jobNumber = $input['job_number'] ?? '';
$number = $input['number'] ?? '';
$timestamp = $input['timestamp'] ?? '';
$status = $input['status'] ?? '';

if (!$jobNumber || !$number || !$timestamp || !$status) {
    echo json_encode(['error' => 'ข้อมูลไม่ครบ']);
    exit;
}

// เพิ่มข้อมูลลงตาราง logs
$stmt = $logsDB->prepare("
    INSERT INTO logs (job_number, number, timestamp, status, synced)
    VALUES (:job_number, :number, :timestamp, :status, 0)
");

try {
    $stmt->execute([
        ':job_number' => $jobNumber,
        ':number' => $number,
        ':timestamp' => $timestamp,
        ':status' => $status
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'ไม่สามารถบันทึกได้: ' . $e->getMessage()]);
}
