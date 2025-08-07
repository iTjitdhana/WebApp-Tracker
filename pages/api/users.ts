import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || '192.168.0.93',
  user: process.env.DB_USER || 'it.jitdhana',
  password: process.env.DB_PASSWORD || 'iT12345$',
  database: process.env.DB_NAME || 'esp_tracker',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conn = await mysql.createConnection(dbConfig)
    const [rows] = await conn.execute('SELECT id, name FROM users ORDER BY name ASC')
    conn.end()
    res.status(200).json(rows)
  } catch (e) {
    res.status(500).json({ error: 'DB error' })
  }
} 