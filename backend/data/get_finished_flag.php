<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');
$work_plan_id = $_GET['work_plan_id'] ?? null;
if (!$work_plan_id) {
    echo json_encode(['is_finished' => 0]);
    exit;
}
$stmt = $planDB->prepare("SELECT is_finished FROM finished_flags WHERE work_plan_id = ?");
$stmt->execute([$work_plan_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode(['is_finished' => $row ? $row['is_finished'] : 0]); 