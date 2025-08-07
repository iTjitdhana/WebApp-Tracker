<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

$work_plan_id = $_POST['work_plan_id'] ?? null;
$is_finished = $_POST['is_finished'] ?? null;

if (!$work_plan_id || !isset($is_finished)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $planDB->prepare("INSERT INTO finished_flags (work_plan_id, is_finished) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE is_finished = VALUES(is_finished), updated_at = CURRENT_TIMESTAMP");
    $stmt->execute([$work_plan_id, $is_finished]);
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 