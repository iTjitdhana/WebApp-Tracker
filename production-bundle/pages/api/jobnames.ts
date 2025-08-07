import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = (req.query.q || '').toString()
  try {
    const conn = await mysql.createConnection(dbConfig)
    let sql = 'SELECT DISTINCT job_name FROM process_steps'
    let params: any[] = []
    if (q) {
      sql += ' WHERE job_name LIKE ?'
      params.push(`%${q}%`)
    }
    sql += ' ORDER BY job_name ASC'
    const [rows] = await conn.execute(sql, params)
    conn.end()
    res.status(200).json((rows as any[]).map((r: any) => r.job_name))
  } catch (e) {
    res.status(500).json({ error: 'DB error' })
  }
} 