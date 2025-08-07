<?php
require_once('configworkplanDB.php');

$data = json_decode(file_get_contents("php://input"), true);

foreach ($data as $row) {
  $deviceId = $conn->real_escape_string($row['id']);
  $jobName = $conn->real_escape_string($row['name']);
  $operator = $conn->real_escape_string($row['operator']);
  $start = $conn->real_escape_string($row['start']);
  $end = $conn->real_escape_string($row['end']);
  $planDate = $conn->real_escape_string($row['plan_date']); // 🆕

  $sql = "INSERT INTO work_plans (device_id, plan_date, job_name, operator_name, start_plan, end_plan)
          VALUES ('$deviceId', '$planDate', '$jobName', '$operator', '$start', '$end')
          ON DUPLICATE KEY UPDATE
            plan_date='$planDate',
            job_name='$jobName',
            operator_name='$operator',
            start_plan='$start',
            end_plan='$end'";

  $conn->query($sql);
}

$conn->close();
echo "บันทึกสำเร็จ";
?>
