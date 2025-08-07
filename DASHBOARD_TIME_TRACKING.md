# การทำงานของข้อมูลเวลาผลิตในหน้า Dashboard

## ภาพรวม

หน้า Dashboard แสดงข้อมูลเวลาผลิตจริงที่ดึงมาจากฐานข้อมูล MySQL โดยมีการคำนวณและแสดงผลแบบ Real-time พร้อมฟีเจอร์ Live Timer สำหรับงานที่กำลังดำเนินการ

## โครงสร้างฐานข้อมูลที่เกี่ยวข้อง

### 1. ตาราง `work_plans`
- เก็บข้อมูลแผนงานการผลิต
- ฟิลด์สำคัญ: `start_time`, `end_time` (เวลามาตรฐาน)
- ใช้คำนวณเวลามาตรฐานที่ควรใช้

### 2. ตาราง `logs`
- เก็บข้อมูลการเริ่ม/หยุดงานจริง
- ฟิลด์สำคัญ: `status` ('start'/'stop'), `timestamp`
- ใช้คำนวณเวลาที่ใช้จริง

### 3. ตาราง `finished_flags`
- เก็บสถานะการเสร็จสิ้นของงาน
- ใช้กำหนดสถานะงาน

### 4. ตาราง `work_plan_operators`
- เก็บข้อมูลพนักงานที่เกี่ยวข้องกับงาน
- ใช้แสดงจำนวนพนักงานที่ทำงาน

## การคำนวณเวลาผลิต

### 1. เวลามาตรฐาน (Standard Time)
```javascript
function formatStandardMinutes(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60; // กรณีข้ามวัน
  return diff;
}
```

### 2. เวลาที่ใช้จริง (Production Time)
```javascript
// กรณีงานเสร็จแล้ว
if (startLog && stopLog) {
  production_minutes = Math.round(
    (new Date(actual_end_time).getTime() - new Date(actual_start_time).getTime()) / 60000
  );
}
// กรณีงานกำลังดำเนินการ
else if (startLog && !stopLog) {
  production_minutes = Math.round(
    (now.getTime() - new Date(actual_start_time).getTime()) / 60000
  );
}
```

## ฟีเจอร์ Live Timer

### การทำงาน
- **Real-time Counting**: นับเวลาแบบ Live ทุกวินาทีสำหรับงานที่กำลังดำเนินการ
- **Visual Indicator**: แสดงด้วยสีม่วงและไอคอน Timer พร้อม animation
- **Auto Stop**: หยุดนับอัตโนมัติเมื่อสถานะเปลี่ยนเป็น "เสร็จสิ้น"

### การแสดงผล
```javascript
// ตรวจสอบว่ามี live timer หรือไม่
const isLiveTimer = workPlan.status === 'กำลังดำเนินการ' && liveTimers[workPlan.id]
const displayTime = isLiveTimer ? liveTimers[workPlan.id] : workPlan.production_minutes

// แสดงผลแบบ Live Timer
{isLiveTimer ? (
  <div className="flex items-center">
    <Timer className="mr-1 h-3 w-3 text-purple-500" />
    {formatTimeFromMinutesShort(displayTime)}
  </div>
) : (
  // แสดงเวลาปกติ
)}
```

### การอัปเดต Live Timer
```javascript
// อัปเดตทุกวินาที
useEffect(() => {
  const timerInterval = setInterval(() => {
    setLiveTimers(prev => {
      const updated: {[key: number]: number} = {}
      Object.keys(prev).forEach(key => {
        const workPlanId = parseInt(key)
        const workPlan = dashboardData?.workPlans.find(wp => wp.id === workPlanId)
        
        // อัปเดตเฉพาะงานที่ยังกำลังดำเนินการ
        if (workPlan && workPlan.status === 'กำลังดำเนินการ' && workPlan.actual_start_time) {
          const startTime = new Date(workPlan.actual_start_time).getTime()
          const now = new Date().getTime()
          const elapsedMinutes = Math.round((now - startTime) / 60000)
          updated[workPlanId] = elapsedMinutes
        }
      })
      return updated
    })
  }, 1000) // อัปเดตทุกวินาที

  return () => clearInterval(timerInterval)
}, [dashboardData])
```

## API Endpoint: `/api/dashboard`

### การทำงาน
1. **ดึงข้อมูล Work Plans** ของวันที่เลือก
2. **ดึงข้อมูล Operators** ที่เกี่ยวข้อง
3. **ดึงข้อมูล Logs** การเริ่ม/หยุดงาน
4. **ดึงข้อมูล Finished Flags** สถานะการเสร็จสิ้น
5. **คำนวณสถิติรวม**:
   - เวลารวมการผลิต
   - จำนวนงานที่เสร็จสิ้น
   - จำนวนงานที่กำลังดำเนินการ
   - จำนวนพนักงานที่เกี่ยวข้อง
   - ประสิทธิภาพ (เวลาจริง/เวลามาตรฐาน)

