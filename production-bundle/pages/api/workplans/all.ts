import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await mysql.createConnection({ ...dbConfig, dateStrings: true });
    
    // ดึง workplans ทั้งหมด
    const [workPlans] = await connection.execute(
      'SELECT DISTINCT id, job_name, job_code FROM work_plans ORDER BY job_name ASC'
    );

    await connection.end();
    res.status(200).json(workPlans);
  } catch (error) {
    console.error('Database error:', error);
    let message = 'Internal server error';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    }
    res.status(500).json({ message, error });
  }
} 