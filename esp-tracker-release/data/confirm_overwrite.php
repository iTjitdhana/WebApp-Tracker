<?php
session_start();
require_once __DIR__ . '/../includes/config_form_process.php';

$job_code = $_GET['job_code'] ?? '';
$form_data = $_SESSION['form_data'] ?? [];

if (!$job_code || empty($form_data)) {
  echo "<h3>ไม่พบข้อมูลสำหรับยืนยันการบันทึก</h3>";
  exit;
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ยืนยันการบันทึกซ้ำ</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container py-5">
    <div class="card shadow">
      <div class="card-body">
        <h4 class="mb-3">⚠️ มีข้อมูลของรหัสงานนี้อยู่แล้ว</h4>
        <p>คุณต้องการ <strong>บันทึกทับ</strong> รายการเดิมของ <code><?php echo htmlspecialchars($job_code); ?></code> หรือไม่?</p>

        <form method="post" action="save_process.php">
          <?php foreach ($form_data as $key => $value) : ?>
            <?php if (is_array($value)) : ?>
              <?php foreach ($value as $item) : ?>
                <input type="hidden" name="<?php echo htmlspecialchars($key); ?>[]" value="<?php echo htmlspecialchars($item); ?>">
              <?php endforeach; ?>
            <?php else : ?>
              <input type="hidden" name="<?php echo htmlspecialchars($key); ?>" value="<?php echo htmlspecialchars($value); ?>">
            <?php endif; ?>
          <?php endforeach; ?>
          <input type="hidden" name="overwrite" value="yes">
          <button type="submit" class="btn btn-danger">✅ ใช่, บันทึกทับ</button>
          <a href="index.html" class="btn btn-secondary ms-2">❌ ยกเลิก</a>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
