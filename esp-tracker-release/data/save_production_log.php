<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$work_plan_id = $_POST['work_plan_id'] ?? null;
$process_number = $_POST['process_number'] ?? null;
$status = $_POST['status'] ?? null;
$timestamp = $_POST['timestamp'] ?? date('Y-m-d H:i:s');

if (!$work_plan_id || !$process_number || !$status) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $planDB->prepare("INSERT INTO logs (work_plan_id, process_number, status, timestamp) VALUES (?, ?, ?, ?)");
    $stmt->execute([$work_plan_id, $process_number, $status, $timestamp]);
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 