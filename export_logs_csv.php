<?php 
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=logs.csv');

// ✅ เรียกใช้การตั้งค่าจาก config.php
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT deviceId, number, timestamp, status FROM logs ORDER BY id DESC");

    $output = fopen('php://output', 'w');
    fputcsv($output, ['อุปกรณ์', 'Process', 'เวลา', 'สถานะ']);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, [$row['deviceId'], $row['number'], $row['timestamp'], $row['status']]);
    }

    fclose($output);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit;
}
?>
