import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker'
};

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST' || req.method === 'PUT') {
    // เพิ่ม/แก้ไข work plan
    const { job_name, operatorIds, start_time, end_time, date, id } = req.body;
    if (!job_name || !operatorIds || !Array.isArray(operatorIds) || operatorIds.length === 0 || !start_time || !end_time || !date) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    try {
      const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
      let workPlanId = id;
      // 1. หา job_code จาก process_steps หรือสร้าง temp-XXX
      let job_code = '';
      const [psRows] = await connection.execute('SELECT job_code FROM process_steps WHERE job_name = ? LIMIT 1', [job_name]);
      if ((psRows as any[]).length > 0) {
        job_code = (psRows as any[])[0].job_code;
      } else {
        // หา temp-XXX ล่าสุดของวันนั้น
        const [temps] = await connection.execute(
          "SELECT job_code FROM work_plans WHERE job_code LIKE 'temp-%' AND production_date = ? ORDER BY job_code DESC LIMIT 1",
          [date]
        );
        let nextNum = 1;
        if ((temps as any[]).length > 0) {
          const last = (temps as any[])[0].job_code;
          const match = last.match(/temp-(\d+)/);
          if (match) nextNum = parseInt(match[1]) + 1;
        }
        job_code = `temp-${nextNum.toString().padStart(3, '0')}`;
      }
      if (req.method === 'POST') {
        // insert work_plan
        const [result]: any = await connection.execute(
                  'INSERT INTO work_plans (job_code, job_name, start_time, end_time, production_date, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [job_code, job_name, start_time, end_time, date, 999]
        );
        workPlanId = result.insertId;
      } else if (req.method === 'PUT') {
        // update work_plan
        await connection.execute(
          'UPDATE work_plans SET job_code=?, job_name=?, start_time=?, end_time=?, production_date=? WHERE id=?',
          [job_code, job_name, start_time, end_time, date, id]
        );
        // ลบ operator เดิมก่อน
        await connection.execute('DELETE FROM work_plan_operators WHERE work_plan_id=?', [id]);
      }
      // insert operators (สูงสุด 4 คน) พร้อม id_code
      for (let i = 0; i < Math.min(operatorIds.length, 4); i++) {
        // ดึง id_code จาก users
        const [userRows] = await connection.execute('SELECT id_code FROM users WHERE id = ? LIMIT 1', [operatorIds[i]]);
        let id_code = null;
        if ((userRows as any[]).length > 0) id_code = (userRows as any[])[0].id_code;
        await connection.execute(
          'INSERT INTO work_plan_operators (work_plan_id, user_id, id_code) VALUES (?, ?, ?)',
          [workPlanId, operatorIds[i], id_code]
        );
      }
      await connection.end();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      let message = 'Internal server error';
      if (error && typeof error === 'object' && 'message' in error) {
        message = (error as any).message;
      }
      return res.status(500).json({ message, error });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
    const { date } = req.query;
    let workPlansQuery = '';
    let workPlansParams: any[] = [];
    if (date) {
      workPlansQuery = 'SELECT * FROM work_plans WHERE production_date = ? ORDER BY sort_order ASC, id ASC';
      workPlansParams = [date];
    } else {
      workPlansQuery = 'SELECT * FROM work_plans WHERE production_date = CURDATE() ORDER BY sort_order ASC, id ASC';
    }
    // 1. ดึง work_plans ของวันที่เลือก
    const [workPlans] = await connection.execute(workPlansQuery, workPlansParams);

    // 2. ดึง operators ทั้งหมดของ work_plans เหล่านี้
    const workPlanIds = (workPlans as any[]).map(wp => wp.id);
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

    // 3. ดึง logs ของ work_plans เหล่านี้
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

    // 5. รวมข้อมูล
    const now = new Date();
    const result = (workPlans as any[]).map(wp => {
      // operators
      const ops = operators.filter(o => o.work_plan_id === wp.id);
      const operator_names = ops.map(o => o.name).filter(Boolean).join(", ");
      const operator_codes = ops.map(o => o.id_code).filter(Boolean).join(", ");

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
      } else if (startLog && !stopLog) {
        // เวลาสด (now - start)
        production_minutes = Math.round((now.getTime() - new Date(actual_start_time).getTime()) / 60000);
      }

      // เวลามาตรฐาน
      const standard_minutes = formatStandardMinutes(wp.start_time, wp.end_time);

      // สถานะใหม่
      const finishedFlag = finishedFlags.find(f => f.work_plan_id === wp.id);
      let status = 'รอดำเนินการ';
      if (finishedFlag && finishedFlag.is_finished === 1) {
        status = 'เสร็จสิ้น';
      } else if (logsOfPlan.length > 0) {
        status = 'กำลังดำเนินการ';
      }

      return {
        id: wp.id,
        production_date: wp.production_date,
        job_code: wp.job_code,
        job_name: wp.job_name,
        start_time: wp.start_time,
        end_time: wp.end_time,
        operator_names: operator_names || '-',
        operator_codes: operator_codes || '-',
        actual_start_time,
        actual_end_time,
        status,
        production_minutes,
        standard_minutes,
        is_finished: finishedFlag ? finishedFlag.is_finished : 0
      };
    });

    await connection.end();
    res.status(200).json(result);
  } catch (error) {
    console.error('Database error:', error);
    let message = 'Internal server error';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    }
    res.status(500).json({ message, error });
  }
} 