// ✅ scriptdemo.js ปรับให้แสดงเวลาในรายการ และอัปเดต stepTimes กลับเข้า currentProcessSteps
let number = 1;
let timerStart;
let timerInterval;
let currentProcessSteps = [];
let stepTimes = {};
const MAX_STEP = 12;

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
  if (number < 1) number = 1;
  if (number > MAX_STEP) number = MAX_STEP;
  updateDisplay();
  updateCurrentProcessDisplay();
  updateArrowState();
  renderProcessList(currentProcessSteps);
}

function updateDisplay() {
  document.getElementById("num-display").textContent = pad(number);
  document.getElementById("start-time").textContent = "–";
  document.getElementById("stop-time").textContent = "–";
  document.getElementById("used-time").textContent = "–";
}

function updateArrowState() {
  document.getElementById("arrow-left").disabled = number <= 1;
  document.getElementById("arrow-right").disabled = number >= MAX_STEP;
}

function updateCurrentProcessDisplay() {
  const stepData = currentProcessSteps.find((step) => step.process_number == number);
  document.getElementById("current-process-name").textContent = stepData ? stepData.process_description : "–";
  const times = stepTimes[number] || {};
  document.getElementById("start-time").textContent = times.start ? formatToHM(times.start) : "–";
  document.getElementById("stop-time").textContent = times.stop ? formatToHM(times.stop) : "–";
  document.getElementById("used-time").textContent = times.used || "–";
}

function renderProcessList(steps) {
  const container = document.getElementById("process-list");
  container.innerHTML = "";
  for (const step of steps) {
    const item = document.createElement("div");
    item.classList.add("list-group-item", "process-item");
    const stepNum = pad(step.process_number);
    const stepDesc = step.process_description;
    if (step.process_number == number) {
      item.classList.add("active");
    }
    const start = step.start ? formatToHM(step.start) : "–";
    const end = step.end ? formatToHM(step.end) : "–";
    const used = step.used_time || "–";
    item.innerHTML = `
      <div class="d-flex justify-content-between mb-1">
        <span><span class="badge rounded-pill bg-secondary">${stepNum}</span> ${stepDesc}</span>
        <span class="badge ${step.end ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}">
          ${step.end ? "เสร็จแล้ว" : "กำลังทำงาน"}
        </span>
      </div>
      <div class="small text-muted">
        เริ่ม: <span class="text-success">${start}</span> |
        สิ้นสุด: <span class="text-danger">${end}</span> |
        ใช้เวลา: <span class="text-primary">${used}</span>
      </div>
    `;
    container.appendChild(item);
  }
}

function sendToLocal(isStart) {
  const jobNumber = document.getElementById("device-select").value;
  if (!jobNumber) return alert("กรุณาเลือกงานที่ผลิตก่อน");
  const timestamp = getCurrentTimeISO();
  const status = isStart ? "start" : "stop";

  if (isStart) {
    clearInterval(timerInterval);
    timerStart = new Date();
    stepTimes[number] = { start: timerStart.toISOString() };
    document.getElementById("start-time").textContent = formatToHM(timerStart);
    timerInterval = setInterval(() => {
      const now = new Date();
      const usedMs = now - timerStart;
      const minutes = Math.floor(usedMs / 60000);
      const seconds = Math.floor((usedMs % 60000) / 1000);
      document.getElementById("used-time").textContent = `${pad(minutes)}:${pad(seconds)}`;
    }, 1000);
  } else {
    clearInterval(timerInterval);
    const stopTime = new Date();
    const start = stepTimes[number]?.start ? new Date(stepTimes[number].start) : null;
    if (start) {
      const usedMs = stopTime - start;
      const minutes = Math.floor(usedMs / 60000);
      const seconds = Math.floor((usedMs % 60000) / 1000);
      stepTimes[number].stop = stopTime.toISOString();
      stepTimes[number].used = `${pad(minutes)}:${pad(seconds)}`;
      document.getElementById("stop-time").textContent = formatToHM(stopTime);
      document.getElementById("used-time").textContent = stepTimes[number].used;
    }
  }

  fetch("data/savedemo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_number: jobNumber, number: pad(number), timestamp, status })
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("status-log").textContent = data.success ?
        "✅ เริ่มจับเวลา" : "❌ " + data.error;

      // ✅ อัปเดต currentProcessSteps จาก stepTimes
      for (const step of currentProcessSteps) {
        if (step.process_number == number) {
          const times = stepTimes[number] || {};
          step.start = times.start || null;
          step.end = times.stop || null;
          step.used_time = times.used || null;
        }
      }

      renderProcessList(currentProcessSteps);
      updateCurrentProcessDisplay();
    })
    .catch((err) => {
      document.getElementById("status-log").textContent = "❌ เกิดข้อผิดพลาด";
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", updateArrowState);