### Response Format
```json
{
  "summary": {
    "totalWorkPlans": 15,
    "activeWorkPlans": 3,
    "completedWorkPlans": 8,
    "totalOperators": 12,
    "currentActiveTime": "01:30:00",
    "totalProductionTime": "08:45:00",
    "efficiency": "95%",
    "progress": "53%"
  },
  "workPlans": [
    {
      "id": 1,
      "job_name": "ซอสหมี่กะเฉด",
      "status": "กำลังดำเนินการ",
      "production_minutes": 90,
      "standard_minutes": 75,
      "operator_names": "สมชาย, สมหญิง",
      "actual_start_time": "2025-07-08T09:00:00",
      "actual_end_time": null
    }
  ],
  "timestamp": "2025-07-08T10:30:00.000Z"
}
```

## การแสดงผลในหน้า Dashboard

### 1. Status Cards
- **สถานะการผลิต**: แสดงจำนวนงานที่กำลังดำเนินการ
- **งานที่เสร็จสิ้น**: แสดงอัตราส่วนงานที่เสร็จ/ทั้งหมด
- **เวลาที่ใช้**: แสดงเวลารวมการผลิตในรูปแบบ HH:MM:SS
- **พนักงานที่ทำงาน**: แสดงจำนวนพนักงานที่เกี่ยวข้อง

### 2. Progress Bar
- แสดงความคืบหน้ารวมเป็นเปอร์เซ็นต์
- คำนวณจาก: (งานที่เสร็จสิ้น / งานทั้งหมด) × 100

### 3. สถิติการผลิต
- **งานทั้งหมด**: จำนวนงานในวันนั้น
- **ประสิทธิภาพ**: อัตราส่วนเวลาจริง/เวลามาตรฐาน
- **เวลาที่ใช้จริง**: เวลารวมการผลิต
- **เวลากำลังดำเนินการ**: เวลาของงานที่ยังไม่เสร็จ

### 4. รายการงานการผลิต
- แสดงรายละเอียดงานแต่ละรายการ
- **Live Timer**: แสดงเวลานับแบบ Real-time สำหรับงานที่กำลังดำเนินการ (สีม่วง)
- แสดงเวลาที่ใช้จริง vs เวลามาตรฐาน
- แสดงสถานะงาน (รอดำเนินการ/กำลังดำเนินการ/เสร็จสิ้น)
- แสดงพนักงานที่เกี่ยวข้อง

## การอัปเดตข้อมูล

### Auto Refresh
- หน้า Dashboard จะอัปเดตข้อมูลอัตโนมัติทุก 30 วินาที
- ใช้ `useEffect` และ `setInterval` ในการจัดการ

### Live Timer Update
- Live Timer อัปเดตทุกวินาที
- หยุดอัปเดตเมื่อสถานะงานเปลี่ยนเป็น "เสร็จสิ้น"

### Manual Refresh
- ปุ่ม "รีเฟรช" สำหรับอัปเดตข้อมูลทันที
- แสดงเวลาอัปเดตล่าสุด

## การจัดการ Error

### Loading State
- แสดง loading spinner ขณะโหลดข้อมูล
- ป้องกันการแสดงข้อมูลเก่า

### Error Handling
- แสดงข้อความ error เมื่อไม่สามารถดึงข้อมูลได้
- ปุ่ม "ลองใหม่" สำหรับ retry

## ข้อสังเกตสำคัญ

1. **เวลากำลังดำเนินการ**: คำนวณแบบ Real-time จากเวลาปัจจุบัน - เวลาเริ่มงาน
2. **Live Timer**: แสดงด้วยสีม่วงและไอคอน Timer พร้อม animation
3. **ประสิทธิภาพ**: เปรียบเทียบเวลาจริงกับเวลามาตรฐาน
4. **สถานะงาน**: กำหนดจาก logs และ finished_flags
5. **การแสดงเวลา**: แปลงจากนาทีเป็นรูปแบบ HH:MM:SS หรือ MM:SS สำหรับ Live Timer

## การปรับปรุงในอนาคต

1. เพิ่มกราฟแสดงแนวโน้มการผลิต
2. เพิ่มการเปรียบเทียบกับวันก่อนหน้า
3. เพิ่มการแจ้งเตือนเมื่องานล่าช้า
4. เพิ่มการ export ข้อมูลเป็นรายงาน
5. เพิ่มเสียงแจ้งเตือนเมื่องานเสร็จสิ้น
6. เพิ่มการแสดงเวลาที่เหลือตามเวลามาตรฐาน 