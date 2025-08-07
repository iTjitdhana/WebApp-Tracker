<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

try {
    $stmt = $planDB->query("SELECT DISTINCT job_code, job_name FROM process_steps ORDER BY job_name ASC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $products]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 