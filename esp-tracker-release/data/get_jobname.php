<?php
header('Content-Type: application/json');

require_once(__DIR__ . '/db_connect.php'); // ปรับตามตำแหน่งจริง

try {
    $stmt = $conn->prepare("SELECT DISTINCT job_code, job_name FROM process_steps ORDER BY job_name");
    $stmt->execute();
    $result = $stmt->get_result();

    $jobs = [];
    while ($row = $result->fetch_assoc()) {
        $jobs[] = $row;
    }

    echo json_encode($jobs, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'เกิดข้อผิดพลาดในการดึงข้อมูล']);
}
