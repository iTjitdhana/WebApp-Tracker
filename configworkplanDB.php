<?php
$host = "localhost";             // หรือชื่อ host ของคุณ เช่น "127.0.0.1"
$user = "root";                  // ชื่อผู้ใช้ MySQL
$password = "";                  // รหัสผ่าน (XAMPP ปกติเป็นค่าว่าง)
$dbname = "workplan_db";         // 👉 เปลี่ยนให้ตรงกับชื่อฐานข้อมูลของคุณ

$conn = new mysqli($host, $user, $password, $dbname);

// ตรวจสอบการเชื่อมต่อ
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
