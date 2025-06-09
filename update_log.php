<?php
header('Content-Type: application/json; charset=utf-8');

// ✅ ดึง config การเชื่อมต่อ MySQL
require_once 'config.php';

if (isset($_POST['delete']) && $_POST['delete'] == 1) {
    $id = $_POST['id'] ?? '';
    try {
        $stmt = $pdo->prepare("DELETE FROM logs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "deleted"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    // ✅ อัปเดตข้อมูล
    $id = $_POST['id'] ?? '';
    $deviceId = $_POST['deviceId'] ?? '';
    $number = $_POST['number'] ?? '';
    $timestamp = $_POST['timestamp'] ?? '';

    try {
        $stmt = $pdo->prepare("UPDATE logs SET deviceId = ?, number = ?, timestamp = ? WHERE id = ?");
        $stmt->execute([$deviceId, $number, $timestamp, $id]);
        echo json_encode(["status" => "updated"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
