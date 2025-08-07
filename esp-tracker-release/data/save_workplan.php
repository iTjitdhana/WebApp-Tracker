<?php
require_once __DIR__ . '/../includes/config_workplanDB.php';

function isValidTime($time) {
    return preg_match('/^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/', $time);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $production_date = $_POST['production_date'] ?? '';

    $work_plan_ids = $_POST['work_plan_id'] ?? [];
    $job_codes = $_POST['job_code'] ?? [];
    $job_names = $_POST['job_name'] ?? [];
    $operators1 = $_POST['operator1'] ?? [];
    $operators2 = $_POST['operator2'] ?? [];
    $operators3 = $_POST['operator3'] ?? [];
    $operators4 = $_POST['operator4'] ?? [];
    $start_times = $_POST['start_time'] ?? [];
    $end_times = $_POST['end_time'] ?? [];

    try {
        $planDB->beginTransaction();

        foreach ($job_codes as $index => $job_code) {
            $work_plan_id = !empty($work_plan_ids[$index]) ? intval($work_plan_ids[$index]) : null;
            $job_name = $job_names[$index] ?? null;
            $start_time = $start_times[$index] ?? null;
            $end_time = $end_times[$index] ?? null;

            // ตรวจสอบรูปแบบเวลา
            if ($start_time && !isValidTime($start_time)) $start_time = null;
            if ($end_time && !isValidTime($end_time)) $end_time = null;

            if ($work_plan_id) {
                // 👉 UPDATE
                $stmt = $planDB->prepare("UPDATE work_plans SET
                    job_code = :job_code,
                    job_name = :job_name,
                    production_date = :production_date,
                    start_time = :start_time,
                    end_time = :end_time
                    WHERE id = :id");

                $stmt->execute([
                    ':job_code' => $job_code,
                    ':job_name' => $job_name,
                    ':production_date' => $production_date,
                    ':start_time' => $start_time,
                    ':end_time' => $end_time,
                    ':id' => $work_plan_id
                ]);

                // 👉 ลบ operators เดิมก่อน แล้ว insert ใหม่
                $planDB->prepare("DELETE FROM work_plan_operators WHERE work_plan_id = :id")
                       ->execute([':id' => $work_plan_id]);

            } else {
                // 👉 INSERT
                $stmt = $planDB->prepare("INSERT INTO work_plans (job_code, job_name, production_date, start_time, end_time)
                                          VALUES (:job_code, :job_name, :production_date, :start_time, :end_time)");
                $stmt->execute([
                    ':job_code' => $job_code,
                    ':job_name' => $job_name,
                    ':production_date' => $production_date,
                    ':start_time' => $start_time,
                    ':end_time' => $end_time
                ]);
                $work_plan_id = $planDB->lastInsertId();
            }

            // 👉 เพิ่ม operators (บันทึก user_id)
            $operators = [$operators1[$index], $operators2[$index], $operators3[$index], $operators4[$index]];
            foreach ($operators as $user_id) {
                if (!empty($user_id)) {
                    $opStmt = $planDB->prepare("INSERT INTO work_plan_operators (work_plan_id, user_id) VALUES (:work_plan_id, :user_id)");
                    $opStmt->execute([
                        ':work_plan_id' => $work_plan_id,
                        ':user_id' => $user_id
                    ]);
                }
            }
        }

        $planDB->commit();
        header('Location: ../workplan.html?success=1');
        exit();
    } catch (Exception $e) {
        $planDB->rollBack();
        die("❌ เกิดข้อผิดพลาด: " . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
