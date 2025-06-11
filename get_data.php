<?php
header('Content-Type: application/json; charset=utf-8');

// ✅ ดึง config การเชื่อมต่อ MySQL
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM logs ORDER BY id DESC");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($logs);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
