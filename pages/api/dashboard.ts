import { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker'
}

function formatStandardMinutes(start: string, end: string) {
  if (!start || !end) return null;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

function formatTimeDisplay(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0; // ไม่มีวินาทีในข้อมูลปัจจุบัน
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // 1. ดึง work_plans ของวันที่เลือก
    const [workPlans] = await connection.execute(
      'SELECT * FROM work_plans WHERE production_date = ? ORDER BY sort_order ASC, id ASC',
      [targetDate]
    );

    const workPlanIds = (workPlans as any[]).map(wp => wp.id);
    
    // 2. ดึง operators ทั้งหมด
    let operators = [];
    if (workPlanIds.length > 0) {
      const [ops] = await connection.execute(
        `SELECT wpo.work_plan_id, u.name, u.id_code
         FROM work_plan_operators wpo
         LEFT JOIN users u ON (wpo.user_id = u.id OR wpo.id_code = u.id_code)
         WHERE wpo.work_plan_id IN (${workPlanIds.join(",")})`
      );
      operators = ops as any[];
    }

    // 3. ดึง logs ทั้งหมด
    let logs = [];
    if (workPlanIds.length > 0) {
      const [ls] = await connection.execute(
        `SELECT * FROM logs WHERE work_plan_id IN (${workPlanIds.join(",")})`
      );
      logs = ls as any[];
    }

    // 4. ดึง finished_flags
    let finishedFlags = [];
    if (workPlanIds.length > 0) {
      const [ffs] = await connection.execute(
        `SELECT * FROM finished_flags WHERE work_plan_id IN (${workPlanIds.join(",")})`
      );
      finishedFlags = ffs as any[];
    }

    // 5. คำนวณข้อมูล Dashboard
    const now = new Date();
    let totalProductionMinutes = 0;
    let totalStandardMinutes = 0;
    let activeWorkPlans = 0;
    let completedWorkPlans = 0;
    let totalOperators = new Set();
    let currentActiveTime = 0;

    const workPlanDetails = (workPlans as any[]).map(wp => {
      // operators
      const ops = operators.filter(o => o.work_plan_id === wp.id);
      const operator_names = ops.map(o => o.name).filter(Boolean).join(", ");
      const operator_codes = ops.map(o => o.id_code).filter(Boolean).join(", ");
      
      // เพิ่ม operators ลงใน set
      ops.forEach(op => {
        if (op.id_code) totalOperators.add(op.id_code);
      });

      // logs
      const logsOfPlan = logs.filter(l => l.work_plan_id === wp.id);
      const startLog = logsOfPlan.filter(l => l.status === 'start').sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];
      const stopLog = logsOfPlan.filter(l => l.status === 'stop').sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      let actual_start_time = startLog ? startLog.timestamp : null;
      let actual_end_time = stopLog ? stopLog.timestamp : null;
      let production_minutes = null;
      
      if (startLog && stopLog) {
        // เวลาที่ใช้จริง (stop - start)
        production_minutes = Math.round((new Date(actual_end_time).getTime() - new Date(actual_start_time).getTime()) / 60000);
        totalProductionMinutes += production_minutes;
      } else if (startLog && !stopLog) {
        // เวลาสด (now - start)
        production_minutes = Math.round((now.getTime() - new Date(actual_start_time).getTime()) / 60000);
        totalProductionMinutes += production_minutes;
        currentActiveTime += production_minutes;
        activeWorkPlans++;
      }

      // เวลามาตรฐาน
      const standard_minutes = formatStandardMinutes(wp.start_time, wp.end_time);
      if (standard_minutes) totalStandardMinutes += standard_minutes;

      // สถานะ
      const finishedFlag = finishedFlags.find(f => f.work_plan_id === wp.id);
      let status = 'รอดำเนินการ';
      if (finishedFlag && finishedFlag.is_finished === 1) {
        status = 'เสร็จสิ้น';
        completedWorkPlans++;
      } else if (logsOfPlan.length > 0) {
        status = 'กำลังดำเนินการ';
        activeWorkPlans++;
      }

      return {
        id: wp.id,
        job_name: wp.job_name,
        status,
        production_minutes,
        standard_minutes,
        operator_names: operator_names || '-',
        actual_start_time,
        actual_end_time
      };
    });

    // 6. คำนวณสถิติรวม
    const efficiency = totalStandardMinutes > 0 ? Math.round((totalProductionMinutes / totalStandardMinutes) * 100) : 0;
    const progress = (workPlans as any[]).length > 0 ? Math.round((completedWorkPlans / (workPlans as any[]).length) * 100) : 0;

    // 7. สร้างข้อมูล Dashboard
    const dashboardData = {
      summary: {
        totalWorkPlans: (workPlans as any[]).length,
        activeWorkPlans,
        completedWorkPlans,
        totalOperators: totalOperators.size,
        currentActiveTime: formatTimeDisplay(currentActiveTime),
        totalProductionTime: formatTimeDisplay(totalProductionMinutes),
        efficiency: `${efficiency}%`,
        progress: `${progress}%`
      },
      workPlans: workPlanDetails,
      timestamp: now.toISOString()
    };

    await connection.end();
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Database error:', error);
    let message = 'Internal server error';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    }
    res.status(500).json({ message, error });
  }
} 