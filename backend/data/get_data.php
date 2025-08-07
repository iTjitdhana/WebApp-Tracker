<?php
require_once __DIR__ . '/../includes/config_logsDB.php'; // แก้ path แล้ว

try {
  $stmt = $logsDB->prepare("SELECT * FROM logs ORDER BY id DESC");
  $stmt->execute();
  $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(["status" => "success", "data" => $data], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "status" => "error",
    "message" => "เกิดข้อผิดพลาด: " . $e->getMessage()
  ], JSON_UNESCAPED_UNICODE);
}
