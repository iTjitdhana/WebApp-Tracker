<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

$job_code = $_GET['job_code'] ?? '';
if (!$job_code) {
    echo json_encode(['status' => 'error', 'message' => 'Missing job_code']);
    exit;
}

try {
    $stmt = $planDB->prepare("SELECT process_number, process_description FROM process_steps WHERE job_code = ? ORDER BY process_number ASC");
    $stmt->execute([$job_code]);
    $steps = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $steps]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 