<?php
require_once __DIR__ . '/backend/includes/config_workplanDB.php';
require_once __DIR__ . '/backend/includes/config_logsDB.php';
require_once __DIR__ . '/backend/includes/config_form_process.php';

echo "<h2>ตรวจสอบข้อมูลในตารางต่างๆ</h2>";

// ตรวจสอบ work_plans
echo "<h3>1. ตาราง work_plans (วันที่ 2025-07-03)</h3>";
$stmt = $planDB->prepare("SELECT * FROM work_plans WHERE production_date = '2025-07-03' ORDER BY id");
$stmt->execute();
$workplans = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($workplans);
echo "</pre>";

// ตรวจสอบ work_plan_operators
echo "<h3>2. ตาราง work_plan_operators</h3>";
$stmt = $planDB->prepare("SELECT * FROM work_plan_operators ORDER BY work_plan_id");
$stmt->execute();
$operators = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($operators);
echo "</pre>";

// ตรวจสอบ users
echo "<h3>3. ตาราง users</h3>";
$stmt = $planDB->prepare("SELECT * FROM users ORDER BY id_code");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($users);
echo "</pre>";

// ตรวจสอบ process_steps
echo "<h3>4. ตาราง process_steps</h3>";
$stmt = $formDB->prepare("SELECT * FROM process_steps ORDER BY job_code, process_number");
$stmt->execute();
$steps = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($steps);
echo "</pre>";

// ตรวจสอบ logs
echo "<h3>5. ตาราง logs</h3>";
$stmt = $logsDB->prepare("SELECT * FROM logs ORDER BY work_plan_id, process_number, timestamp");
$stmt->execute();
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "<pre>";
print_r($logs);
echo "</pre>";
?> 