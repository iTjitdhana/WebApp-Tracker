import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'ต้องระบุ id' });
  }

  if (req.method === 'DELETE') {
    // ลบทั้ง work_plan และ work_plan_operators
    try {
      const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
      
      // ลบ work_plan_operators ก่อน (foreign key constraint)
      await connection.execute('DELETE FROM work_plan_operators WHERE work_plan_id=?', [id]);
      
      // ลบ work_plans
      await connection.execute('DELETE FROM work_plans WHERE id=?', [id]);
      
      await connection.end();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ message: 'ลบไม่สำเร็จ', error });
    }
  }

  if (req.method === 'GET') {
    // ดึงข้อมูล workplan เฉพาะ
    try {
      const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
      
      // ดึง workplan
      const [workPlans] = await connection.execute(
        'SELECT * FROM work_plans WHERE id = ?',
        [id]
      );

      if ((workPlans as any[]).length === 0) {
        await connection.end();
        return res.status(404).json({ message: 'ไม่พบ workplan' });
      }

      const workPlan = (workPlans as any[])[0];

      // ดึง operators
      const [operators] = await connection.execute(
        `SELECT u.id, u.name, u.id_code
         FROM work_plan_operators wpo
         LEFT JOIN users u ON (wpo.user_id = u.id OR wpo.id_code = u.id_code)
         WHERE wpo.work_plan_id = ?`,
        [id]
      );

      await connection.end();
      
      return res.status(200).json({
        ...workPlan,
        operators: operators as any[]
      });
    } catch (error) {
      console.error('Get error:', error);
      return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ', error });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 