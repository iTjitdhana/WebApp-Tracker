let number = 1;
let timerInterval;
let timerStart;
let currentProcessSteps = [];

function pad(n) {
  return n.toString().padStart(2, "0");
}

function formatToHM(timeStr) {
  const date = new Date(timeStr);
  if (isNaN(date.getTime())) return "–";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getCurrentTimeISO() {
  const now = new Date();
  return now.toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" }).replace(" ", "T");
}

function changeNumber(step) {
  number += step;
  if (number > 12) number = 1;
  if (number < 1) number = 12;
  updateDisplay();
  updateCurrentProcessDisplay();
}

function updateDisplay() {
  const numDisplay = document.getElementById("num-display");
  if (numDisplay) {
    numDisplay.textContent = number.toString().padStart(2, "0");
  }
  clearInterval(timerInterval);
  document.getElementById("used-time").textContent = "–";
}

function updateCurrentProcessDisplay() {
  const stepNumber = number;
  const currentStep = currentProcessSteps.find(
    (s) => parseInt(s.process_number) === stepNumber
  );
  console.log("🔁 updateCurrentProcessDisplay:", {
    stepNumber,
    currentStep,
    currentProcessSteps,
  });

  const display = document.getElementById("current-process-name");
  if (display) {
    display.textContent = currentStep
      ? currentStep.process_description
      : "– ไม่พบขั้นตอน –";
  }
}

function sendToLocal(isStart) {
  const select = document.getElementById("device-select");
  const deviceId = select.options[select.selectedIndex].text;
  const timestamp = getCurrentTimeISO();
  const statusLog = document.getElementById("status-log");

  statusLog.className = "status-log bg-light";
  statusLog.textContent = `กำลังส่ง (${isStart ? "เริ่มงาน" : "หยุดงาน"})...`;

  fetch("data/save.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `number=${number}&timestamp=${timestamp}&sheetName=Data&deviceId=${deviceId}&status=${
      isStart ? "start" : "stop"
    }`,
  })
    .then((res) => res.text())
    .then(() => {
      statusLog.classList.add(isStart ? "status-success" : "status-fail");
      statusLog.textContent = isStart ? "✅ เริ่มงานเเล้ว" : "⛔ หยุดงานเเล้ว";

      const startEl = document.getElementById("start-time");
      const stopEl = document.getElementById("stop-time");
      const usedEl = document.getElementById("used-time");

      if (isStart) {
        startEl.textContent = formatToHM(timestamp);
        stopEl.textContent = "–";
        usedEl.textContent = "⌑ 00:00:00";
        timerStart = new Date();
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          const diff = Math.floor((new Date() - timerStart) / 1000);
          const h = Math.floor(diff / 3600);
          const m = Math.floor((diff % 3600) / 60);
          const s = diff % 60;
          usedEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        }, 1000);
      } else {
        stopEl.textContent = formatToHM(timestamp);
        clearInterval(timerInterval);
      }
    })
    .catch((err) => {
      statusLog.className = "status-log status-fail";
      statusLog.textContent = "❌ เกิดข้อผิดพลาดในการส่ง";
      console.error(err);
    });
}

function updateFromDropdown() {
  const select = document.getElementById("device-select");
  const jobNumber = select.value;
  const today = new Date().toISOString().split("T")[0];

  fetch(`data/get_process_from_workplan.php?date=${today}&job_number=${jobNumber}`)
    .then((res) => res.json())
    .then((data) => {
      // อัปเดตรหัสงาน (ด้านบนถ้ามี)
      const jobNameDisplay = document.getElementById("job-name-display");
      if (jobNameDisplay) jobNameDisplay.textContent = data.job_code || "-";

      // ✅ Reset ข้อมูลใหม่ทั้งหมด
      currentProcessSteps = data.steps || [];

      // ✅ ตั้งค่าเป็นขั้นตอนที่ 1 ใหม่
      number = 1;

      // ✅ อัปเดต UI ใหม่หลังเปลี่ยนงาน
      updateDisplay();                 // กล่องตัวเลข
      updateCurrentProcessDisplay();  // ข้อความ "ขั้นตอนการผลิต"
    })
    .catch((err) => {
      console.error("เกิดข้อผิดพลาด:", err);
    });
}


document.addEventListener("DOMContentLoaded", () => {
  updateFromDropdown();
  updateDisplay();
});
