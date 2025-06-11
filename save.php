<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ ดึง config การเชื่อมต่อฐานข้อมูล
require_once 'config.php';

// ✅ รับค่าจาก Frontend
$deviceId  = $_POST['deviceId']  ?? '';
$number    = $_POST['number']    ?? '';
$timestamp = $_POST['timestamp'] ?? '';
$sheetName = $_POST['sheetName'] ?? 'Data';
$status    = $_POST['status']    ?? 'unknown';

// ✅ DEBUG log POST
file_put_contents("debug.log", json_encode($_POST) . PHP_EOL, FILE_APPEND);

try {
    $stmt = $pdo->prepare("
        INSERT INTO logs (deviceId, number, timestamp, sheetName, status, synced)
        VALUES (?, ?, ?, ?, ?, 0)
    ");
    $stmt->execute([$deviceId, $number, $timestamp, $sheetName, $status]);

    echo json_encode(["status" => "ok", "message" => "Saved"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
