<?php
require_once('configworkplanDB.php'); // ใช้สำหรับเชื่อมฐานข้อมูล work_plans

$result = $conn->query("SELECT * FROM work_plans ORDER BY device_id ASC");

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[$row['device_id']] = $row;
}

echo json_encode($data);
?>
