<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';
header('Content-Type: application/json');

try {
    $stmt = $planDB->query("SELECT id, id_code, name FROM users ORDER BY name ASC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['status' => 'success', 'data' => $users]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 