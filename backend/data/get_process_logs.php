<?php
require_once __DIR__ . '/../includes/config_logsDB.php';
header('Content-Type: application/json');

$work_plan_id = $_GET['work_plan_id'] ?? null;
if (!$work_plan_id) {
    echo json_encode(['status' => 'error', 'message' => 'Missing work_plan_id']);
    exit;
}

try {
    $stmt = $logsDB->prepare("SELECT process_number, status, timestamp FROM logs WHERE work_plan_id = ? ORDER BY process_number ASC, timestamp ASC");
    $stmt->execute([$work_plan_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $result = [];
    foreach ($rows as $row) {
        $pn = $row['process_number'];
        if (!isset($result[$pn])) $result[$pn] = ['process_number' => $pn, 'start_time' => null, 'stop_time' => null, 'used_time' => null];
        if ($row['status'] === 'start') {
            $result[$pn]['start_time'] = $row['timestamp'];
        } elseif ($row['status'] === 'stop') {
            $result[$pn]['stop_time'] = $row['timestamp'];
        }
    }
    // คำนวณ used_time
    foreach ($result as &$proc) {
        if ($proc['start_time']) {
            $start = strtotime($proc['start_time']);
            if ($proc['stop_time']) {
                $stop = strtotime($proc['stop_time']);
                $proc['used_time'] = $stop - $start;
            } else {
                $proc['used_time'] = time() - $start;
            }
        }
    }
    // ส่งออกเรียงตาม process_number
    usort($result, function($a, $b) { return $a['process_number'] <=> $b['process_number']; });
    echo json_encode(['status' => 'success', 'data' => array_values($result)]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 