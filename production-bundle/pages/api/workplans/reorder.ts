import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { workPlanIds, date } = req.body;
  
  if (!workPlanIds || !Array.isArray(workPlanIds) || workPlanIds.length === 0) {
    return res.status(400).json({ message: 'ต้องระบุ workPlanIds เป็น array' });
  }

  if (!date) {
    return res.status(400).json({ message: 'ต้องระบุ date' });
  }

  try {
    // ตรวจสอบว่า table มี sort_order column หรือไม่
    const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
    
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'work_plans' AND COLUMN_NAME = 'sort_order'
    `, [dbConfig.database]);
    
    if ((columns as any[]).length === 0) {
      await connection.end();
      return res.status(400).json({ 
        message: 'ฟีเจอร์เรียงลำดับไม่พร้อมใช้งาน - ต้องเพิ่ม sort_order column ใน database ก่อน',
        error: 'Database schema missing sort_order column'
      });
    }
    
    // ถ้ามี sort_order column ให้อัปเดตลำดับ
    for (let i = 0; i < workPlanIds.length; i++) {
      await connection.execute(
        'UPDATE work_plans SET sort_order = ? WHERE id = ? AND production_date = ?',
        [i + 1, workPlanIds[i], date]
      );
    }
    
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return res.status(500).json({ message: 'อัปเดตลำดับไม่สำเร็จ', error });
  }
} 